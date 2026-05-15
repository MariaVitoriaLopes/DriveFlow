import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';

@Component({
  selector: 'app-configuracoes',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderInstrutor,
  ],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes {
    private fb = inject(FormBuilder);

  abaAtiva:
    | 'pessoais'
    | 'endereco'
    | 'veiculo'
    | 'documentos'
    | 'configuracoes'
    = 'pessoais';

  usuario = {
    nome: 'João Santos'
  };

  // =========================
  // FORM PESSOAIS
  // =========================

  formPessoais = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    cpf: [''],
    dataNascimento: ['']
  });

  // =========================
  // FORM ENDEREÇO
  // =========================

  formEndereco = this.fb.group({
    cep: [''],
    logradouro: [''],
    numero: [''],
    complemento: [''],
    bairro: [''],
    cidade: [''],
    uf: ['']
  });

  // =========================
  // FORM VEÍCULO
  // =========================

  formVeiculo = this.fb.group({
    marca: [''],
    modelo: [''],
    placa: [''],
    cor: ['']
  });

  // =========================
  // FORM DOCUMENTOS
  // =========================

  formDocumentos = this.fb.group({
    cnh: [''],
    documentoVeiculo: ['']
  });

  // =========================
  // FORM CONFIGURAÇÕES
  // =========================

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
