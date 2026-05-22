import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';
import { Filtro } from '../../../components/layout/filtro/filtro';
import { ChangeDetectorRef } from '@angular/core';


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
  private cdr = inject(ChangeDetectorRef);

  localizacao: string = 'Obtendo localização...';
  instrutores: Instrutor[] = [];
  exibeModalFiltro: boolean = false;
  usuario: any;

  ngOnInit(): void {
    // ------------------------------
    // 1️⃣ Pega os dados completos do backend
    // ------------------------------
//       const user = localStorage.getItem('usuario');
//       if (user) {
//         this.usuario = JSON.parse(user);
//       }

    this.localizacao = 'Buscando localização...';

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          this.localizacao = 'Buscando endereço...';

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
              {
                headers: {
                  Accept: 'application/json'
                }
              }
            );

            const data = await response.json();

            const bairro =
              data.address.suburb ||
              data.address.neighbourhood ||
              data.address.city_district ||
              '';

            this.cdr.detectChanges();

            const cidade =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              '';

            this.localizacao = bairro
              ? `${bairro}, ${cidade}`
              : cidade || 'Endereço não encontrado';

          } catch (erro) {
              console.log('ERRO GEO:', erro);
          }
        },

        (erro) => {
          console.error('Erro geolocalização:', erro);
          this.localizacao = 'Permissão de localização negada';
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

    } else {
      this.localizacao = 'Geolocalização indisponível';
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
