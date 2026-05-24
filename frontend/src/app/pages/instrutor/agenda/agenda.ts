import { Component } from '@angular/core';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { RouterLink } from "@angular/router";

interface Aula {
  horario: string;
  aluno?: string;
}

interface HorarioAgenda {
  dia: string;
  inicio: string;
  fim: string;
  bloqueio: boolean;
}

@Component({
  selector: 'app-agenda',
  imports: [HeaderInstrutor, RouterLink],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda {

  hoje = new Date();

  anoAtual = this.hoje.getFullYear();
  mesAtualNumero = this.hoje.getMonth();
  diaAtual = this.hoje.getDate();

  mesAtual = this.hoje.toLocaleDateString('pt-BR', {
    month: 'long'
  });

  diasCalendario: (number | null)[] = [];

  diasComAula = [2, 3, 4, 5, 8, 15, 22, 29];

  aulasHoje: Aula[] = [
    { horario: '06:00' },
    { horario: '07:00' },
    { horario: '08:00', aluno: 'Ana' },
    { horario: '09:00', aluno: 'Amanda' },
    { horario: '12:00', aluno: 'Guilherme' },
    { horario: '14:00', aluno: 'Renato' },
    { horario: '15:00' },
    { horario: '16:00' }
  ];

  horarios: HorarioAgenda[] = [
    { dia: 'Dom', inicio: '13:00', fim: '15:00', bloqueio: false },
    { dia: 'Seg', inicio: '08:00', fim: '16:00', bloqueio: false },
    { dia: 'Ter', inicio: '08:00', fim: '16:00', bloqueio: false },
    { dia: 'Qua', inicio: '08:00', fim: '16:00', bloqueio: false },
    { dia: 'Qui', inicio: '08:00', fim: '16:00', bloqueio: false },
    { dia: 'Sex', inicio: '08:00', fim: '16:00', bloqueio: false },
    { dia: 'Sáb', inicio: '07:00', fim: '18:30', bloqueio: false }
  ];

  folgas = [6, 16, 17];

  constructor() {
    this.gerarCalendario();
  }

  gerarCalendario(): void {
    const primeiroDiaMes = new Date(
      this.anoAtual,
      this.mesAtualNumero,
      1
    ).getDay();

    const totalDiasMes = new Date(
      this.anoAtual,
      this.mesAtualNumero + 1,
      0
    ).getDate();

    this.diasCalendario = [];

    for (let i = 0; i < primeiroDiaMes; i++) {
      this.diasCalendario.push(null);
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      this.diasCalendario.push(dia);
    }
  }

  temAula(dia: number | null): boolean {
    if (!dia) return false;
    return this.diasComAula.includes(dia);
  }

}
