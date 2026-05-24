import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';

import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { FormVeiculos, Veiculo } from '../../../components/forms/form-veiculos/form-veiculos';
import { FormAddNovoVeiculo } from '../../../components/forms/form-add-novo-veiculo/form-add-novo-veiculo';
import { FormLocaisAtendimento } from '../../../components/forms/form-locais-atendimento/form-locais-atendimento';
import { FormInformacoesPessoais } from '../../../components/forms/form-informacoes-pessoais/form-informacoes-pessoais';
import { ConfigSistema } from '../../../components/forms/config-sistema/config-sistema';
import { FormDocumentos } from '../../../components/forms/form-documentos/form-documentos';

type AbaConfig = 'pessoais' | 'endereco' | 'veiculo' | 'documentos' | 'configuracoes';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderInstrutor,
    FormVeiculos,
    FormAddNovoVeiculo,
    FormLocaisAtendimento,
    FormInformacoesPessoais,
    ConfigSistema,
    FormDocumentos,
  ],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  apiUrl = 'http://localhost:8081/api/instrutores/configuracoes';

  usuarioLogado: any = {};
  usuarioId = '';

  abasValidas: AbaConfig[] = ['pessoais', 'endereco', 'veiculo', 'documentos', 'configuracoes'];
  abaAtiva: AbaConfig = 'pessoais';

  usuario: any = {
    nome: 'João Santos'
  };

  veiculos: Veiculo[] = [];
  mostrandoFormNovoVeiculo = false;
  modalAberto = false;

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
    this.carregarUsuarioLogado();

    this.route.queryParams.subscribe((params: any) => {
      const aba = params['aba'];

      if (aba && this.abasValidas.includes(aba)) {
        this.abaAtiva = aba;
      }
    });

    this.carregarConfiguracoes();
  }

carregarUsuarioLogado(): void {
  const usuarioStorage = localStorage.getItem('usuario');
  const usuarioIdStorage = localStorage.getItem('usuarioId');

  if (usuarioStorage) {
    try {
      this.usuarioLogado = JSON.parse(usuarioStorage);
      this.usuario = this.usuarioLogado;
    } catch (error) {
      console.error('Erro ao converter usuário do localStorage:', error);
      this.usuarioLogado = {};
    }
  }

  this.usuarioId =
    usuarioIdStorage ||
    this.usuarioLogado.id ||
    this.usuarioLogado?.usuario?.id ||
    '';

  if (this.usuarioId) {
    localStorage.setItem('usuarioId', this.usuarioId);
  }

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
        console.log('CONFIGURAÇÕES RECEBIDAS:', instrutor);

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

  trocarAba(aba: AbaConfig): void {
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
    this.salvarListaVeiculos(novaLista);
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
        this.cdr.detectChanges();
        alert('Veículo deletado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao deletar veículo:', err);
        alert('Erro ao deletar veículo.');
      }
    });
  }

  salvarListaVeiculos(lista: Veiculo[]): void {
    this.http.put<any>(`${this.apiUrl}/${this.usuarioId}/veiculos`, lista).subscribe({
      next: (instrutor) => {
        this.veiculos = instrutor.veiculos || [];
        this.mostrandoFormNovoVeiculo = false;
        this.abaAtiva = 'veiculo';

        this.cdr.detectChanges();

        alert('Veículo salvo com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar veículo:', err);
        alert('Erro ao salvar veículo.');
      }
    });
  }

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

selecionarDocumento(tipo: string): void {

  console.log('Documento selecionado:', tipo);

  this.modalAberto = false;

  this.router.navigate(['/instrutor/add-novo-documento'], {
    queryParams: {
      tipoDocumento: tipo
    }
  });
}

  trackByVeiculoId(index: number, veiculo: Veiculo): string {
    return veiculo.id || index.toString();
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

  apagarMinhaConta(): void {
  if (!this.usuarioId) {
    alert('ID do usuário não encontrado. Faça login novamente.');
    return;
  }

  const confirmar = confirm(
    'Tem certeza que deseja apagar sua conta? Essa ação não poderá ser desfeita.'
  );

  if (!confirmar) return;

  this.http.delete(`http://localhost:8081/api/usuarios/${this.usuarioId}`).subscribe({
    next: () => {
      alert('Conta apagada com sucesso.');

      localStorage.removeItem('usuario');
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('token');

      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Erro ao apagar conta:', err);
      alert('Erro ao apagar conta. Verifique se a rota DELETE /api/usuarios/{id} existe no backend.');
    }
  });
}
}