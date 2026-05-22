import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  // Controle para mostrar o form de adicionar novo veículo
  mostraAddNovoVeiculo = false;

  // Formulários
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
      if (aba && ['pessoais','endereco','veiculo','documentos','configuracoes'].includes(aba)) {
        this.abaAtiva = aba as any;
      }
    });
  }

  // =========================
  // Métodos de troca de aba
  // =========================
  trocarAba(aba: 'pessoais' | 'endereco' | 'veiculo' | 'documentos' | 'configuracoes') {
    this.abaAtiva = aba;
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  selecionarDocumento(tipo: 'CNH' | 'CERTIFICADO') {
    this.modalAberto = false;
    this.router.navigate(['/instrutor/add-novo-documento'], { queryParams: { tipoDocumento: tipo } });
  }

  // =========================
  // Abrir form adicionar novo veículo
  // =========================
  abrirAddNovoVeiculo() {
    this.mostraAddNovoVeiculo = true;
  }

  // =========================
  // Evento disparado quando veículo for salvo
  // =========================
  onVeiculoSalvo(veiculo: any) {
    alert('Veículo cadastrado com sucesso!');
    this.mostraAddNovoVeiculo = false;

    // Aqui você pode atualizar a lista de veículos se tiver
    console.log('Veículo cadastrado:', veiculo);
  }

  // =========================
  // Métodos de salvar (opcional)
  // =========================
  salvarPessoais() { console.log(this.formPessoais.value); }
  salvarEndereco() { console.log(this.formEndereco.value); }
  salvarVeiculo() { console.log(this.formVeiculo.value); }
  salvarDocumentos() { console.log(this.formDocumentos.value); }
  salvarConfiguracoes() { console.log(this.formConfiguracoes.value); }

  descartarAlteracoes() {
    this.formPessoais.reset();
    this.formEndereco.reset();
    this.formVeiculo.reset();
    this.formDocumentos.reset();
    this.formConfiguracoes.reset();
  }
}