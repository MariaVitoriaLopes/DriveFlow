import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CalendarioAgenda } from '../../../components/layout/calendario-agenda/calendario-agenda';

@Component({
  selector: 'app-agenda-aluno',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CalendarioAgenda],
  templateUrl: './agenda-aluno.html',
  styleUrl: './agenda-aluno.scss'
})
export class AgendaAluno implements OnInit {
  private http = inject(HttpClient);
  public router = inject(Router);

  apiUrl = 'http://localhost:8081/api';

  alunoId = localStorage.getItem('usuarioId') || localStorage.getItem('userId') || '';

  aulas: any[] = [];
  aulasDoDia: any[] = [];

  dataSelecionada = new Date();
  mensagem = '';
  menuAbertoId: string | null = null;

  ngOnInit(): void {
    this.carregarAulas();
  }

  carregarAulas(): void {
    if (!this.alunoId) {
      this.mensagem = 'Aluno não identificado.';
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/aulas/aluno/${this.alunoId}`)
      .subscribe({
        next: (res) => {
          this.aulas = res || [];
          this.filtrarAulasDoDia();
        },
        error: (err) => {
          console.error('Erro ao carregar agenda do aluno:', err);
          this.mensagem = 'Erro ao carregar agenda.';
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

  get tituloAgenda(): string {
    const hoje = this.formatarDataApi(new Date());
    const selecionada = this.formatarDataApi(this.dataSelecionada);

    return hoje === selecionada
      ? 'Agenda de hoje'
      : `Agenda do dia ${this.dataSelecionada.toLocaleDateString('pt-BR')}`;
  }

  getNomePessoa(aula: any): string {
    return aula.instrutorNome || aula.nomeInstrutor || 'Instrutor';
  }

  getFotoPessoa(aula: any): string {
    return aula.instrutorFotoUrl || aula.fotoInstrutorUrl || '/images/avatar-placeholder.png';
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
        error: () => alert('Erro ao cancelar aula.')
      });
  }

  denunciar(aula: any): void {
    alert('Função de denúncia ainda será implementada.');
    this.menuAbertoId = null;
  }

  formatarDataApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}