import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, SimpleChanges, Input, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalendarioAgendamento } from '../../../components/layout/calendario-agendamento/calendario-agendamento';
import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';

@Component({
  selector: 'app-agendar-aula',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, CalendarioAgendamento, HeaderAluno],
  templateUrl: './agendar-aula.html',
  styleUrl: './agendar-aula.scss',
})
export class AgendarAula implements OnInit, OnChanges {
  private http = inject(HttpClient);
  public router = inject(Router);

  @Input() instrutorIdInput = '';

  apiUrl = 'http://localhost:8081/api';

  instrutorId = '';
  alunoId = localStorage.getItem('usuarioId') || localStorage.getItem('userId') || '';

  instrutor: any = null;
  agenda: any = null;

  veiculoId = '';
  localEncontro = 'Local não informado';
  veiculoTexto = 'Carregando veículo...';

  duracaoAula = 0;
  intervaloAula = 0;
  toleranciaEspera = 0;
  valorAula = 0;
  taxa = 0;

  dataSelecionada: Date | null = null;
  dataSelecionadaFormatada = '';

  horariosDisponiveis: any[] = [];
  horarioInicio = '';
  horarioFim = '';
  quantidadeAulas = 1;

  mensagem = '';

  ngOnInit(): void {
    this.instrutorId =
      this.instrutorIdInput ||
      history.state?.instrutorId ||
      sessionStorage.getItem('instrutorIdSelecionado') ||
      localStorage.getItem('instrutorIdSelecionado') ||
      '';

    if (!this.instrutorId) {
      this.mensagem = 'Instrutor não encontrado.';
      return;
    }

    this.carregarInstrutor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instrutorIdInput']?.currentValue) {
      this.instrutorId = changes['instrutorIdInput'].currentValue;
      this.carregarInstrutor();
    }
  }

  get disponibilidadesAgenda(): any[] {
    return this.agenda?.disponibilidades || [];
  }

  carregarInstrutor(): void {
    this.http
      .get<any>(`${this.apiUrl}/instrutores/configuracoes/detalhes-aluno/${this.instrutorId}`)
      .subscribe({
        next: (res) => {
          console.log('INSTRUTOR RECEBIDO:', res);

          this.instrutor = res;

          this.veiculoId = res?.veiculoId || '';
          this.valorAula = Number(res?.valorAula || 0);
          this.duracaoAula = Number(res?.duracaoAula || 0);
          this.intervaloAula = Number(res?.intervaloAula || 0);
          this.toleranciaEspera = Number(res?.toleranciaAtraso || 0);
          this.localEncontro = res?.localEncontro || 'Local não informado';

          this.veiculoTexto = [
            res?.marca,
            res?.modelo,
            res?.cor,
            res?.ano,
            res?.cambio,
            res?.categoriaVeiculo
          ].filter(Boolean).join(' ') || 'Veículo não informado';

          this.carregarAgendaInstrutor();
        },
        error: (err) => {
          console.error('Erro ao carregar instrutor:', err);
          this.mensagem = 'Erro ao carregar dados do instrutor.';
        }
      });
  }

  carregarAgendaInstrutor(): void {
    const usuarioIdAgenda = this.instrutor?.usuarioId;

    if (!usuarioIdAgenda) {
      this.mensagem = 'usuarioId do instrutor não veio do backend.';
      return;
    }

    this.http
      .get<any>(`${this.apiUrl}/agenda-config/usuario/${usuarioIdAgenda}`)
      .subscribe({
        next: (agenda) => {
          console.log('AGENDA RECEBIDA:', agenda);

          if (!agenda) {
            this.agenda = null;
            this.mensagem = 'Agenda do instrutor não encontrada.';
            return;
          }

          this.agenda = agenda;

          this.duracaoAula = Number(agenda.duracaoAula ?? this.duracaoAula);
          this.valorAula = Number(agenda.valorAula ?? this.valorAula);
          this.intervaloAula = Number(agenda.intervaloAula ?? this.intervaloAula);
          this.toleranciaEspera = Number(agenda.toleranciaEspera ?? this.toleranciaEspera);

          this.mensagem = '';
        },
        error: (err) => {
          console.error('Erro ao carregar agenda:', err);
          this.agenda = null;
          this.mensagem = 'Agenda do instrutor não encontrada.';
        }
      });
  }

  aoSelecionarData(data: Date): void {
    this.dataSelecionada = data;
    this.dataSelecionadaFormatada = this.formatarDataApi(data);

    this.horarioInicio = '';
    this.horarioFim = '';
    this.quantidadeAulas = 1;

    this.buscarHorariosDisponiveis();
  }

