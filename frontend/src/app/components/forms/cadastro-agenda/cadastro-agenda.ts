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
      bloqueado: [false],
      horaInicio: ['08:00', Validators.required],
      horaFim: ['18:00', Validators.required]
    }, {
      validators: this.validarHorario
    });
  }

  validarHorario(control: AbstractControl): ValidationErrors | null {
    const bloqueado = control.get('bloqueado')?.value;
    const inicio = control.get('horaInicio')?.value;
    const fim = control.get('horaFim')?.value;

    if (bloqueado) return null;

    if (!inicio || !fim) return { horarioInvalido: true };

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

  diaSelecionado(dia: string): boolean {
    return this.disponibilidades.controls.some(
      control => control.get('diaSemana')?.value === dia
    );
  }

  toggleDia(dia: string): void {
    const index = this.disponibilidades.controls.findIndex(
      control => control.get('diaSemana')?.value === dia
    );

    if (index >= 0) {
      this.disponibilidades.removeAt(index);
      return;
    }

    this.disponibilidades.push(this.criarDiaForm(dia));
  }

  getNomeDia(valor: string): string {
    return this.diasSemana.find(d => d.valor === valor)?.nome || valor;
  }

  alternarBloqueio(index: number): void {
    const dia = this.disponibilidades.at(index) as FormGroup;
    const bloqueado = dia.get('bloqueado')?.value;

    if (bloqueado) {
      dia.get('horaInicio')?.disable();
      dia.get('horaFim')?.disable();
    } else {
      dia.get('horaInicio')?.enable();
      dia.get('horaFim')?.enable();
    }

    dia.updateValueAndValidity();
  }

  removerDia(index: number): void {
    this.disponibilidades.removeAt(index);
  }

carregarAgenda(): void {
  const usuarioId = localStorage.getItem('usuarioId') || localStorage.getItem('userId');
  if (!usuarioId) return;

  this.http.get<any>(`http://localhost:8081/api/agenda-config/usuario/${usuarioId}`)
    .subscribe({
      next: (agenda) => {
        if (!agenda) return;
        this.agendaForm.patchValue({
          duracaoAula: agenda.duracaoAula ?? 50,
          valorAula: agenda.valorAula ?? 1,
          intervaloAula: agenda.intervaloAula ?? 10,
          toleranciaEspera: agenda.toleranciaEspera ?? 5
        });

        this.disponibilidades.clear();
        agenda.disponibilidades?.forEach((dia: any) => {
          const form = this.criarDiaForm(dia.diaSemana);
          form.patchValue({
            diaSemana: dia.diaSemana,
            bloqueado: dia.bloqueado ?? false,
            horaInicio: dia.horaInicio ?? '08:00',
            horaFim: dia.horaFim ?? '18:00'
          });
          this.disponibilidades.push(form);
          if (dia.bloqueado) {
            form.get('horaInicio')?.disable();
            form.get('horaFim')?.disable();
          }
        });
      },
      error: (erro) => console.log('Agenda ainda não cadastrada ou não encontrada.', erro)
    });
}

salvarAlteracoes(): void {
  if (this.agendaForm.invalid) {
    this.agendaForm.markAllAsTouched();
    return;
  }

  this.salvando = true;
  const usuarioId = localStorage.getItem('usuarioId') || localStorage.getItem('userId');
  if (!usuarioId) {
    this.salvando = false;
    alert('Usuário não encontrado. Faça login novamente.');
    return;
  }

  const payload = {
    usuarioId,
    duracaoAula: Number(this.agendaForm.value.duracaoAula),
    valorAula: Number(this.agendaForm.value.valorAula),
    intervaloAula: Number(this.agendaForm.value.intervaloAula),
    toleranciaEspera: Number(this.agendaForm.value.toleranciaEspera),
    disponibilidades: this.disponibilidades.getRawValue()
  };

  this.http.post(`http://localhost:8081/api/agenda-config/salvar`, payload)
    .subscribe({
      next: () => {
        this.salvando = false;
        alert('Agenda salva com sucesso!');
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