import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderInstrutor } from '../../layout/header-instrutor/header-instrutor';

@Component({
  selector: 'app-cadastro-agenda',
  standalone: true,
  imports: [
    CommonModule,
     ReactiveFormsModule, 
    HttpClientModule,
    HeaderInstrutor,
  ],
  templateUrl: './cadastro-agenda.html',
  styleUrls: ['./cadastro-agenda.scss']
})
export class CadastroAgenda implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  apiUrl = 'http://localhost:8081/api/instrutores/agenda';
  usuarioId = localStorage.getItem('usuarioId') || '';

  salvando = false;

  duracoesAula = [45, 50, 55, 60];
  opcoesDe5A30 = [5, 10, 15, 20, 25, 30];

  diasSemana = [
    { nome: 'Segunda', valor: 'SEGUNDA' },
    { nome: 'Terça', valor: 'TERCA' },
    { nome: 'Quarta', valor: 'QUARTA' },
    { nome: 'Quinta', valor: 'QUINTA' },
    { nome: 'Sexta', valor: 'SEXTA' },
    { nome: 'Sábado', valor: 'SABADO' },
    { nome: 'Domingo', valor: 'DOMINGO' }
  ];

  agendaForm!: FormGroup;

  ngOnInit(): void {
    this.agendaForm = this.fb.group({
      duracaoAula: [60, Validators.required],
      valorAula: [70, [Validators.required, Validators.min(1)]],
      intervaloAula: [15, Validators.required],
      toleranciaEspera: [15, Validators.required],
      disponibilidades: this.fb.array([])
    });

    this.carregarAgenda();
  }

  get disponibilidades(): FormArray {
    return this.agendaForm.get('disponibilidades') as FormArray;
  }

  getDiaControl(diaSemana: string): FormGroup {
    const existente = this.disponibilidades.controls.find(
      control => control.get('diaSemana')?.value === diaSemana
    );

    if (existente) {
      return existente as FormGroup;
    }

    return this.fb.group({
      diaSemana: [diaSemana],
      disponivel: [false],
      horaInicio: ['08:00'],
      horaFim: ['12:00'],
      bloqueado: [true]
    });
  }

  criarDiaForm(diaSemana: string): FormGroup {
    return this.fb.group(
      {
        diaSemana: [diaSemana, Validators.required],
        disponivel: [true],
        horaInicio: ['08:00', Validators.required],
        horaFim: ['12:00', Validators.required],
        bloqueado: [false]
      },
      { validators: this.validarHorario }
    );
  }

  toggleDia(diaSemana: string): void {
    const index = this.disponibilidades.controls.findIndex(
      control => control.get('diaSemana')?.value === diaSemana
    );

    if (index >= 0) {
      const dia = this.disponibilidades.at(index) as FormGroup;
      const disponivel = dia.get('disponivel')?.value;

      dia.patchValue({
        disponivel: !disponivel,
        bloqueado: disponivel
      });

      this.atualizarCamposBloqueados(dia);
      return;
    }

    this.disponibilidades.push(this.criarDiaForm(diaSemana));
  }

  alternarBloqueio(index: number): void {
    const dia = this.disponibilidades.at(index) as FormGroup;
    const bloqueado = dia.get('bloqueado')?.value;

    dia.patchValue({
      disponivel: !bloqueado
    });

    this.atualizarCamposBloqueados(dia);
  }

  atualizarCamposBloqueados(dia: FormGroup): void {
    const bloqueado = dia.get('bloqueado')?.value;

    if (bloqueado) {
      dia.get('horaInicio')?.disable({ emitEvent: false });
      dia.get('horaFim')?.disable({ emitEvent: false });
    } else {
      dia.get('horaInicio')?.enable({ emitEvent: false });
      dia.get('horaFim')?.enable({ emitEvent: false });
    }
  }

  removerDia(index: number): void {
    this.disponibilidades.removeAt(index);
  }

  validarHorario(control: AbstractControl) {
    const horaInicio = control.get('horaInicio')?.value;
    const horaFim = control.get('horaFim')?.value;
    const bloqueado = control.get('bloqueado')?.value;

    if (bloqueado) return null;

    if (!horaInicio || !horaFim) return { horarioInvalido: true };

    const inicio = CadastroAgenda.converterHoraParaMinutos(horaInicio);
    const fim = CadastroAgenda.converterHoraParaMinutos(horaFim);

    const seisHoras = 6 * 60;
    const vinteDuas = 22 * 60;
    const vinteTres = 23 * 60;

    if (
      inicio < seisHoras ||
      inicio > vinteDuas ||
      fim <= inicio ||
      fim > vinteTres
    ) {
      return { horarioInvalido: true };
    }

    return null;
  }

  static converterHoraParaMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  getNomeDia(valor: string): string {
    return this.diasSemana.find(dia => dia.valor === valor)?.nome || valor;
  }

  carregarAgenda(): void {
    if (!this.usuarioId) return;

    this.http
      .get<any>(`${this.apiUrl}/${this.usuarioId}`)
      .subscribe({
        next: agenda => {
          if (!agenda) return;

          this.agendaForm.patchValue({
            duracaoAula: agenda.duracaoAula ?? 60,
            valorAula: agenda.valorAula ?? 70,
            intervaloAula: agenda.intervaloAula ?? 15,
            toleranciaEspera: agenda.toleranciaEspera ?? 15
          });

          this.disponibilidades.clear();

          agenda.disponibilidades?.forEach((item: any) => {
            const diaForm = this.criarDiaForm(item.diaSemana);

            diaForm.patchValue({
              disponivel: !item.bloqueado,
              horaInicio: item.horaInicio,
              horaFim: item.horaFim,
              bloqueado: item.bloqueado
            });

            this.atualizarCamposBloqueados(diaForm);
            this.disponibilidades.push(diaForm);
          });
        },
        error: () => {
          console.log('Nenhuma agenda cadastrada ainda.');
        }
      });
  }

  salvarAlteracoes(): void {
    if (this.agendaForm.invalid) {
      this.agendaForm.markAllAsTouched();
      return;
    }

    const payload = {
      usuarioId: this.usuarioId,
      ...this.agendaForm.getRawValue()
    };

    this.salvando = true;

    this.http
      .put(`${this.apiUrl}/${this.usuarioId}`, payload)
      .subscribe({
        next: () => {
          this.salvando = false;
          alert('Agenda salva com sucesso!');
        },
        error: erro => {
          this.salvando = false;
          console.error(erro);
          alert('Erro ao salvar agenda.');
        }
      });
  }

  descartarAlteracoes(): void {
    this.carregarAgenda();
  }
}