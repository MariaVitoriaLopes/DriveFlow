import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { FormInformacoesPessoais } from '../../../components/forms/form-informacoes-pessoais/form-informacoes-pessoais';
import { FormLocaisAtendimento } from '../../../components/forms/form-locais-atendimento/form-locais-atendimento';
import { FormVeiculos } from '../../../components/forms/form-veiculos/form-veiculos';
import { FormDocumentos } from '../../../components/forms/form-documentos/form-documentos';
import { ConfigSistema } from '../../../components/forms/config-sistema/config-sistema';
import { FormAddNovoVeiculo } from '../../../components/forms/form-add-novo-veiculo/form-add-novo-veiculo';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderInstrutor,
    FormInformacoesPessoais,
    FormLocaisAtendimento,
    FormVeiculos,
    FormDocumentos,
    ConfigSistema,
    FormAddNovoVeiculo,
  ],
  templateUrl: './configuracoes.html',
  styleUrls: ['./configuracoes.scss'],
})
export class Configuracoes implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  usuario: any;

  abaAtiva: 'pessoais' | 'endereco' | 'veiculo' | 'documentos' | 'configuracoes' = 'pessoais';

  modalAberto = false;
  mostraAddNovoVeiculo = false;

  reloadVeiculos = 0;
  reloadLocais = 0;

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

  ngOnInit(): void {
    const user = localStorage.getItem('usuario');

    if (user) {
      this.usuario = JSON.parse(user);
    }

    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const aba = params['aba'];

      if (
        aba &&
        ['pessoais', 'endereco', 'veiculo', 'documentos', 'configuracoes'].includes(aba)
      ) {
        this.abaAtiva = aba as any;

        if (this.abaAtiva === 'endereco') {
          this.reloadLocais++;
        }

        if (this.abaAtiva === 'veiculo') {
          this.mostraAddNovoVeiculo = false;
          this.reloadVeiculos++;
        }
      }
    });
  }

  trocarAba(aba: 'pessoais' | 'endereco' | 'veiculo' | 'documentos' | 'configuracoes'): void {
    this.abaAtiva = aba;

    if (aba === 'veiculo') {
      this.mostraAddNovoVeiculo = false;
      this.reloadVeiculos++;
    }

    if (aba === 'endereco') {
      this.reloadLocais++;
    }
  }

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  selecionarDocumento(tipo: 'CNH' | 'CERTIFICADO'): void {
    this.modalAberto = false;

    this.router.navigate(['/instrutor/add-novo-documento'], {
      queryParams: { tipoDocumento: tipo }
    });
  }

  abrirAddNovoVeiculo(): void {
    this.mostraAddNovoVeiculo = true;
  }

  onVeiculoSalvo(veiculo: any): void {
    alert('Veículo cadastrado com sucesso!');

    this.mostraAddNovoVeiculo = false;
    this.reloadVeiculos++;

    console.log('Veículo cadastrado:', veiculo);
  }

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

  descartarAlteracoes(): void {
    this.formPessoais.reset();
    this.formEndereco.reset();
    this.formVeiculo.reset();
    this.formDocumentos.reset();
    this.formConfiguracoes.reset();
  }
}