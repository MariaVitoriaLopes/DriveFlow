import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface DiaCalendarioAgenda {
  dia: number | null;
  data?: Date;
  foraDoMes?: boolean;
}

@Component({
  selector: 'app-calendario-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario-agenda.html',
  styleUrl: './calendario-agenda.scss'
})
export class CalendarioAgenda implements OnChanges {
  @Input() aulas: any[] = [];
  @Input() dataSelecionada: Date = new Date();

  @Output() dataSelecionadaChange = new EventEmitter<Date>();

  hoje = new Date();
  anoAtual = this.hoje.getFullYear();
  mesAtualNumero = this.hoje.getMonth();
  mesAtual = '';

  diasCalendario: DiaCalendarioAgenda[] = [];

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

    const dias: DiaCalendarioAgenda[] = [];

    for (let i = 0; i < primeiroDia.getDay(); i++) {
      dias.push({ dia: null, foraDoMes: true });
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push({
        dia,
        data: new Date(this.anoAtual, this.mesAtualNumero, dia),
        foraDoMes: false
      });
    }

    this.diasCalendario = dias;
  }

  selecionarDia(item: DiaCalendarioAgenda): void {
    if (!item.data || item.foraDoMes) return;

    this.dataSelecionada = item.data;
    this.dataSelecionadaChange.emit(item.data);
  }

  temAulaNoDia(data: Date): boolean {
    const dataFormatada = this.formatarDataApi(data);

    return this.aulas.some(aula =>
      aula.data === dataFormatada &&
      aula.status !== 'CANCELADA'
    );
  }

  ehHoje(data?: Date): boolean {
    if (!data) return false;

    return this.formatarDataApi(data) === this.formatarDataApi(new Date());
  }

  estaSelecionado(data?: Date): boolean {
    if (!data || !this.dataSelecionada) return false;

    return this.formatarDataApi(data) === this.formatarDataApi(this.dataSelecionada);
  }

  formatarDataApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }
}