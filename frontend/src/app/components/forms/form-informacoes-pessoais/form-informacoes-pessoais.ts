import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-informacoes-pessoais',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './form-informacoes-pessoais.html',
  styleUrl: './form-informacoes-pessoais.scss',
})
export class FormInformacoesPessoais {
  @Input() tipoDocumento: 'cpf' | 'cnh' = 'cpf'; // Define se é CPF ou CNH

  form: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private usuarioId = 'ID_DO_USUARIO_LOGADO';

  constructor() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      documento: ['', Validators.required], // CPF ou CNH
      senha: ['', Validators.required],
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

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    this.http.get<any>(`http://localhost:8081/api/usuarios/${this.usuarioId}`)
      .subscribe(usuario => {
        this.form.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          documento: this.tipoDocumento === 'cpf' ? usuario.cpf : usuario.cnh,
          senha: '', // senha não é populada
          dataNascimento: usuario.dataNascimento,
          cep: usuario.cep,
          logradouro: usuario.logradouro,
          numero: usuario.numero,
          complemento: usuario.complemento,
          bairro: usuario.bairro,
          cidade: usuario.cidade,
          uf: usuario.uf
        });
        this.photoPreview = usuario.foto ?? null;
      });
  }

  onUploadClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/jpg';
    input.onchange = () => {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => this.photoPreview = e.target?.result ?? null;
        reader.readAsDataURL(input.files[0]);
      }
    };
    input.click();
  }

  removePhoto() { this.photoPreview = null; }

  resetSenha() { this.form.patchValue({ senha: '' }); }

  onDocumentoInput(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (this.tipoDocumento === 'cpf' && valor.length > 11) valor = valor.slice(0, 11);
    if (this.tipoDocumento === 'cnh' && valor.length > 11) valor = valor.slice(0, 11);
    this.form.get('documento')?.setValue(valor, { emitEvent: false });
  }

  validaDocumento(): boolean {
    const valor = this.form.get('documento')?.value || '';
    if (this.tipoDocumento === 'cpf') return valor.replace(/\D/g, '').length === 11;
    if (this.tipoDocumento === 'cnh') return valor.replace(/\D/g, '').length === 11;
    return false;
  }

  descartar() {
    this.carregarUsuario();
    this.photoPreview = null;
  }

  onSubmit() {
    if (!this.validaDocumento()) {
      alert(`${this.tipoDocumento.toUpperCase()} inválido!`);
      return;
    }

    if (this.form.valid) {
      const dados = { ...this.form.value, foto: this.photoPreview };
      this.http.put(`http://localhost:8081/api/usuarios/${this.usuarioId}`, dados)
        .subscribe({
          next: () => alert('Perfil atualizado com sucesso!'),
          error: () => alert('Erro ao atualizar perfil.')
        });
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  }

}
