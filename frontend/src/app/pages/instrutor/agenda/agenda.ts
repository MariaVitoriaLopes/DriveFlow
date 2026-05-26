import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { CalendarioAgenda } from '../../../components/layout/calendario-agenda/calendario-agenda';

interface HorarioAgenda {
  dia: string;
  diaBackend: string;
  inicio: string;
  fim: string;
  bloqueio: boolean;
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, HeaderInstrutor, CalendarioAgenda],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda implements OnInit {
  private http = inject(HttpClient);
  public router = inject(Router);

  apiUrl = 'http://localhost:8081/api';

  usuarioId = localStorage.getItem('usuarioId') || localStorage.getItem('userId') || '';

  agenda: any = null;
  aulas: any[] = [];
  aulasDoDia: any[] = [];

  dataSelecionada = new Date();

  disponibilidadeNovasAulas = true;

  duracaoAula = 0;
  intervaloAulas = 0;
  valorAula = 0;
  toleranciaEspera = 0;

  horarios: HorarioAgenda[] = [];
  folgas: number[] = [];

  resumoSemana = [
    { dia: 'Dom', diaBackend: 'DOMINGO', quantidade: 0 },
    { dia: 'Seg', diaBackend: 'SEGUNDA', quantidade: 0 },
    { dia: 'Ter', diaBackend: 'TERCA', quantidade: 0 },
    { dia: 'Qua', diaBackend: 'QUARTA', quantidade: 0 },
    { dia: 'Qui', diaBackend: 'QUINTA', quantidade: 0 },
    { dia: 'Sex', diaBackend: 'SEXTA', quantidade: 0 },
    { dia: 'Sáb', diaBackend: 'SABADO', quantidade: 0 },
  ];

  menuAbertoId: string | null = null;
  mensagem = '';

  ngOnInit(): void {
    this.carregarTudo();
  }

  carregarTudo(): void {
    this.carregarConfigAgenda();
    this.carregarAulas();
  }

  carregarConfigAgenda(): void {
    if (!this.usuarioId) {
      this.mensagem = 'Instrutor não identificado.';
      return;
    }

    this.http.get<any>(`${this.apiUrl}/agenda-config/usuario/${this.usuarioId}`)
      .subscribe({
        next: (agenda) => {
          if (!agenda) return;

          this.agenda = agenda;

          this.disponibilidadeNovasAulas = agenda.disponibilidadeNovasAulas ?? true;
          this.duracaoAula = Number(agenda.duracaoAula || 0);
          this.intervaloAulas = Number(agenda.intervaloAula || 0);
          this.valorAula = Number(agenda.valorAula || 0);
          this.toleranciaEspera = Number(agenda.toleranciaEspera || 0);

          this.horarios = (agenda.disponibilidades || []).map((item: any) => ({
            dia: this.nomeDiaCurto(item.diaSemana),
            diaBackend: item.diaSemana,
            inicio: item.horaInicio,
            fim: item.horaFim,
            bloqueio: item.bloqueado === true
          }));

          this.gerarFolgas();
        },
        error: (err) => {
          console.error('Erro ao carregar configuração da agenda:', err);
          this.mensagem = 'Erro ao carregar configuração da agenda.';
        }
      });
  }

  carregarAulas(): void {
    if (!this.usuarioId) return;

    this.http.get<any[]>(`${this.apiUrl}/aulas/instrutor/${this.usuarioId}`)
      .subscribe({
        next: (res) => {
          this.aulas = res || [];
          this.filtrarAulasDoDia();
          this.gerarResumoSemana();
        },
        error: (err) => {
          console.error('Erro ao carregar aulas:', err);
          this.mensagem = 'Erro ao carregar aulas.';
        }
      });
  }

  selecionarData(data: Date): void {
    this.dataSelecionada = data;
    this.menuAbertoId = null;
    this.filtrarAulasDoDia();
  }

  filtrarAulasDoDia(): void {
    const data = this.formatarDataApi(this.dataSelecionada);

    this.aulasDoDia = this.aulas
      .filter(aula => aula.data === data && aula.status !== 'CANCELADA')
      .sort((a, b) => String(a.horarioInicio).localeCompare(String(b.horarioInicio)));
  }

  get primeiraAulaDoDia(): any | null {
    return this.aulasDoDia.length ? this.aulasDoDia[0] : null;
  }

  get tituloAgenda(): string {
    const hoje = this.formatarDataApi(new Date());
    const selecionada = this.formatarDataApi(this.dataSelecionada);

    return hoje === selecionada
      ? 'Agenda de hoje'
      : `Agenda do dia ${this.dataSelecionada.toLocaleDateString('pt-BR')}`;
  }

  getNomeAluno(aula: any): string {
    return aula.alunoNome || aula.nomeAluno || aula.aluno?.nome || 'Aluno';
  }

  getFotoAluno(aula: any): string {
    return aula.alunoFotoUrl || aula.fotoAlunoUrl || aula.aluno?.fotoUrl || '/images/avatar-placeholder.png';
  }

  abrirMenu(aulaId: string): void {
    this.menuAbertoId = this.menuAbertoId === aulaId ? null : aulaId;
  }

  cancelarAula(aula: any): void {
    if (!confirm('Deseja cancelar esta aula?')) return;

    this.http.put(`${this.apiUrl}/aulas/${aula.id}/cancelar`, {})
      .subscribe({
        next: () => {
          alert('Aula cancelada com sucesso.');
          this.menuAbertoId = null;
          this.carregarAulas();
        },
        error: (err) => {
          console.error('Erro ao cancelar aula:', err);
          alert('Erro ao cancelar aula.');
        }
      });
  }

  denunciar(aula: any): void {
    alert('Função de denúncia ainda será implementada.');
    this.menuAbertoId = null;
  }

  iniciarAula(aula: any): void {
    alert('Função de iniciar aula ainda será implementada.');
  }

  alterarDisponibilidade(): void {
    this.disponibilidadeNovasAulas = !this.disponibilidadeNovasAulas;

    const payload = {
      ...this.agenda,
      usuarioId: this.usuarioId,
      disponibilidadeNovasAulas: this.disponibilidadeNovasAulas,
      duracaoAula: this.duracaoAula,
      valorAula: this.valorAula,
      intervaloAula: this.intervaloAulas,
      toleranciaEspera: this.toleranciaEspera,
      disponibilidades: this.horarios.map(h => ({
        diaSemana: h.diaBackend,
        horaInicio: h.inicio,
        horaFim: h.fim,
        bloqueado: h.bloqueio
      }))
    };

    this.http.post(`${this.apiUrl}/agenda-config/salvar`, payload)
      .subscribe({
        next: () => {
          alert(
            this.disponibilidadeNovasAulas
              ? 'Agenda ativada para novas aulas.'
              : 'Agenda bloqueada para novas aulas.'
          );
        },
        error: (err) => {
          console.error('Erro ao alterar disponibilidade:', err);
          this.disponibilidadeNovasAulas = !this.disponibilidadeNovasAulas;
          alert('Erro ao alterar disponibilidade.');
        }
      });
  }

  gerarResumoSemana(): void {
    this.resumoSemana = this.resumoSemana.map(item => {
      const quantidade = this.aulas.filter(aula => {
        if (!aula.data || aula.status === 'CANCELADA') return false;

        const data = this.criarDataLocal(aula.data);
        return this.nomeDiaBackendPorData(data) === item.diaBackend;
      }).length;

      return { ...item, quantidade };
    });
  }

  gerarFolgas(): void {
    const diasComAtendimento = this.horarios
      .filter(h => !h.bloqueio)
      .map(h => h.diaBackend);

    const ano = this.dataSelecionada.getFullYear();
    const mes = this.dataSelecionada.getMonth();
    const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

    this.folgas = [];

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const data = new Date(ano, mes, dia);
      const diaBackend = this.nomeDiaBackendPorData(data);

      if (!diasComAtendimento.includes(diaBackend)) {
        this.folgas.push(dia);
      }
    }
  }

  intensidadeBolinha(quantidade: number): string {
    if (quantidade >= 5) return 'dark';
    if (quantidade >= 3) return 'strong';
    if (quantidade >= 1) return 'medium';
    return '';
  }

  nomeDiaCurto(dia: string): string {
    const dias: any = {
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

    return dias[dia] || dia;
  }

  nomeDiaBackendPorData(data: Date): string {
    return ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'][data.getDay()];
  }

  criarDataLocal(data: string): Date {
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  formatarDataApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}