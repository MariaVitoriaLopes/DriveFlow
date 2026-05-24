import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';
import { FormInformacoesPessoais } from '../../../components/forms/form-informacoes-pessoais/form-informacoes-pessoais';
import { ConfigSistema } from '../../../components/forms/config-sistema/config-sistema';

type AbaConfig = 'pessoais' | 'configuracoes';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderAluno,
    FormInformacoesPessoais,
    ConfigSistema,
  ],
  templateUrl: './configuracoes.html',
  styleUrls: ['./configuracoes.scss'],
})
export class ConfiguracoesA implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  apiUrl = 'http://localhost:8081/api/usuarios';

  usuarioLogado: any = {};
  usuarioId = '';

  abasValidas: AbaConfig[] = ['pessoais', 'configuracoes'];
  abaAtiva: AbaConfig = 'pessoais';

  usuario: any = {
    nome: 'Aluno'
  };

  formPessoais = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    cpf: [''],
    dataNascimento: ['']
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
    console.log('ID USADO NAS CONFIGURAÇÕES DO ALUNO:', this.usuarioId);
  }

carregarConfiguracoes(): void {
  if (!this.usuarioId) {
    alert('ID do usuário não encontrado. Faça login novamente.');
    return;
  }

  this.http.get<any[]>(this.apiUrl).subscribe({
    next: (usuarios) => {
      const aluno = usuarios.find((u) => u.id === this.usuarioId);

      if (!aluno) {
        alert('Aluno não encontrado na lista de usuários.');
        return;
      }

      this.usuario = aluno;

      this.formPessoais.patchValue({
        nome: aluno.nome || '',
        email: aluno.email || '',
        cpf: aluno.cpf || '',
        dataNascimento: aluno.dataNascimento || ''
      });

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erro ao buscar dados do aluno:', err);
      alert('Erro ao buscar dados do aluno.');
    }
  });
}

  trocarAba(aba: AbaConfig): void {
    this.abaAtiva = aba;
  }

salvarPessoais(): void {
  if (this.formPessoais.invalid) {
    this.formPessoais.markAllAsTouched();
    return;
  }

  const dados = this.formPessoais.value;

  this.http.put(
    `${this.apiUrl}/${this.usuarioId}/dados-pessoais`,
    dados
  ).subscribe({
    next: () => {
      alert('Dados salvos com sucesso.');
    },
    error: (err) => {
      console.error('Erro ao salvar dados pessoais:', err);
      alert('Erro ao salvar dados pessoais.');
    }
  });
}

  salvarConfiguracoes(): void {
    console.log('Configurações:', this.formConfiguracoes.value);
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
        alert('Erro ao apagar conta.');
      }
    });
  }
}