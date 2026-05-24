import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';

@Component({
  selector: 'app-cadastro-agenda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderInstrutor
  ],
  templateUrl: './cadastro-agenda.html',
  styleUrls: ['./cadastro-agenda.scss']
})
export class CadastroAgenda implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  salvando = false;

  agendaForm!: FormGroup;

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

  ngOnInit(): void {

    this.agendaForm = this.fb.group({

      duracaoAula: [50, Validators.required],

      valorAula: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      intervaloAula: [10, Validators.required],

      toleranciaEspera: [5, Validators.required],

      disponibilidades: this.fb.array([])
    });

    this.carregarAgenda();
  }

  get disponibilidades(): FormArray {
    return this.agendaForm.get('disponibilidades') as FormArray;
  }

  criarDiaForm(dia: string): FormGroup {

    return this.fb.group({
      diaSemana: [dia],
      disponivel: [true],
      bloqueado: [false],

      horaInicio: [
        '08:00',
        Validators.required
      ],

      horaFim: [
        '18:00',
        Validators.required
      ]

    }, {
      validators: this.validarHorario
    });
  }

  validarHorario(control: AbstractControl): ValidationErrors | null {

    const inicio = control.get('horaInicio')?.value;
    const fim = control.get('horaFim')?.value;

    if (!inicio || !fim) return null;

    if (inicio < '06:00' || inicio > '22:00') {
      return { horarioInvalido: true };
    }

    if (fim > '23:00') {
      return { horarioInvalido: true };
    }

    if (inicio >= fim) {
      return { horarioInvalido: true };
    }

    return null;
  }

  toggleDia(dia: string): void {

    const index = this.disponibilidades.controls.findIndex(
      control => control.get('diaSemana')?.value === dia
    );

    if (index >= 0) {

      this.disponibilidades.removeAt(index);

    } else {

      this.disponibilidades.push(
        this.criarDiaForm(dia)
      );
    }
  }

  getDiaControl(dia: string): FormGroup {

    const control = this.disponibilidades.controls.find(
      c => c.get('diaSemana')?.value === dia
    );

    return control as FormGroup;
  }

  getNomeDia(valor: string): string {

    return this.diasSemana.find(
      d => d.valor === valor
    )?.nome || valor;
  }

  alternarBloqueio(index: number): void {

    const dia = this.disponibilidades.at(index);

    const bloqueado = dia.get('bloqueado')?.value;

    if (bloqueado) {

      dia.get('horaInicio')?.disable();

      dia.get('horaFim')?.disable();

    } else {

      dia.get('horaInicio')?.enable();

      dia.get('horaFim')?.enable();
    }
  }

  removerDia(index: number): void {
    this.disponibilidades.removeAt(index);
  }

  carregarAgenda(): void {

    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) return;

    this.http.get<any>(
      `http://localhost:8081/api/instrutores/agenda/${usuarioId}`
    ).subscribe({

      next: (agenda) => {

        if (!agenda) return;

        this.agendaForm.patchValue({

          duracaoAula: agenda.duracaoAula,
          valorAula: agenda.valorAula,
          intervaloAula: agenda.intervaloAula,
          toleranciaEspera: agenda.toleranciaEspera
        });

        this.disponibilidades.clear();

        if (agenda.disponibilidades?.length) {

          agenda.disponibilidades.forEach((dia: any) => {

            const form = this.criarDiaForm(dia.diaSemana);

            form.patchValue(dia);

            this.disponibilidades.push(form);

            if (dia.bloqueado) {

              form.get('horaInicio')?.disable();

              form.get('horaFim')?.disable();
            }
          });
        }
      },

      error: (erro) => {
        console.log('Agenda ainda não cadastrada', erro);
      }
    });
  }

  salvarAlteracoes(): void {

    if (this.agendaForm.invalid) {

      this.agendaForm.markAllAsTouched();

      return;
    }

    this.salvando = true;

    const usuarioId = localStorage.getItem('usuarioId');

    const payload = {

      duracaoAula: this.agendaForm.value.duracaoAula,

      valorAula: this.agendaForm.value.valorAula,

      intervaloAula: this.agendaForm.value.intervaloAula,

      toleranciaEspera: this.agendaForm.value.toleranciaEspera,

      disponibilidades: this.disponibilidades.getRawValue()
    };

    this.http.put(
      `http://localhost:8081/api/instrutores/agenda/${usuarioId}`,
      payload
    ).subscribe({

      next: () => {

        this.salvando = false;

        this.router.navigate(['/instrutor/agenda']);
      },

      error: (erro) => {

        this.salvando = false;

        console.error('Erro ao salvar agenda:', erro);

        alert('Erro ao salvar agenda.');
      }
    });
  }

  descartarAlteracoes(): void {

    this.router.navigate(['/instrutor/agenda']);
  }
}