import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderInstrutor } from '../../../components/layout/header-instrutor/header-instrutor';
import { CalendarComponent } from '../../../components/layout/calendario/calendario';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface WeekStat {
  weekDay: string;
  date: string;
  total: number;
}

interface Lesson {
  time: string;
  student: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderInstrutor,
    CalendarComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {

  selectedDate = new Date();

  weekStats: WeekStat[] = [];

  todayLessons: Lesson[] = [
    {
      time: '08:00',
      student: 'Ana'
    },
    {
      time: '09:00',
      student: 'Amanda'
    },
    {
      time: '12:00',
      student: 'Guilherme'
    },
    {
      time: '14:00',
      student: 'Renato'
    }
  ];

  constructor() {

    this.generateWeekStats();

  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    console.log('Data selecionada:', date);
  }

  private generateWeekStats(): void {

    const diasSemana = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ];

    this.weekStats = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      this.weekStats.push({
        weekDay: diasSemana[date.getDay()],
        date: date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        }),

        total: Math.floor(Math.random() * 12) + 1
      });
    }
  }
}