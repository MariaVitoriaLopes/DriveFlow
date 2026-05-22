import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { FormInformacoesPessoais } from '../../../components/forms/form-informacoes-pessoais/form-informacoes-pessoais';
import { RouterLink } from "@angular/router";
import { FormLocaisAtendimento } from "../../../components/forms/form-locais-atendimento/form-locais-atendimento";

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderInstrutor,
    FormInformacoesPessoais,
    RouterLink,
    FormLocaisAtendimento,
  ],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes implements OnInit {
  private fb = inject(FormBuilder);
  usuario: any;

  abaAtiva:
    | 'pessoais'
    | 'endereco'
    | 'veiculo'
    | 'documentos'
    | 'configuracoes'
    = 'pessoais';

  ngOnInit(): void {
    const user = localStorage.getItem('usuario');
    if (user) {
      this.usuario = JSON.parse(user);
    }
  }

  // =========================
  // FORMULÁRIOS
  // =========================
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

  // =========================
  // TROCAR ABA
  // =========================
  trocarAba(
    aba:
      | 'pessoais'
      | 'endereco'
      | 'veiculo'
      | 'documentos'
      | 'configuracoes'
  ): void {
    this.abaAtiva = aba;
  }

  // =========================
  // SALVAR
  // =========================
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

  // =========================
  // RESET
  // =========================
  descartarAlteracoes(): void {
    this.formPessoais.reset();
    this.formEndereco.reset();
    this.formVeiculo.reset();
    this.formDocumentos.reset();
    this.formConfiguracoes.reset();
  }
}