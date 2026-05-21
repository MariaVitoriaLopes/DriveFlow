import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';
import { Filtro } from '../../../components/layout/filtro/filtro';

interface Instrutor {
  nome: string;
  categoria: string;
  local: string;
  preco: number;
  avaliacao: number;
  totalAvaliacoes: number;
  foto?: string;
  carro: string;
}

@Component({
  selector: 'app-home-aluno',
  imports: [
    CommonModule,
    HeaderAluno,
    Filtro,
  ],
  templateUrl: './home-aluno.html',
  styleUrls: ['./home-aluno.scss'],
})
export class HomeAluno implements OnInit {

  localizacao: string = 'Obtendo localização...';
  instrutores: Instrutor[] = [];
  exibeModalFiltro: boolean = false;
  usuario: any;


  ngOnInit(): void {
    // ------------------------------
    // 1️⃣ Pega os dados completos do backend
    // ------------------------------
      const user = localStorage.getItem('usuario');
      if (user) {
        this.usuario = JSON.parse(user);
      }

    // ------------------------------
    // 2️⃣ Pega a localização
    // ------------------------------
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.localizacao = `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`;
        },
        (error) => {
          console.error(error);
          this.localizacao = 'Praia Grande, SP'; // fallback
        }
      );
    }

    // ------------------------------
    // 3️⃣ Simula dados dos instrutores
    // ------------------------------
    this.instrutores = [
      { nome: 'João', categoria: 'B', local: 'Boqueirão, PG', preco: 60, avaliacao: 4.9, totalAvaliacoes: 110, carro: 'carro1.jpg' },
      { nome: 'Mário', categoria: 'B', local: 'Boqueirão, PG', preco: 60, avaliacao: 4.9, totalAvaliacoes: 110, foto: 'mario.jpg', carro: 'carro2.jpg' },
      { nome: 'Cleber', categoria: 'B', local: 'Boqueirão, PG', preco: 70, avaliacao: 4.9, totalAvaliacoes: 110, foto: 'cleber.jpg', carro: 'carro3.jpg' },
      { nome: 'Francisco', categoria: 'B', local: 'Boqueirão, PG', preco: 70, avaliacao: 4.9, totalAvaliacoes: 110, foto: 'francisco.jpg', carro: 'carro4.jpg' },
      { nome: 'Renato', categoria: 'B', local: 'Boqueirão, PG', preco: 70, avaliacao: 4.9, totalAvaliacoes: 110, foto: 'renato.jpg', carro: 'carro5.jpg' }
    ];
  }

  toggleModalFiltro(): void {
    this.exibeModalFiltro = !this.exibeModalFiltro;
  }

}