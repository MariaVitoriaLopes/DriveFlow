import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CalendarComponent } from '../../../components/layout/calendario/calendario';

interface HorarioSlotDTO {
  inicio: string;
  fim: string;
  podeUmaAula: boolean;
  podeDuasAulas: boolean;
}

interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  principal: boolean;
}

interface LocalAtendimento {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  favorito: boolean;
}

interface InstrutorPerfilCompletoDTO {
  usuario: { id: string; nome: string; fotoUrl: string; bio: string };
  veiculos: Veiculo[];
  locaisAtendimento: LocalAtendimento[];
  duracaoAula: number;
  toleranciaEspera: number;
  intervaloAula: number;
  valorAula: number;
}

@Component({
  selector: 'app-perfil-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, CalendarComponent],
  templateUrl: './perfil-agendamento.html',
  styleUrls: ['./perfil-agendamento.scss'],
})
export class PerfilAgendamentoComponent implements OnInit {
  instrutor!: InstrutorPerfilCompletoDTO;
  dataSelecionada: Date = new Date();
  horariosDisponiveis: HorarioSlotDTO[] = [];
  horarioInicio: string = '';
  quantidadeAulas: number = 1;
  horarioFim: string = '';
  total: number = 0;
  localEncontro: string = '';
  mensagemErro: string = '';
  mapaUrlSeguro: SafeResourceUrl | null = null;

  constructor(
    public router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

ngOnInit(): void {
  const instrutorId = sessionStorage.getItem('instrutorIdSelecionado') || localStorage.getItem('instrutorIdSelecionado');

  if (!instrutorId) {
    this.mensagemErro = 'Instrutor não encontrado.';
    return;
  }

  this.carregarInstrutor(instrutorId);
}

  carregarInstrutor(instrutorId: string) {
    this.http.get<InstrutorPerfilCompletoDTO>(`/api/instrutores/configuracoes/${instrutorId}`).subscribe({
      next: (instr) => {
        this.instrutor = instr;

        const local = instr.locaisAtendimento.find(l => l.favorito) || instr.locaisAtendimento[0];
        if (local) this.localEncontro = `${local.logradouro}, ${local.bairro}, ${local.cidade}-${local.uf}`;

        if (this.localEncontro)
          this.mapaUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://maps.google.com/?q=${encodeURIComponent(this.localEncontro)}`
          );

        this.buscarHorariosPorDiaSemana(this.dataSelecionada);
      },
      error: () => (this.mensagemErro = 'Erro ao carregar dados do instrutor.')
    });
  }

  buscarHorariosPorDiaSemana(data: Date) {
    if (!this.instrutor) return;

    const diasSemana = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
    const diaNome = diasSemana[data.getDay()];

    this.http.get<HorarioSlotDTO[]>(`/api/instrutores/configuracoes/${this.instrutor.usuario.id}/agenda/${diaNome}`)
      .subscribe({
        next: (horarios) => {
          this.horariosDisponiveis = horarios;
          this.mensagemErro = horarios.length === 0 ? 'Não há horários disponíveis neste dia.' : '';
        },
        error: () => (this.mensagemErro = 'Erro ao buscar horários disponíveis.')
      });
  }

  onDataChange() {
    if (!this.instrutor) return;
    this.horarioInicio = '';
    this.horarioFim = '';
    this.total = 0;
    this.buscarHorariosPorDiaSemana(this.dataSelecionada);
  }

  atualizarFimETotal() {
    const slot = this.horariosDisponiveis.find(s => s.inicio === this.horarioInicio);
    if (!slot || !this.instrutor) return;

    let minutosTotais = 0;
    for (let i = 0; i < this.quantidadeAulas; i++) {
      minutosTotais += this.instrutor.duracaoAula;
      if (i < this.quantidadeAulas - 1) minutosTotais += this.instrutor.intervaloAula;
    }

    const [h, m] = slot.inicio.split(':').map(Number);
    minutosTotais += h * 60 + m;
    const fimHora = Math.floor(minutosTotais / 60);
    const fimMinuto = minutosTotais % 60;
    this.horarioFim = `${fimHora.toString().padStart(2, '0')}:${fimMinuto.toString().padStart(2, '0')}`;

    this.total = this.instrutor.valorAula * this.quantidadeAulas;
  }

  agendarAula() {
    if (!this.horarioInicio || !this.dataSelecionada || !this.instrutor) {
      this.mensagemErro = 'Selecione data e horário.';
      return;
    }

    const alunoId = localStorage.getItem('usuarioId') || '';
    const veiculo = this.instrutor.veiculos.find(v => v.principal) || this.instrutor.veiculos[0];

    const payload = {
      instrutorId: this.instrutor.usuario.id,
      alunoId,
      data: this.dataSelecionada.toISOString().split('T')[0],
      horarioInicio: this.horarioInicio,
      horarioFim: this.horarioFim,
      quantidadeAulas: this.quantidadeAulas,
      duracaoAula: this.instrutor.duracaoAula,
      intervaloAula: this.instrutor.intervaloAula,
      valorAula: this.instrutor.valorAula,
      taxa: 0.12,
      total: this.total,
      status: 'AGENDADA',
      localEncontro: this.localEncontro,
      veiculoId: veiculo?.id || ''
    };

    this.http.post('/api/aulas/agendar', payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => (this.mensagemErro = 'Erro ao agendar aula.')
    });
  }

  selectDay(day: any) {
    if (!day.date || !this.instrutor) return;
    this.dataSelecionada = day.date;
    this.horarioInicio = '';
    this.horarioFim = '';
    this.total = 0;
    this.buscarHorariosPorDiaSemana(this.dataSelecionada);
  }

  trackByIndex(index: number, item: any) {
    return index;
  }
}