import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-informacoes-pessoais',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-informacoes-pessoais.html',
  styleUrls: ['./form-informacoes-pessoais.scss'],
})
export class FormInformacoesPessoais implements OnInit {
  form: FormGroup;

  selectedFile: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;

  usuarioId = '';
  perfil: 'ALUNO' | 'INSTRUTOR' = 'ALUNO';

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  constructor() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      documento: ['', Validators.required],
      dataNascimento: [''],
      cep: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: ['']
    });
  }

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    this.carregarUsuario();

    this.form.get('cep')?.valueChanges.subscribe((cep) => {
      const cepLimpo = (cep || '').replace(/\D/g, '');

      if (cepLimpo.length === 8) {
        this.buscarEnderecoPorCep(cepLimpo);
      }
    });
  }

  carregarUsuarioLogado(): void {
    const usuarioStorage = localStorage.getItem('usuario');
    const usuarioIdStorage = localStorage.getItem('usuarioId');

    if (!usuarioStorage) return;

    const usuario = JSON.parse(usuarioStorage);

    this.usuarioId =
      usuarioIdStorage ||
      usuario.id ||
      usuario?.usuario?.id ||
      '';

    this.perfil = usuario.perfil || usuario?.usuario?.perfil || 'ALUNO';
  }

  carregarUsuario(): void {
    if (!this.usuarioId) {
      console.error('ID do usuário não encontrado.');
      return;
    }

    if (this.perfil === 'INSTRUTOR') {
      this.http
        .get<any>(`http://localhost:8081/api/instrutores/configuracoes/${this.usuarioId}`)
        .subscribe({
          next: (data) => {
            const usuario = data.usuario || data;

            this.preencherFormulario(usuario);
          },
          error: (err) => {
            console.error('Erro ao carregar dados do instrutor:', err);
          }
        });

      return;
    }

    this.http.get<any[]>('http://localhost:8081/api/usuarios').subscribe({
      next: (usuarios) => {
        const aluno = usuarios.find((u) => u.id === this.usuarioId);

        if (!aluno) {
          console.error('Aluno não encontrado em /api/usuarios.');
          return;
        }

        this.preencherFormulario(aluno);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do aluno:', err);
      }
    });
  }

  preencherFormulario(usuario: any): void {
    this.form.patchValue({
      nome: usuario.nome || '',
      email: usuario.email || '',
      senha: '',
      documento: usuario.cpf || usuario.cnh || '',
      dataNascimento: usuario.dataNascimento || '',
      cep: usuario.cep || '',
      logradouro: usuario.logradouro || '',
      numero: usuario.numero || '',
      complemento: usuario.complemento || '',
      bairro: usuario.bairro || '',
      cidade: usuario.cidade || '',
      uf: usuario.uf || ''
    });

    this.photoPreview = usuario.foto || null;
  }

  buscarEnderecoPorCep(cep: string): void {
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.form.patchValue({
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

  onFileSelected(event: any): void {
    const file = event?.target?.files?.[0];

    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.photoPreview = e.target?.result ?? null;
    };

    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.photoPreview = null;
  }

  resetSenha(): void {
    this.form.patchValue({ senha: '' });
  }

  onDocumentoInput(event: any): void {
    const valorRaw = event?.target?.value ?? '';
    let valor = valorRaw.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }

    this.form.get('documento')?.setValue(valor, { emitEvent: false });
  }

  descartar(): void {
    this.selectedFile = null;
    this.carregarUsuario();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      cpf: this.form.value.documento,
      dataNascimento: this.form.value.dataNascimento,
      cep: this.form.value.cep,
      logradouro: this.form.value.logradouro,
      numero: this.form.value.numero,
      complemento: this.form.value.complemento,
      bairro: this.form.value.bairro,
      cidade: this.form.value.cidade,
      uf: this.form.value.uf
    };

    if (this.perfil === 'INSTRUTOR') {
      this.http
        .put(`http://localhost:8081/api/usuarios/${this.usuarioId}/dados-pessoais`, dados)
        .subscribe({
          next: () => alert('Dados do instrutor atualizados com sucesso!'),
          error: (err) => {
            console.error('Erro ao atualizar instrutor:', err);
            alert('Erro ao atualizar dados do instrutor.');
          }
        });

      return;
    }

    this.http
      .put(`http://localhost:8081/api/usuarios/${this.usuarioId}/dados-pessoais`, dados)
      .subscribe({
        next: () => alert('Dados do aluno atualizados com sucesso!'),
        error: (err) => {
          console.error('Erro ao atualizar aluno:', err);
          alert('Erro ao atualizar dados do aluno.');
        }
      });
  }
}