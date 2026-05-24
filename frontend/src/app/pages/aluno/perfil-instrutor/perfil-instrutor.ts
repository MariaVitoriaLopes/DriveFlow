import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';

@Component({
  selector: 'app-perfil-instrutor',
  standalone: true,
  imports: [
    CommonModule,
    HeaderAluno,
  ],
  templateUrl: './perfil-instrutor.html',
  styleUrls: ['./perfil-instrutor.scss']
})
export class PerfilInstrutor implements OnInit {

  instrutor: any;
  mapaUrlSeguro!: SafeResourceUrl;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const instrutorId =
      history.state?.instrutorId ||
      sessionStorage.getItem('instrutorIdSelecionado');

    this.carregarPerfilInstrutor(instrutorId);
  }

  carregarPerfilInstrutor(id: string | null): void {
    this.instrutor = {
      id,

      nome: 'João Santos',

      descricao:
        'Bom para iniciantes, sou instrutor a 1 ano e te ajudo a ser aprovado!',

      verificado: true,

      localidade: 'Boqueirão, Praia Grande',

      veiculo: {
        categoria: 'Categoria B',
        cambio: 'Manual',
        marca: 'Chevrolet',
        versao: 'LT 1.0',
        fotoPrincipal: '/images/carro.png',

        recursos: [
          'Ar-condicionado',
          'ABS',
          'Direção hidráulica',
          'Duplo comando',
          'Travas elétricas'
        ]
      }
    };

    this.gerarMapa(this.instrutor.localidade);
  }

  gerarMapa(endereco: string): void {
    const enderecoFormatado = encodeURIComponent(endereco);

    const url = `https://www.google.com/maps?q=${enderecoFormatado}&output=embed`;

    this.mapaUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}