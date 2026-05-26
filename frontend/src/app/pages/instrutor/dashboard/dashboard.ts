import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { CalendarioAgenda } from '../../../components/layout/calendario-agenda/calendario-agenda';

interface WeekStat {
  weekDay: string;
  date: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    HeaderInstrutor,
    CalendarioAgenda,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);

  apiUrl = 'http://localhost:8081/api';
  usuarioId = localStorage.getItem('usuarioId') || localStorage.getItem('userId') || '';

  selectedDate = new Date();

  agenda: any = null;
  aulas: any[] = [];
  todayLessons: any[] = [];
  weekStats: WeekStat[] = [];

  disponibilidadeNovasAulas = true;
  duracaoAula = 0;
  intervaloAulas = 0;
  valorAula = 0;
  toleranciaEspera = 0;

  mensagem = '';

ngOnInit(): void {
  this.selectedDate = new Date();
  this.carregarTudo();
}

carregarTudo(): void {
  this.carregarConfigAgenda();
  this.carregarAulas();
}

  carregarConfigAgenda(): void {
    if (!this.usuarioId) return;

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
        },
        error: (err) => {
          console.error('Erro ao carregar configuração da agenda:', err);
        }
      });
  }

carregarAulas(): void {
  if (!this.usuarioId) {
    this.mensagem = 'Instrutor não identificado.';
    return;
  }

  this.http.get<any[]>(`${this.apiUrl}/aulas/instrutor/${this.usuarioId}`)
    .subscribe({
      next: (res) => {
        this.aulas = res || [];

        this.selectedDate = new Date();

        this.filtrarAulasDoDia();
        this.generateWeekStats();
      },
      error: (err) => {
        console.error('Erro ao carregar aulas:', err);
        this.mensagem = 'Erro ao carregar aulas.';
        this.generateWeekStats();
      }
    });
}

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.filtrarAulasDoDia();
  }

  filtrarAulasDoDia(): void {
    const data = this.formatarDataApi(this.selectedDate);

    this.todayLessons = this.aulas
      .filter(aula => aula.data === data && aula.status !== 'CANCELADA')
      .sort((a, b) => String(a.horarioInicio).localeCompare(String(b.horarioInicio)));
  }

  get primeiraAula(): any | null {
    return this.todayLessons.length ? this.todayLessons[0] : null;
  }

  get totalHoje(): number {
    return this.todayLessons.length;
  }

  get totalSemana(): number {
    return this.weekStats.reduce((acc, item) => acc + item.total, 0);
  }

  get diasFolgaSemana(): number {
    return this.weekStats.filter(item => item.total === 0).length;
  }

  get tituloAgenda(): string {
    const hoje = this.formatarDataApi(new Date());
    const selecionada = this.formatarDataApi(this.selectedDate);

    return hoje === selecionada
      ? 'Agenda de hoje'
      : `Agenda do dia ${this.selectedDate.toLocaleDateString('pt-BR')}`;
  }

  getNomeAluno(aula: any): string {
    return aula?.alunoNome || aula?.nomeAluno || aula?.aluno?.nome || 'Aluno';
  }

  getFotoAluno(aula: any): string {
    return aula?.alunoFotoUrl || aula?.fotoAlunoUrl || aula?.aluno?.fotoUrl || '/images/avatar-placeholder.png';
  }

  cancelarAula(aula: any): void {
    if (!confirm('Deseja cancelar esta aula?')) return;

    this.http.put(`${this.apiUrl}/aulas/${aula.id}/cancelar`, {})
      .subscribe({
        next: () => {
          alert('Aula cancelada com sucesso.');
          this.carregarAulas();
        },
        error: (err) => {
          console.error('Erro ao cancelar aula:', err);
          alert('Erro ao cancelar aula.');
        }
      });
  }

  iniciarAula(aula: any): void {
    alert('Função de iniciar aula ainda será implementada.');
  }

  alterarDisponibilidade(): void {
    this.disponibilidadeNovasAulas = !this.disponibilidadeNovasAulas;

    const payload = {
      ...this.agenda,
      usuarioId: this.usuarioId,
      disponibilidadeNovasAulas: this.disponibilidadeNovasAulas
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

  private generateWeekStats(): void {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    this.weekStats = [];

    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(hoje);
      date.setDate(hoje.getDate() + i);

      const dataApi = this.formatarDataApi(date);

      const total = this.aulas.filter(aula =>
        aula.data === dataApi &&
        aula.status !== 'CANCELADA'
      ).length;

      this.weekStats.push({
        weekDay: diasSemana[date.getDay()],
        date: date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        }),
        total
      });
    }
  }

  formatarDataApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}