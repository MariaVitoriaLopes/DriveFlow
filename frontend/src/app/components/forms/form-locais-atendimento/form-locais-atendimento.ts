import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface LocalAtendimento {
  id?: string;
  titulo?: string;
  cep: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  favorito: boolean;
}

@Component({
  selector: 'app-form-locais-atendimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './form-locais-atendimento.html',
  styleUrls: ['./form-locais-atendimento.scss'],
})
export class FormLocaisAtendimento implements OnInit {
  formLocais!: FormGroup;

  apiUrl = 'http://localhost:8081/api/instrutores/configuracoes';
  usuarioId = localStorage.getItem('usuarioId') || '';

  modoEdicao: { [index: number]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.formLocais = this.fb.group({
      enderecos: this.fb.array([])
    });

    this.carregarLocaisDoBanco();
  }

  get enderecos(): FormArray {
    return this.formLocais.get('enderecos') as FormArray;
  }

  criarEndereco(endereco?: LocalAtendimento): FormGroup {
    const grupo = this.fb.group({
      id: [endereco?.id || ''],
      titulo: [endereco?.titulo || `Endereço ${this.enderecos.length + 1}`],
      cep: [endereco?.cep || '', Validators.required],
      logradouro: [endereco?.logradouro || '', Validators.required],
      numero: [endereco?.numero || ''],
      complemento: [endereco?.complemento || ''],
      bairro: [endereco?.bairro || ''],
      cidade: [endereco?.cidade || ''],
      uf: [endereco?.uf || ''],
      favorito: [endereco?.favorito || false]
    });

    grupo.disable();
    this.monitorarCep(grupo);

    return grupo;
  }

  carregarLocaisDoBanco(): void {
    if (!this.usuarioId) {
      alert('ID do usuário não encontrado.');
      return;
    }

    this.http.get<any>(`${this.apiUrl}/${this.usuarioId}`).subscribe({
      next: (instrutor) => {
        this.enderecos.clear();

        const locais = instrutor.locaisAtendimento || [];

        locais.forEach((local: LocalAtendimento, index: number) => {
          this.enderecos.push(this.criarEndereco({
            ...local,
            titulo: `Endereço ${index + 1}`
          }));
          this.modoEdicao[index] = false;
        });
      },
      error: (err) => {
        console.error('Erro ao carregar locais:', err);
        alert('Erro ao carregar locais de atendimento.');
      }
    });
  }

  adicionarEnderecoTemporario(): void {
    const novo = this.fb.group({
      id: [''],
      titulo: [`Endereço ${this.enderecos.length + 1}`],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: [''],
      favorito: [false]
    });

    this.monitorarCep(novo);
    this.enderecos.push(novo);

    const index = this.enderecos.length - 1;
    this.modoEdicao[index] = true;
  }

  editarEndereco(index: number): void {
    this.modoEdicao[index] = true;
    this.enderecos.at(index).enable();
  }

  marcarFavorito(indexSelecionado: number): void {
    this.enderecos.controls.forEach((ctrl, index) => {
      ctrl.get('favorito')?.setValue(index === indexSelecionado);
    });
  }

  deletarEndereco(index: number): void {
    const local = this.enderecos.at(index).getRawValue();

    if (!local.id) {
      this.enderecos.removeAt(index);
      return;
    }

    this.http.delete<any>(`${this.apiUrl}/${this.usuarioId}/locais/${local.id}`).subscribe({
      next: (instrutor) => {
        this.enderecos.clear();

        const locais = instrutor.locaisAtendimento || [];
        locais.forEach((endereco: LocalAtendimento, i: number) => {
          this.enderecos.push(this.criarEndereco({
            ...endereco,
            titulo: `Endereço ${i + 1}`
          }));
          this.modoEdicao[i] = false;
        });

        alert('Endereço deletado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao deletar endereço:', err);
        alert('Erro ao deletar endereço.');
      }
    });
  }

  descartarAlteracoes(): void {
    this.carregarLocaisDoBanco();
  }

  salvarAlteracoes(): void {
    if (this.formLocais.invalid) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const locais: LocalAtendimento[] = this.enderecos.getRawValue().map((local: any) => ({
      id: local.id || undefined,
      cep: local.cep,
      logradouro: local.logradouro,
      numero: local.numero,
      complemento: local.complemento,
      bairro: local.bairro,
      cidade: local.cidade,
      uf: local.uf,
      favorito: local.favorito
    }));

    this.http.put<any>(`${this.apiUrl}/${this.usuarioId}/locais`, locais).subscribe({
      next: (instrutor) => {
        this.enderecos.clear();

        const locaisAtualizados = instrutor.locaisAtendimento || [];
        locaisAtualizados.forEach((endereco: LocalAtendimento, index: number) => {
          this.enderecos.push(this.criarEndereco({
            ...endereco,
            titulo: `Endereço ${index + 1}`
          }));
          this.modoEdicao[index] = false;
        });

        alert('Alterações salvas com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar locais:', err);
        alert('Erro ao salvar locais de atendimento.');
      }
    });
  }

  monitorarCep(grupo: FormGroup): void {
    grupo.get('cep')?.valueChanges.subscribe((cep) => {
      if (!cep || grupo.disabled) return;

      const cepLimpo = cep.replace(/\D/g, '');

      if (cepLimpo.length === 8) {
        this.buscarEnderecoPorCep(cepLimpo, grupo);
      }
    });
  }

  buscarEnderecoPorCep(cep: string, grupo: FormGroup): void {
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        if (!data.erro) {
          grupo.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
          });
        }
      },
      error: (err) => console.error('Erro ao buscar CEP:', err)
    });
  }
}