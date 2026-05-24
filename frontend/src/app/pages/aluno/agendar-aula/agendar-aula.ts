import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface DiaCalendario {
  dia: number | null;
  data?: Date;
  foraDoMes?: boolean;
}

interface HorarioDisponivel {
  inicio: string;
  fimUmaAula: string;
  fimDuasAulas: string;
  podeUmaAula: boolean;
  podeDuasAulas: boolean;
}

@Component({
  selector: 'app-agendar-aula',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './agendar-aula.html',
  styleUrl: './agendar-aula.scss',
})
export class AgendarAula implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

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
  diasCalendario: DiaCalendario[] = [];
  dataSelecionada: Date | null = null;
  dataSelecionadaFormatada = '';

  duracaoAula = 60;
  intervaloAula = 0;
  toleranciaEspera = 0;
  valorAula = 0;
  taxa = 0.12;

  localEncontro = 'Local não informado';
  veiculoTexto = 'Veículo não informado';

  horariosDisponiveis: HorarioDisponivel[] = [];
  horarioInicio = '';
  horarioFim = '';
  quantidadeAulas = 1;

  carregando = false;
  mensagem = '';

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

          this.montarLocalEncontro();
          this.montarVeiculo();

          this.carregarAgenda();
        },
        error: () => {
          this.carregando = false;
          this.mensagem = 'Erro ao carregar dados do instrutor.';
        },
      });
  }

  carregarAgenda(): void {
    this.http
      .get<any>(`${this.apiUrl}/instrutores/agenda/${this.instrutorId}`)
      .subscribe({
        next: (res) => {
          this.agenda = res;

          this.duracaoAula = Number(res?.duracaoAula || 60);
          this.intervaloAula = Number(res?.intervaloAula || 0);
          this.toleranciaEspera = Number(res?.toleranciaEspera || 0);
          this.valorAula = Number(res?.valorAula || 0);

          this.carregando = false;
        },
        error: () => {
          this.carregando = false;
          this.mensagem = 'Esse instrutor ainda não possui agenda cadastrada.';
        },
      });
  }

  montarLocalEncontro(): void {
    const locais = this.instrutor?.locaisAtendimento || [];
    const favorito = locais.find((local: any) => local.favorito) || locais[0];

    if (!favorito) return;

    const partes = [
      favorito.logradouro || favorito.rua,
      favorito.bairro,
      favorito.cidade,
      favorito.uf || favorito.estado,
    ].filter(Boolean);

    this.localEncontro = partes.join(' - ');
  }

  montarVeiculo(): void {
    const veiculos = this.instrutor?.veiculos || [];
    const veiculo = veiculos.find((v: any) => v.principal) || veiculos[0];

    if (!veiculo) return;

    this.veiculoTexto = `${veiculo.marca || ''} ${veiculo.modelo || ''} ${veiculo.cor || ''} ${veiculo.ano || ''}`.trim();
  }

  gerarCalendario(): void {
    const primeiroDia = new Date(this.anoAtual, this.mesAtualNumero, 1);
    const ultimoDia = new Date(this.anoAtual, this.mesAtualNumero + 1, 0);

    this.mesAtual = primeiroDia.toLocaleDateString('pt-BR', {
      month: 'long',
    });

    this.mesAtual = this.mesAtual.charAt(0).toUpperCase() + this.mesAtual.slice(1);

    const diaSemanaInicio = primeiroDia.getDay();
    const totalDiasMes = ultimoDia.getDate();

    const dias: DiaCalendario[] = [];

    const ultimoDiaMesAnterior = new Date(
      this.anoAtual,
      this.mesAtualNumero,
      0
    ).getDate();

    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      dias.push({
        dia: ultimoDiaMesAnterior - i,
        foraDoMes: true,
      });
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      dias.push({
        dia,
        data: new Date(this.anoAtual, this.mesAtualNumero, dia),
        foraDoMes: false,
      });
    }

    const proximoDia = 1;
    while (dias.length % 7 !== 0) {
      dias.push({
        dia: proximoDia + dias.filter((d) => d.foraDoMes).length,
        foraDoMes: true,
      });
    }

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

  selecionarDia(item: DiaCalendario): void {
    if (!item.data || item.foraDoMes) return;

    this.dataSelecionada = item.data;
    this.dataSelecionadaFormatada = this.formatarDataApi(item.data);

    this.horarioInicio = '';
    this.horarioFim = '';
    this.horariosDisponiveis = [];

    this.buscarAulasDoDia();
  }

  buscarAulasDoDia(): void {
    if (!this.dataSelecionadaFormatada) return;

    this.http
      .get<any[]>(
        `${this.apiUrl}/aulas/instrutor/${this.instrutorId}/dia?data=${this.dataSelecionadaFormatada}`
      )
      .subscribe({
        next: (res) => {
          this.aulasDoDia = res || [];
          this.gerarHorariosDisponiveis();
        },
        error: () => {
          this.aulasDoDia = [];
          this.gerarHorariosDisponiveis();
        },
      });
  }

  gerarHorariosDisponiveis(): void {
    this.horariosDisponiveis = [];
    this.mensagem = '';

    const disponibilidade = this.buscarDisponibilidadeDoDia();

    if (!disponibilidade) {
      this.mensagem = 'O instrutor não atende nesse dia.';
      return;
    }

    if (disponibilidade.bloqueio) {
      this.mensagem = 'Esse dia está bloqueado na agenda do instrutor.';
      return;
    }

    const inicioMin = this.horaParaMinutos(
      disponibilidade.horaInicio || disponibilidade.inicio
    );

    const fimMin = this.horaParaMinutos(
      disponibilidade.horaFim || disponibilidade.fim
    );

    const passo = this.duracaoAula + this.intervaloAula;

    for (let atual = inicioMin; atual + this.duracaoAula <= fimMin; atual += passo) {
      const fimUma = atual + this.duracaoAula;
      const fimDuas = atual + this.duracaoAula * 2;

      const podeUma = this.intervaloLivre(atual, fimUma);
      const podeDuas =
        fimDuas <= fimMin &&
        this.intervaloLivre(atual, fimDuas);

      if (podeUma || podeDuas) {
        this.horariosDisponiveis.push({
          inicio: this.minutosParaHora(atual),
          fimUmaAula: this.minutosParaHora(fimUma),
          fimDuasAulas: this.minutosParaHora(fimDuas),
          podeUmaAula: podeUma,
          podeDuasAulas: podeDuas,
        });
      }
    }

    if (this.horariosDisponiveis.length === 0) {
      this.mensagem = 'Não há horários disponíveis para esse dia.';
    }
  }

  buscarDisponibilidadeDoDia(): any {
    if (!this.dataSelecionada) return null;

    const diaSemana = this.dataSelecionada.getDay();

    const nomesPossiveis = [
      'domingo',
      'segunda',
      'terca',
      'quarta',
      'quinta',
      'sexta',
      'sabado',
    ];

    const nomeDia = nomesPossiveis[diaSemana];

    const horarios = this.agenda?.horarios || this.agenda?.dias || [];

    return horarios.find((h: any) => {
      const dia = String(h.dia || h.diaSemana || '').toLowerCase();
      return dia === nomeDia || Number(h.diaSemana) === diaSemana;
    });
  }

  intervaloLivre(inicio: number, fim: number): boolean {
    return !this.aulasDoDia.some((aula) => {
      const inicioAula = this.horaParaMinutos(
        aula.horarioInicio || aula.inicio || aula.horario
      );

      const fimAula = this.horaParaMinutos(
        aula.horarioFim || aula.fim
      );

      const fimComIntervalo = fimAula + this.intervaloAula;

      return inicio < fimComIntervalo && fim > inicioAula;
    });
  }

  aoAlterarHorario(): void {
    const horario = this.horariosDisponiveis.find(
      (h) => h.inicio === this.horarioInicio
    );

    if (!horario) {
      this.horarioFim = '';
      return;
    }

    if (this.quantidadeAulas === 2 && !horario.podeDuasAulas) {
      this.quantidadeAulas = 1;
    }

    this.horarioFim =
      this.quantidadeAulas === 2
        ? horario.fimDuasAulas
        : horario.fimUmaAula;
  }

  aoAlterarQuantidade(): void {
    this.aoAlterarHorario();
  }

  podeSelecionarDuasAulas(): boolean {
    const horario = this.horariosDisponiveis.find(
      (h) => h.inicio === this.horarioInicio
    );

    return !!horario?.podeDuasAulas;
  }

  agendarAula(): void {
    if (!this.dataSelecionadaFormatada) {
      this.mensagem = 'Selecione uma data.';
      return;
    }

    if (!this.horarioInicio) {
      this.mensagem = 'Selecione um horário.';
      return;
    }

    if (this.quantidadeAulas === 2 && !this.podeSelecionarDuasAulas()) {
      this.mensagem = 'Não existe disponibilidade para duas aulas seguidas nesse horário.';
      return;
    }

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
      total: this.total,
      status: 'AGENDADA',
      localEncontro: this.localEncontro,
    };

    this.http.post(`${this.apiUrl}/aulas/agendar`, payload).subscribe({
      next: () => {
        alert('Aula agendada com sucesso!');
        this.router.navigate(['/aluno']);
      },
      error: () => {
        this.mensagem = 'Erro ao agendar aula. Tente novamente.';
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/perfil-instrutor'], {
      state: { instrutorId: this.instrutorId },
    });
  }

  voltar(): void {
    this.router.navigate(['/aluno']);
  }

  formatarDataApi(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  horaParaMinutos(hora: string): number {
    if (!hora) return 0;

    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  minutosParaHora(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  diaSelecionado(item: DiaCalendario): boolean {
    if (!item.data || !this.dataSelecionada) return false;

    return (
      item.data.getDate() === this.dataSelecionada.getDate() &&
      item.data.getMonth() === this.dataSelecionada.getMonth() &&
      item.data.getFullYear() === this.dataSelecionada.getFullYear()
    );
  }

  get subtotal(): number {
    return this.valorAula * this.quantidadeAulas;
  }

  get total(): number {
    return this.subtotal + this.taxa;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}