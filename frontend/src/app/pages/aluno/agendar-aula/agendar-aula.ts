import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-agendar-aula',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './agendar-aula.html',
  styleUrl: './agendar-aula.scss',
})
export class AgendarAula implements OnInit {
  private http = inject(HttpClient);
  public router = inject(Router);

  apiUrl = 'http://localhost:8081/api';

  instrutorId = '';
  alunoId = localStorage.getItem('usuarioId') || '';

  instrutor: any;
  agenda: any;
  aulasDoDia: any[] = [];

  hoje = new Date();
  anoAtual = this.hoje.getFullYear();
  mesAtualNumero = this.hoje.getMonth();
  diaAtual = this.hoje.getDate();

  mesAtual = '';
  diasCalendario: { dia: number; data?: Date; foraDoMes?: boolean }[] = [];
  dataSelecionada: Date | null = null;
  dataSelecionadaFormatada = '';

  duracaoAula = 60;
  intervaloAula = 0;
  toleranciaEspera = 0;
  valorAula = 0;
  taxa = 0.12;

  localEncontro = 'Local não informado';
  veiculoTexto = 'Veículo não informado';

  horariosDisponiveis: any[] = [];
  horarioInicio = '';
  horarioFim = '';
  quantidadeAulas = 1;

  carregando = false;
  mensagem = '';

  mapaUrl!: SafeResourceUrl;

  ngOnInit(): void {
    this.instrutorId =
      history.state?.instrutorId ||
      sessionStorage.getItem('instrutorIdSelecionado') ||
      '';

    if (!this.instrutorId) {
      this.mensagem = 'Instrutor não encontrado.';
      return;
    }

    this.gerarCalendario();
    this.carregarDadosInstrutor();
  }

  carregarDadosInstrutor(): void {
    this.carregando = true;

    this.http
      .get<any>(`${this.apiUrl}/instrutores/configuracoes/${this.instrutorId}`)
      .subscribe({
        next: (res) => {
          this.instrutor = res;

          // Pega o endereço favorito
          const local = res.locaisAtendimento?.find((l: any) => l.favorito) || res.locaisAtendimento?.[0];
          this.localEncontro = local
            ? `${local.logradouro || ''} - ${local.bairro || ''}, ${local.cidade || ''}`
            : 'Local não informado';

          // Veículo principal
          const veiculo = res.veiculos?.find((v: any) => v.principal) || res.veiculos?.[0];
          this.veiculoTexto = veiculo
            ? `${veiculo.marca} ${veiculo.modelo} ${veiculo.cor} ${veiculo.ano}`
            : 'Veículo não informado';

          this.duracaoAula = res.duracaoAula;
          this.intervaloAula = res.intervaloAula;
          this.toleranciaEspera = res.toleranciaEspera;
          this.valorAula = res.valorAula;

          this.carregando = false;

          this.gerarMapa(this.localEncontro);
        },
        error: () => {
          this.carregando = false;
          this.mensagem = 'Erro ao carregar dados do instrutor.';
        },
      });
  }

  gerarCalendario(): void {
    const primeiroDia = new Date(this.anoAtual, this.mesAtualNumero, 1);
    const ultimoDia = new Date(this.anoAtual, this.mesAtualNumero + 1, 0);
    const diaSemanaInicio = primeiroDia.getDay();
    const totalDiasMes = ultimoDia.getDate();

    this.mesAtual = primeiroDia.toLocaleDateString('pt-BR', { month: 'long' });
    this.mesAtual = this.mesAtual.charAt(0).toUpperCase() + this.mesAtual.slice(1);

    const dias: any[] = [];
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      dias.push({ dia: null, foraDoMes: true });
    }
    for (let dia = 1; dia <= totalDiasMes; dia++) {
      dias.push({ dia, data: new Date(this.anoAtual, this.mesAtualNumero, dia) });
    }
    while (dias.length % 7 !== 0) dias.push({ dia: null, foraDoMes: true });
    this.diasCalendario = dias;
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

  selecionarDia(item: any): void {
    if (!item.data) return;
    this.dataSelecionada = item.data;
    this.dataSelecionadaFormatada = this.formatarDataApi(item.data);
    this.buscarAulasDoDia();
  }

  buscarAulasDoDia(): void {
    this.http
      .get<any[]>(`${this.apiUrl}/aulas/instrutor/${this.instrutorId}/dia?data=${this.dataSelecionadaFormatada}`)
      .subscribe({ next: (res) => { this.aulasDoDia = res || []; this.gerarHorariosDisponiveis(); }, error: () => { this.aulasDoDia = []; this.gerarHorariosDisponiveis(); } });
  }

  gerarHorariosDisponiveis(): void {
    // Aqui você precisa chamar /api/aulas/disponiveis ou gerar localmente a lista
    this.http
      .get<any[]>(`${this.apiUrl}/aulas/disponiveis?instrutorId=${this.instrutorId}&data=${this.dataSelecionadaFormatada}`)
      .subscribe({ next: (res) => { this.horariosDisponiveis = res || []; }, error: () => { this.horariosDisponiveis = []; } });
  }

  aoAlterarHorario(): void {
    const horario = this.horariosDisponiveis.find(h => h.inicio === this.horarioInicio);
    if (!horario) { this.horarioFim = ''; return; }
    this.horarioFim = this.quantidadeAulas === 2 ? horario.fimDuasAulas : horario.fimUmaAula;
  }

  agendarAula(): void {
    if (!this.dataSelecionada || !this.horarioInicio) { this.mensagem = 'Selecione data e horário'; return; }

    const payload = {
      instrutorId: this.instrutorId,
      alunoId: this.alunoId,
      data: this.dataSelecionadaFormatada,
      horarioInicio: this.horarioInicio,
      horarioFim: this.horarioFim,
      quantidadeAulas: this.quantidadeAulas,
      duracaoAula: this.duracaoAula,
      intervaloAula: this.intervaloAula,
      valorAula: this.valorAula,
      taxa: this.taxa,
      total: this.valorAula * this.quantidadeAulas + this.taxa,
      localEncontro: this.localEncontro,
      veiculoId: this.instrutor.veiculo?.id,
      status: 'AGENDADA',
    };

    this.http.post(`${this.apiUrl}/aulas/agendar`, payload).subscribe({
      next: () => this.router.navigate(['/aluno']),
      error: () => this.mensagem = 'Erro ao agendar aula.',
    });
  }

  formatarDataApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  gerarMapa(endereco: string): void {
    const url = `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;
    this.mapaUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(url);
  }
}