import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { CalendarComponent } from '../../../components/layout/calendario/calendario';

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
  imports: [HeaderInstrutor, RouterLink, CalendarComponent, HttpClientModule, CommonModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda {
  private http = inject(HttpClient);

  selectedDate = new Date();

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    console.log('Data selecionada:', date);
  }

  hoje = new Date();

  anoAtual = this.hoje.getFullYear();
  mesAtualNumero = this.hoje.getMonth();
  diaAtual = this.hoje.getDate();

  mesAtual = this.hoje.toLocaleDateString('pt-BR', {
    month: 'long'
  });

  diasCalendario: (number | null)[] = [];

  disponibilidadeNovasAulas = true;

  duracaoAula = 60;
  intervaloAulas = 15;

  horarios: HorarioAgenda[] = [];
  folgas: number[] = [];

  aulasHoje: Aula[] = [];
  diasComAula: number[] = [];

  resumoSemana = [
    { dia: 'Dom', quantidade: 0 },
    { dia: 'Seg', quantidade: 0 },
    { dia: 'Ter', quantidade: 0 },
    { dia: 'Qua', quantidade: 0 },
    { dia: 'Qui', quantidade: 0 },
    { dia: 'Sex', quantidade: 0 },
    { dia: 'Sáb', quantidade: 0 },
  ];

  usuarioId = '';

  ngOnInit(): void {

    this.usuarioId =
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('userId') ||
      '';

    this.gerarCalendario();
    this.carregarAgenda();
  }

  carregarAgenda(): void {
    if (!this.usuarioId) {
      console.warn('usuarioId não encontrado no localStorage');
      return;
    }

    this.http
      .get<any>(`http://localhost:8081/api/instrutores/agenda/${this.usuarioId}`)
      .subscribe({
        next: (agenda : any) => {
          console.log('AGENDA RECEBIDA:', agenda);

          if (!agenda) return;

          this.disponibilidadeNovasAulas = agenda.disponibilidadeNovasAulas ?? true;
          this.duracaoAula = agenda.duracaoAula ?? 60;
          this.intervaloAulas = agenda.intervaloAula ?? 15;

          this.horarios = (agenda.disponibilidades || []).map((item: any) => ({
            dia: this.nomeDiaCurto(item.diaSemana),
            inicio: item.horaInicio,
            fim: item.horaFim,
            bloqueio: item.bloqueado === true
          }));

          this.aulasHoje = agenda.aulasHoje || [];
          this.diasComAula = agenda.diasComAula || [];

          this.gerarResumoSemana();
          this.gerarFolgas();
        },

        error: (erro : any) => {
          console.error('Erro ao carregar agenda:', erro);
        }
      });
  }

  alterarDisponibilidade(): void {
    const novoValor = !this.disponibilidadeNovasAulas;
    this.disponibilidadeNovasAulas = novoValor;

    this.http
      .put(`http://localhost:8081/api/instrutores/agenda/${this.usuarioId}`, {
        disponibilidadeNovasAulas: novoValor,
        duracaoAula: this.duracaoAula,
        intervaloAula: this.intervaloAulas,
        disponibilidades: this.horarios.map(h => ({
          diaSemana: this.nomeDiaBackend(h.dia),
          horaInicio: h.inicio,
          horaFim: h.fim,
          bloqueado: h.bloqueio
        }))
      })
      .subscribe({
        error: (erro) => {
          console.error('Erro ao alterar disponibilidade:', erro);
          this.disponibilidadeNovasAulas = !novoValor;
        }
      });
  }

  gerarResumoSemana(): void {
    this.resumoSemana = this.resumoSemana.map(item => {
      const existeAgenda = this.horarios.some(h => h.dia === item.dia);

      return {
        ...item,
        quantidade: existeAgenda ? 1 : 0
      };
    });
  }

  gerarFolgas(): void {
    const diasDisponiveis = this.horarios
      .filter(h => !h.bloqueio)
      .map(h => h.dia);

    this.folgas = [];

    const totalDiasMes = new Date(
      this.anoAtual,
      this.mesAtualNumero + 1,
      0
    ).getDate();

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const data = new Date(this.anoAtual, this.mesAtualNumero, dia);
      const diaSemana = this.nomeDiaCurto(data.getDay());

      if (!diasDisponiveis.includes(diaSemana)) {
        this.folgas.push(dia);
      }
    }
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

  intensidadeBolinha(quantidade: number): string {
    if (quantidade >= 6) return 'dark';
    if (quantidade >= 3) return 'strong';
    if (quantidade >= 1) return 'medium';
    return '';
  }

  nomeDiaCurto(dia: number | string): string {
    const dias: any = {
      0: 'Dom',
      1: 'Seg',
      2: 'Ter',
      3: 'Qua',
      4: 'Qui',
      5: 'Sex',
      6: 'Sáb',
      DOMINGO: 'Dom',
      SEGUNDA: 'Seg',
      TERCA: 'Ter',
      TERÇA: 'Ter',
      QUARTA: 'Qua',
      QUINTA: 'Qui',
      SEXTA: 'Sex',
      SABADO: 'Sáb',
      SÁBADO: 'Sáb'
    };

    return dias[dia] || String(dia);
  }

  nomeDiaBackend(dia: string): string {
    const dias: any = {
      Dom: 'DOMINGO',
      Seg: 'SEGUNDA',
      Ter: 'TERCA',
      Qua: 'QUARTA',
      Qui: 'QUINTA',
      Sex: 'SEXTA',
      Sáb: 'SABADO'
    };

    return dias[dia] || dia;
  }
}
