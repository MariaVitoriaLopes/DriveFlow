import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface DiaCalendario {
  dia: number | null;
  data?: Date;
  foraDoMes?: boolean;
  bloqueado?: boolean;
}

@Component({
  selector: 'app-calendario-agendamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario-agendamento.html',
  styleUrl: './calendario-agendamento.scss'
})
export class CalendarioAgendamento implements OnChanges {
  @Input() disponibilidades: any[] = [];
  @Input() dataSelecionada: Date | null = null;

  @Output() dataSelecionadaChange = new EventEmitter<Date>();

  hoje = new Date();
  anoAtual = this.hoje.getFullYear();
  mesAtualNumero = this.hoje.getMonth();
  mesAtual = '';

  diasCalendario: DiaCalendario[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.gerarCalendario();
  }

  mudarMes(direcao: number): void {
    this.mesAtualNumero += direcao;

    if (this.mesAtualNumero < 0) {
      this.mesAtualNumero = 11;
      this.anoAtual--;
    }

    if (this.mesAtualNumero > 11) {
      this.mesAtualNumero = 0;
      this.anoAtual++;
    }

    this.gerarCalendario();
  }

  gerarCalendario(): void {
    const primeiroDia = new Date(this.anoAtual, this.mesAtualNumero, 1);
    const ultimoDia = new Date(this.anoAtual, this.mesAtualNumero + 1, 0);

    this.mesAtual = primeiroDia.toLocaleDateString('pt-BR', { month: 'long' });
    this.mesAtual = this.mesAtual.charAt(0).toUpperCase() + this.mesAtual.slice(1);

    const dias: DiaCalendario[] = [];

    for (let i = 0; i < primeiroDia.getDay(); i++) {
      dias.push({ dia: null, foraDoMes: true, bloqueado: true });
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const data = new Date(this.anoAtual, this.mesAtualNumero, dia);

      dias.push({
        dia,
        data,
        foraDoMes: false,
        bloqueado: this.dataBloqueada(data)
      });
    }

    this.diasCalendario = dias;
  }

  selecionarDia(item: DiaCalendario): void {
    if (!item.data || item.foraDoMes || item.bloqueado) return;

    this.dataSelecionada = item.data;
    this.dataSelecionadaChange.emit(item.data);
  }

  dataBloqueada(data: Date): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataSemHora = new Date(data);
    dataSemHora.setHours(0, 0, 0, 0);

    if (dataSemHora < hoje) return true;

    if (!this.disponibilidades?.length) return true;

    const diaSemana = this.nomeDiaSemana(data);

    const diaAgenda = this.disponibilidades.find((d: any) =>
      this.normalizarDia(d.diaSemana) === this.normalizarDia(diaSemana) &&
      !d.bloqueado
    );

    return !diaAgenda;
  }

  nomeDiaSemana(data: Date): string {
    return ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'][data.getDay()];
  }

  normalizarDia(valor: string): string {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }
}