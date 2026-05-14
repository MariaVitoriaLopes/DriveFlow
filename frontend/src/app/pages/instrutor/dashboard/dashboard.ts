import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderInstrutor
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  hoje = new Date();

  mesAtual = this.hoje.toLocaleDateString('pt-BR', {
    month: 'long'
  });

  anoAtual = this.hoje.getFullYear();

  diaAtual = this.hoje.getDate();

  primeiroDiaMes = new Date(
    this.anoAtual,
    this.hoje.getMonth(),
    1
  ).getDay();

  totalDiasMes = new Date(
    this.anoAtual,
    this.hoje.getMonth() + 1,
    0
  ).getDate();

  diasCalendario: (number | null)[] = [];

  weekStats: any[] = [];

  constructor() {

    this.gerarCalendario();

    this.gerarSemanaGrafico();

  }

  gerarCalendario(): void {

    this.diasCalendario = [];

    for (let i = 0; i < this.primeiroDiaMes; i++) {

      this.diasCalendario.push(null);

    }

    for (let dia = 1; dia <= this.totalDiasMes; dia++) {

      this.diasCalendario.push(dia);

    }

  }

  gerarSemanaGrafico(): void {

    const diasSemana = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ];

    this.weekStats = [];

    for (let i = 6; i >= 0; i--) {

      const data = new Date();

      data.setDate(this.hoje.getDate() - i);

      this.weekStats.push({

        weekDay: diasSemana[data.getDay()],

        date: data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        }),

        total: Math.floor(Math.random() * 12) + 1

      });

    }

  }

}