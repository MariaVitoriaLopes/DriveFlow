import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import {FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-informacoes-pessoais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-informacoes-pessoais.html',
  styleUrl: './form-informacoes-pessoais.scss',
})
export class FormInformacoesPessoais implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  perfil = 'ALUNO';

  photoPreview: string | null = null;

  modalAberto = false;
  modalTitulo = '';
  modalMensagem = '';
  modalErro = false;

  form = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    documento: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required]],

    cep: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    complemento: [''],
    bairro: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    uf: ['', [Validators.required]],
  });

  ngOnInit(): void {

    // Exemplo de carregamento do usuário
    // Você pode substituir pela sua API real

    const usuario = localStorage.getItem('usuario');

    if (usuario) {

      const dadosUsuario = JSON.parse(usuario);

      this.perfil = dadosUsuario.perfil || 'ALUNO';

      this.form.patchValue({
        nome: dadosUsuario.nome || '',
        email: dadosUsuario.email || '',
        documento: dadosUsuario.cpf || '',
      });
    }
  }

  abrirModal(
    titulo: string,
    mensagem: string,
    erro = false
  ): void {

    this.modalTitulo = titulo;
    this.modalMensagem = mensagem;
    this.modalErro = erro;

    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const tiposPermitidos = [
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    if (!tiposPermitidos.includes(file.type)) {

      this.abrirModal(
        'Formato inválido',
        'Envie apenas imagens PNG, JPG ou JPEG.',
        true
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removePhoto(): void {

    this.photoPreview = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  resetSenha(): void {

    this.abrirModal(
      'Redefinição de senha',
      'Um link de redefinição de senha será enviado para seu e-mail.'
    );
  }

  onDocumentoInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }

    if (this.perfil !== 'INSTRUTOR') {

      if (valor.length > 9) {

        valor = valor.replace(
          /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
          '$1.$2.$3-$4'
        );

      } else if (valor.length > 6) {

        valor = valor.replace(
          /(\d{3})(\d{3})(\d{1,3})/,
          '$1.$2.$3'
        );

      } else if (valor.length > 3) {

        valor = valor.replace(
          /(\d{3})(\d{1,3})/,
          '$1.$2'
        );
      }
    }

    this.form.get('documento')?.setValue(valor, {
      emitEvent: false
    });
  }

  descartar(): void {

    this.form.reset();

    this.photoPreview = null;

    this.abrirModal(
      'Alterações descartadas',
      'Todas as alterações foram removidas.'
    );
  }

  onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      this.abrirModal(
        'Erro ao salvar',
        'Preencha todos os campos corretamente.',
        true
      );

      return;
    }

    const dados = this.form.getRawValue();

    // Exemplo de requisição
    // Troque pela sua URL real

    this.http.put(
      'http://localhost:8081/api/usuarios',
      dados
    )

      .subscribe({

        next: () => {

          this.abrirModal(
            'Alterações salvas',
            'Seus dados foram atualizados com sucesso.'
          );
        },

        error: (erro) => {

          console.error(
            'Erro ao salvar:',
            erro
          );

          this.abrirModal(
            'Erro ao salvar',
            'Não foi possível atualizar seus dados.',
            true
          );
        }
      });
  }
}