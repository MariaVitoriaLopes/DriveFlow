import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderInstrutor } from '../../layout/header-instrutor/header-instrutor';

@Component({
  selector: 'app-novo-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeaderInstrutor],
  templateUrl: './novo-documento.html',
  styleUrls: ['./novo-documento.scss'],
})
export class NovoDocumento implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  apiUrl = 'http://localhost:8081/api/instrutores/configuracoes';

  usuarioId = localStorage.getItem('usuarioId') || '';

  tipoDocumento: 'CNH' | 'CERTIFICADO' | null = null;

  previewFrente: string | null = null;
  previewVerso: string | null = null;

  form: FormGroup = this.fb.group({
    numeroDocumento: ['', Validators.required],
    frente: [null, Validators.required],
    verso: [null, Validators.required]
  });

  ngOnInit(): void {
    const tipoState = history.state?.tipoDocumento;

    this.route.queryParams.subscribe(params => {
      const tipoQuery = params['tipoDocumento'] || params['tipo'];
      const tipo = tipoState || tipoQuery;

      if (tipo === 'CNH' || tipo === 'CERTIFICADO') {
        this.tipoDocumento = tipo;
      }
    });
  }

  onFileChange(event: Event, lado: 'frente' | 'verso'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      this.form.get(lado)?.setValue(base64);

      if (lado === 'frente') {
        this.previewFrente = base64;
      } else {
        this.previewVerso = base64;
      }
    };

    reader.readAsDataURL(file);
  }

  enviar(): void {
    if (this.form.invalid || !this.tipoDocumento || !this.usuarioId) {
      alert('Preencha todos os campos antes de enviar.');
      return;
    }

    const usuarioStorage = localStorage.getItem('usuario');
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : {};

    const documento = {
      nomeCompleto: usuario.nome || '',
      numeroDocumento: this.form.value.numeroDocumento,
      fotoFrenteUrl: this.form.value.frente,
      fotoVersoUrl: this.form.value.verso,
      statusValidacao: 'PENDENTE'
    };

    const rota =
      this.tipoDocumento === 'CNH'
        ? `${this.apiUrl}/${this.usuarioId}/documentos/cnh`
        : `${this.apiUrl}/${this.usuarioId}/documentos/credencial`;

    this.http.put(rota, documento).subscribe({
      next: () => {
        alert('Documento enviado com sucesso!');
        this.router.navigate(['/instrutor/configuracoes'], {
          queryParams: { aba: 'documentos' }
        });
      },
      error: (err) => {
        console.error('Erro ao enviar documento:', err);
        alert('Erro ao enviar documento.');
      }
    });
  }
}