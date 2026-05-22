import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderInstrutor } from '../../layout/header-instrutor/header-instrutor';

interface HorarioPeriodo {
  inicio: string;
  fim: string;
}

interface DiaDisponivel {
  nome: string;
  disponivel: boolean;
  horarios: {
    Manha: HorarioPeriodo;
    Tarde: HorarioPeriodo;
    Noite: HorarioPeriodo;
  };
}

@Component({
  selector: 'app-cadastro-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderInstrutor
  ],
  templateUrl: './cadastro-agenda.html',
  styleUrls: ['./cadastro-agenda.scss']
})
export class CadastroAgenda implements OnInit {

  agendaForm!: FormGroup;

  duracaoOptions = Array.from({ length: 6 }, (_, i) => (i + 1) * 10);
  toleranciaOptions = Array.from({ length: 6 }, (_, i) => (i + 1) * 5);

  dias: DiaDisponivel[] = [
    { nome: 'Segunda', disponivel: false, horarios: { Manha: { inicio:'08:00', fim:'12:00' }, Tarde: { inicio:'12:00', fim:'18:00' }, Noite: { inicio:'18:00', fim:'23:00' } } },
    { nome: 'Terca', disponivel: false, horarios: { Manha: { inicio:'08:00', fim:'12:00' }, Tarde: { inicio:'12:00', fim:'18:00' }, Noite: { inicio:'18:00', fim:'23:00' } } },
    { nome: 'Quarta', disponivel: false, horarios: { Manha: { inicio:'08:00', fim:'12:00' }, Tarde: { inicio:'12:00', fim:'18:00' }, Noite: { inicio:'18:00', fim:'23:00' } } },
    { nome: 'Quinta', disponivel: false, horarios: { Manha: { inicio:'08:00', fim:'12:00' }, Tarde: { inicio:'12:00', fim:'18:00' }, Noite: { inicio:'18:00', fim:'23:00' } } },
    { nome: 'Sexta', disponivel: false, horarios: { Manha: { inicio:'08:00', fim:'12:00' }, Tarde: { inicio:'12:00', fim:'18:00' }, Noite: { inicio:'18:00', fim:'23:00' } } },
    { nome: 'Sabado', disponivel: false, horarios: { Manha: { inicio:'08:00', fim:'12:00' }, Tarde: { inicio:'12:00', fim:'18:00' }, Noite: { inicio:'18:00', fim:'23:00' } } },
    { nome: 'Domingo', disponivel: false, horarios: { Manha: { inicio:'08:00', fim:'12:00' }, Tarde: { inicio:'12:00', fim:'18:00' }, Noite: { inicio:'18:00', fim:'23:00' } } },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.agendaForm = this.fb.group({
      duracaoAula: [60],
      valorAula: [1],
      intervaloAula: [15],
      toleranciaEspera: [15]
    });
  }

  toggleDisponivel(dia: DiaDisponivel) {
    dia.disponivel = !dia.disponivel;
  }

  // Função helper para acessar os horários de forma tipada
  getHorario(dia: DiaDisponivel, periodo: 'Manha' | 'Tarde' | 'Noite'): HorarioPeriodo {
    return dia.horarios[periodo];
  }

  salvarAgenda() {
    const payload = {
      ...this.agendaForm.value,
      dias: this.dias
    };

    this.http.post('http://localhost:8081/api/instrutores/agenda', payload)
      .subscribe({
        next: () => alert('Agenda salva com sucesso!'),
        error: () => alert('Erro ao salvar agenda')
      });
  }
}
