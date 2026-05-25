import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Instrutor {
  id: string;
  nome: string;
  bio: string;
  fotoPerfilUrl?: string;
  veiculoId?: string;
  veiculo?: { marca: string; modelo: string; cor: string; ano: string; placa: string; };
  enderecoFavorito?: string;
}

interface AgendaConfig {
  duracaoAula: number;
  intervaloAula: number;
  toleranciaAtraso: number;
  valorAula: number;
  taxa: number;
}

interface HorarioSlot {
  inicio: string;
  fimUmaAula: string;
  fimDuasAulas: string;
  podeUmaAula: boolean;
  podeDuasAulas: boolean;
}

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './perfil-agendamento.html',
  styleUrls: ['./perfil-agendamento.scss']
})
export class PerfilAgendamento implements OnInit {
  private http = inject(HttpClient);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  instrutorId!: string;
  alunoId: string = localStorage.getItem('usuarioId') || '';
  instrutor?: Instrutor;
  agendaConfig?: AgendaConfig;
  dataSelecionada: string = '';
  horariosDisponiveis: HorarioSlot[] = [];
  horarioInicio: string = '';
  quantidadeAulas: number = 1;
  horarioFim: string = '';
  total: number = 0;
  veiculoSelecionadoId?: string;
  localEncontro?: string;
  mensagemErro: string = '';

  ngOnInit() {
    this.instrutorId = history.state.instrutorId || sessionStorage.getItem('instrutorId') || '';
    if (!this.instrutorId) { 
      this.router.navigate(['/']); 
      return; 
    }
    this.carregarDadosInstrutor();
    this.carregarAgendaConfig();
  }

  carregarDadosInstrutor() {
    this.http.get<Instrutor>(`/api/instrutores/configuracoes/${this.instrutorId}`).subscribe(
      data => {
        this.instrutor = {
          id: data.id,
          nome: data.nome,
          bio: data.bio,
          fotoPerfilUrl: data.fotoPerfilUrl || '/assets/images/avatar-placeholder.png',
          veiculoId: data.veiculoId,
          veiculo: data.veiculo,
          enderecoFavorito: data.enderecoFavorito
        };
        this.localEncontro = this.instrutor.enderecoFavorito;
        this.veiculoSelecionadoId = this.instrutor.veiculoId;
      },
      err => this.mensagemErro = 'Erro ao carregar dados do instrutor.'
    );
  }

  carregarAgendaConfig() {
    this.http.get<AgendaConfig>(`/api/agenda-config/usuario/${this.instrutorId}`).subscribe(
      data => this.agendaConfig = data,
      err => this.mensagemErro = 'Instrutor sem agenda configurada.'
    );
  }

  buscarHorarios() {
    if (!this.dataSelecionada) return;
    this.http.get<HorarioSlot[]>(`/api/aulas/disponiveis?instrutorId=${this.instrutorId}&data=${this.dataSelecionada}`).subscribe(
      slots => this.horariosDisponiveis = slots,
      err => this.mensagemErro = 'Não foi possível carregar horários disponíveis.'
    );
  }

  atualizarFimETotal() {
    const slot = this.horariosDisponiveis.find(h => h.inicio === this.horarioInicio);
    if (!slot || !this.agendaConfig) return;
    this.horarioFim = this.quantidadeAulas === 1 ? slot.fimUmaAula : slot.fimDuasAulas;
    this.total = (this.agendaConfig.valorAula * this.quantidadeAulas) + (this.agendaConfig.taxa || 0);
  }

  agendarAula() {
    if (!this.horarioInicio || !this.horarioFim || !this.veiculoSelecionadoId || !this.localEncontro || !this.agendaConfig) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const payload = {
      instrutorId: this.instrutorId,
      alunoId: this.alunoId,
      data: this.dataSelecionada,
      horarioInicio: this.horarioInicio,
      horarioFim: this.horarioFim,
      quantidadeAulas: this.quantidadeAulas,
      duracaoAula: this.agendaConfig.duracaoAula,
      intervaloAula: this.agendaConfig.intervaloAula,
      valorAula: this.agendaConfig.valorAula,
      taxa: this.agendaConfig.taxa,
      total: this.total,
      localEncontro: this.localEncontro,
      veiculoId: this.veiculoSelecionadoId,
      status: 'AGENDADA'
    };

    this.http.post('/api/aulas/agendar', payload).subscribe(
      () => { alert('Aula agendada com sucesso!'); this.router.navigate(['/']); },
      err => this.mensagemErro = err.error?.message || 'Erro ao agendar aula.'
    );
  }
}