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
  tipoDocumento: 'cpf' | 'cnh' = 'cpf';
  usuarioId: string = '';
  perfil: 'ALUNO' | 'INSTRUTOR' = 'ALUNO';

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  constructor() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      documento: ['', Validators.required], // CPF ou CNH
      senha: ['', Validators.required],
      dataNascimento: [''],
      cep: ['', Validators.required],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: ['']
    });
  }

  ngOnInit() {
    // 1️⃣ Pega usuário logado do localStorage
    if (typeof window !== 'undefined') {
      const usuario = JSON.parse(localStorage.getItem('usuario')!);
      if (!usuario) return;

      this.usuarioId = usuario.id;
      this.perfil = usuario.perfil;
      this.tipoDocumento = usuario.perfil === 'INSTRUTOR' ? 'cnh' : 'cpf';
    }

    // 2️⃣ Carrega dados do backend
    this.carregarUsuario();

    // 3️⃣ Observa mudanças no CEP e preenche endereço automaticamente
    this.form.get('cep')?.valueChanges.subscribe(cep => {
      cep = cep.replace(/\D/g, '');
      if (cep.length === 8) this.buscarEnderecoPorCep(cep);
    });
  }

  carregarUsuario() {
    const url = this.perfil === 'INSTRUTOR'
      ? `http://localhost:8081/api/instrutores/configuracoes/${this.usuarioId}`
      : `http://localhost:8081/api/alunos/${this.usuarioId}`;

    this.http.get<any>(url).subscribe(data => {
      const u = this.perfil === 'INSTRUTOR' ? data.usuario : data;
      const documento = u.cpf; // sempre CPF do backend, só muda o label

      this.form.patchValue({
        nome: u.nome,
        email: u.email,
        documento: documento,
        senha: '',
        dataNascimento: u.dataNascimento,
        cep: u.cep,
        logradouro: u.logradouro,
        numero: u.numero,
        complemento: u.complemento,
        bairro: u.bairro,
        cidade: u.cidade,
        uf: u.uf
      });

      this.photoPreview = u.foto ?? null;
    });
  }

  buscarEnderecoPorCep(cep: string) {
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: data => {
        if (!data.erro) {
          this.form.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
          });
        }
      },
      error: err => console.error('Erro ao buscar CEP:', err)
    });
  }

  // --------------------------
  // Upload de foto com preview
  // --------------------------
  onUploadClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }


onFileSelected(event: any) {
  if (event.target.files && event.target.files[0]) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) { // garante que não é null
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = e.target?.result ?? null;
      reader.readAsDataURL(this.selectedFile); // agora TypeScript não reclama
    }
  }
}

removePhoto() {
  this.selectedFile = null;
  this.photoPreview = null;
}

  resetSenha() {
    this.form.patchValue({ senha: '' });
  }

onDocumentoInput(event: any) {
  const valorRaw = event?.target?.value ?? ''; // garante que nunca seja undefined
  let valor = valorRaw.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  this.form.get('documento')?.setValue(valor, { emitEvent: false });
}

  validaDocumento(): boolean {
    const valor = this.form.get('documento')?.value || '';
    return valor.replace(/\D/g, '').length === 11;
  }

  descartar() {
    this.carregarUsuario();
    this.photoPreview = null;
  }

  // --------------------------
  // Envio do formulário completo com arquivo real
  // --------------------------
onSubmit() {
  if (this.form.valid) {
    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      formData.append(key, this.form.value[key]);
    });

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.http.put(`http://localhost:8081/api/usuarios/${this.usuarioId}`, formData)
      .subscribe({
        next: () => alert('Perfil atualizado com sucesso!'),
        error: () => alert('Erro ao atualizar perfil.')
      });
  }
}
}