buscarHorariosDisponiveis(): void {
  if (!this.dataSelecionadaFormatada) return;

  const instrutorId = this.instrutor?.instrutorId || this.instrutorId;

  this.http
    .get<any>(
      `${this.apiUrl}/aulas/disponiveis?instrutorId=${instrutorId}&data=${this.dataSelecionadaFormatada}`
    )
    .subscribe({
      next: (res) => {
        console.log('HORÁRIOS DISPONÍVEIS:', res);

        this.horariosDisponiveis = (res?.horarios || []).filter((h: any) => h.podeUmaAula);

        this.horarioInicio = '';
        this.horarioFim = '';
        this.quantidadeAulas = 1;

        if (!this.horariosDisponiveis.length) {
          this.mensagem = 'Não há horários disponíveis para essa data.';
          return;
        }

        this.mensagem = '';
      },
      error: (err) => {
        console.error('Erro ao buscar horários disponíveis:', err);
        this.horariosDisponiveis = [];
        this.mensagem = 'Erro ao buscar horários disponíveis.';
      }
    });
}

  gerarSlotsDoDia(horaInicio: string, horaFim: string): any[] {
    if (!horaInicio || !horaFim || !this.duracaoAula) return [];

    const inicioMin = this.horaParaMinutos(horaInicio);
    const fimMin = this.horaParaMinutos(horaFim);

    const slots: any[] = [];
    let atual = inicioMin;

    while (atual + this.duracaoAula <= fimMin) {
      const fimUmaAula = atual + this.duracaoAula;
      const fimDuasAulas = atual + this.duracaoAula + this.intervaloAula + this.duracaoAula;

      slots.push({
        inicio: this.minutosParaHora(atual),
        fimUmaAula: this.minutosParaHora(fimUmaAula),
        fimDuasAulas: this.minutosParaHora(fimDuasAulas),
        podeUmaAula: fimUmaAula <= fimMin,
        podeDuasAulas: fimDuasAulas <= fimMin
      });

      atual = fimUmaAula + this.intervaloAula;
    }

    return slots;
  }

  aoAlterarHorario(): void {
    const horario = this.horariosDisponiveis.find(h => h.inicio === this.horarioInicio);

    if (!horario) {
      this.horarioFim = '';
      return;
    }

    if (Number(this.quantidadeAulas) === 2 && !horario.podeDuasAulas) {
      this.quantidadeAulas = 1;
    }

    this.horarioFim = Number(this.quantidadeAulas) === 2
      ? horario.fimDuasAulas
      : horario.fimUmaAula;
  }

  podeDuasAulasSelecionado(): boolean {
    const horario = this.horariosDisponiveis.find(h => h.inicio === this.horarioInicio);
    return !!horario?.podeDuasAulas;
  }

  agendarAula(): void {
    if (!this.alunoId) {
      alert('Aluno não identificado. Faça login novamente.');
      return;
    }

    if (!this.dataSelecionadaFormatada || !this.horarioInicio || !this.horarioFim) {
      alert('Selecione uma data e um horário.');
      return;
    }

    const payload = {
      instrutorId: this.instrutor?.instrutorId || this.instrutorId,
      alunoId: this.alunoId,
      data: this.dataSelecionadaFormatada,
      horarioInicio: this.horarioInicio,
      horarioFim: this.horarioFim,
      quantidadeAulas: Number(this.quantidadeAulas),
      duracaoAula: Number(this.duracaoAula),
      intervaloAula: Number(this.intervaloAula),
      toleranciaAtraso: Number(this.toleranciaEspera),
      valorAula: Number(this.valorAula),
      taxa: Number(this.taxa || 0),
      total: Number(this.valorAula) * Number(this.quantidadeAulas) + Number(this.taxa || 0),
      localEncontro: this.localEncontro,
      veiculoId: this.veiculoId,
      status: 'AGENDADA'
    };

    console.log('PAYLOAD AGENDAMENTO:', payload);

    this.http.post(`${this.apiUrl}/aulas/agendar`, payload).subscribe({
      next: () => {
        alert('Aula agendada com sucesso!');
        this.router.navigate(['/aluno/agenda']);
      },
      error: (err) => {
        console.error('Erro ao agendar aula:', err);

        const msg =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || 'Não foi possível agendar a aula.';

        alert(msg);
        this.mensagem = msg;

        this.buscarHorariosDisponiveis();
      }
    });
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

  horaParaMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  minutosParaHora(total: number): string {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  formatarDataApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}