import { 
  Component, 
  inject, 
  OnInit, 
  ChangeDetectorRef,
 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { FormVeiculos, Veiculo } from '../../../components/forms/form-veiculos/form-veiculos';
import { FormAddNovoVeiculo } from '../../../components/forms/form-add-novo-veiculo/form-add-novo-veiculo';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderInstrutor,
    FormVeiculos,
    FormAddNovoVeiculo
  ],
  templateUrl: './configuracoes.html',
  styleUrls: ['./configuracoes.scss'],
})
export class Configuracoes implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);

  apiUrl = 'http://localhost:8081/api/instrutores/configuracoes';

  usuarioLogado: any = {};
  usuarioId = '';

  abaAtiva: 'pessoais' | 'endereco' | 'veiculo' | 'documentos' | 'configuracoes' = 'pessoais';

  usuario: any = {
    nome: 'João Santos'
  };

  veiculos: Veiculo[] = [];
  mostrandoFormNovoVeiculo = false;

  formPessoais = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    cpf: [''],
    dataNascimento: ['']
  });

  formEndereco = this.fb.group({
    cep: [''],
    logradouro: [''],
    numero: [''],
    complemento: [''],
    bairro: [''],
    cidade: [''],
    uf: ['']
  });

  formVeiculo = this.fb.group({
    marca: [''],
    modelo: [''],
    placa: [''],
    cor: ['']
  });

  formDocumentos = this.fb.group({
    cnh: [''],
    documentoVeiculo: ['']
  });

  formConfiguracoes = this.fb.group({
    notificacoes: [true],
    emailPromocional: [false]
  });

  ngOnInit(): void {
    const user = localStorage.getItem('usuario');
    if (user) {
      this.usuario = JSON.parse(user);
    }

    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const aba = params['aba'];
      if (aba && ['pessoais','endereco','veiculo','documentos','configuracoes'].includes(aba)) {
        this.abaAtiva = aba as any;
      }
    });
  }

    ngOnInit(): void {

      this.route.queryParams.subscribe((params: any) => {
        this.abaAtiva = params['aba'] || 'pessoais';
      });

      this.carregarUsuarioLogado();
      this.carregarConfiguracoes();
    }

  carregarUsuarioLogado(): void {
    const usuarioStorage = localStorage.getItem('usuario');
    const usuarioIdStorage = localStorage.getItem('usuarioId');

    if (usuarioStorage) {
      try {
        this.usuarioLogado = JSON.parse(usuarioStorage);
      } catch (error) {
        console.error('Erro ao converter usuário do localStorage:', error);
        this.usuarioLogado = {};
      }
    }

    this.usuarioId =
      usuarioIdStorage ||
      this.usuarioLogado.id ||
      this.usuarioLogado._id ||
      this.usuarioLogado.usuarioId ||
      '';

    console.log('USUÁRIO LOGADO:', this.usuarioLogado);
    console.log('ID USADO NAS CONFIGURAÇÕES:', this.usuarioId);
  }

  carregarConfiguracoes(): void {
    if (!this.usuarioId) {
      alert('ID do usuário não encontrado. Faça login novamente.');
      return;
    }

    this.http.get<any>(`${this.apiUrl}/${this.usuarioId}`).subscribe({
      next: (instrutor) => {
        this.usuario = instrutor;
        this.veiculos = instrutor.veiculos || [];

        this.formPessoais.patchValue({
          nome: instrutor.nome || this.usuarioLogado.nome || '',
          email: instrutor.email || this.usuarioLogado.email || ''
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar configurações:', err);
        alert('Erro ao buscar dados do instrutor.');
      }
    });
  }

  trocarAba(aba: 'pessoais' | 'endereco' | 'veiculo' | 'documentos' | 'configuracoes'): void {
    this.abaAtiva = aba;
  }

  abrirFormNovoVeiculo(): void {
    this.mostrandoFormNovoVeiculo = true;
  }

  cancelarNovoVeiculo(): void {
    this.mostrandoFormNovoVeiculo = false;
  }

  salvarNovoVeiculo(veiculo: Veiculo): void {
    const novaLista = [...this.veiculos, veiculo];
    this.salvarListaVeiculos(novaLista, true);
  }

  atualizarVeiculo(veiculoAtualizado: Veiculo): void {
    const novaLista = this.veiculos.map(v =>
      v.id === veiculoAtualizado.id ? veiculoAtualizado : v
    );

    this.salvarListaVeiculos(novaLista);
  }

  deletarVeiculo(veiculo: Veiculo): void {
    if (!veiculo.id) return;

    this.http.delete<any>(`${this.apiUrl}/${this.usuarioId}/veiculos/${veiculo.id}`).subscribe({
      next: (instrutor) => {
        this.veiculos = instrutor.veiculos || [];
        alert('Veículo deletado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao deletar veículo:', err);
        alert('Erro ao deletar veículo.');
      }
    });
  }

  salvarListaVeiculos(lista: Veiculo[], fecharForm = false): void {
    this.http.put<any>(`${this.apiUrl}/${this.usuarioId}/veiculos`, lista).subscribe({
      next: (instrutor) => {
        this.veiculos = instrutor.veiculos || [];
        this.mostrandoFormNovoVeiculo = !fecharForm;

        this.cdr.detectChanges();

        alert('Veículo salvo com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar veículo:', err);
        alert('Erro ao salvar veículo.');
      }
    });
  }

  salvarPessoais(): void {
    console.log(this.formPessoais.value);
  }

  salvarEndereco(): void {
    console.log(this.formEndereco.value);
  }

  salvarVeiculo(): void {
    console.log(this.formVeiculo.value);
  }

  salvarDocumentos(): void {
    console.log(this.formDocumentos.value);
  }

  salvarConfiguracoes(): void {
    console.log(this.formConfiguracoes.value);
  }
}