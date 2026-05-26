import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-sistema',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './config-sistema.html',
  styleUrl: './config-sistema.scss',
})
export class ConfigSistema implements OnInit{

  formPreferencias: FormGroup;
  usuarioId = 'ID_DO_USUARIO'; // Substituir pelo ID real do usuário

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formPreferencias = this.fb.group({
      tema: ['padrao'],
      idioma: ['pt-BR'],
      push: [true],
      email: [true],
      lembretes: [true],
      promocoes: [false]
    });
  }

  modalAberto = false;
  modalTitulo = '';
  modalMensagem = '';
  modalErro = false;

  abrirModal(titulo: string,mensagem: string,erro = false): void {

    this.modalTitulo = titulo;
    this.modalMensagem = mensagem;
    this.modalErro = erro;

    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  ngOnInit() {
    this.carregarPreferencias();
  }

  carregarPreferencias() {
    // GET fictício: troque pelo caminho real do backend
    this.http.get<any>(`/api/usuarios/${this.usuarioId}/preferencias`).subscribe({
      next: (res) => this.formPreferencias.patchValue(res),
      error: () => console.warn('Não foi possível carregar preferências')
    });
  }

  salvar() {
    const prefs = this.formPreferencias.value;
    // PUT fictício: troque pelo caminho real do backend
    this.http.put(`/api/usuarios/${this.usuarioId}/preferencias`, prefs).subscribe({
      // next: () => alert('Preferências salvas!'),
      // error: () => alert('Erro ao salvar preferências')
      next: () => this.abrirModal("Sucesso", 'Preferências salvas!'),
      error: () => this.abrirModal("Erro", 'Erro ao salvar preferências')
    });
  }

  descartar() {
    this.carregarPreferencias();
  }
}
