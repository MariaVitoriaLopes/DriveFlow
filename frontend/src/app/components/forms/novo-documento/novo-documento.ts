import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderInstrutor } from '../../layout/header-instrutor/header-instrutor';

@Component({
  selector: 'app-novo-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderInstrutor],
  templateUrl: './novo-documento.html',
  styleUrls: ['./novo-documento.scss'],
})
export class NovoDocumento implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  tipoDocumento: 'CNH' | 'CERTIFICADO' | null = null;
  form: FormGroup;

  // URLs de preview
  previewFrente: string | ArrayBuffer | null = null;
  previewVerso: string | ArrayBuffer | null = null;

  constructor() {
    this.form = this.fb.group({
      frente: [null, Validators.required],
      verso: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tipo = params['tipoDocumento'];
      if (tipo === 'CNH' || tipo === 'CERTIFICADO') {
        this.tipoDocumento = tipo;
      }
    });
  }

  onFileChange(event: any, lado: 'frente' | 'verso') {
    const file = event.target.files[0];
    if (file) {
      this.form.get(lado)?.setValue(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = e => {
        if (lado === 'frente') {
          this.previewFrente = e.target?.result || null;
        } else {
          this.previewVerso = e.target?.result || null;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  enviar() {
    if (!this.tipoDocumento) return;

    const formData = new FormData();
    formData.append('tipoDocumento', this.tipoDocumento);
    formData.append('frente', this.form.get('frente')?.value);
    formData.append('verso', this.form.get('verso')?.value);

    this.http.post('http://localhost:8081/api/documentos', formData)
      .subscribe({
        next: res => console.log('Documento enviado com sucesso', res),
        error: err => console.error('Erro ao enviar documento', err)
      });
  }
}