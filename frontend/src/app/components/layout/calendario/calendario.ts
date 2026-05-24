import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  day: number | null;
  date?: Date;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss'
})

export class CalendarComponent implements OnInit {

  @Input() selectedDate: Date = new Date();

  @Output() dateSelected = new EventEmitter<Date>();

  diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  currentDate = new Date();
  currentMonth!: number;
  currentYear!: number;
  monthName = '';

  calendarDays: CalendarDay[] = [];

  ngOnInit(): void {
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.generateCalendar();

  }

  generateCalendar(): void {

    this.calendarDays = [];

    const firstDay = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).getDay();

    const totalDays = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();

    this.monthName = new Date(
      this.currentYear,
      this.currentMonth
    ).toLocaleDateString('pt-BR', {
      month: 'long'
    });

    for (let i = 0; i < firstDay; i++) {

      this.calendarDays.push({
        day: null
      });

    }

    for (let day = 1; day <= totalDays; day++) {

      const date = new Date(
        this.currentYear,
        this.currentMonth,
        day
      );

      this.calendarDays.push({ day,date });
    }
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } 
    else {
      this.currentMonth--;
    }

    this.generateCalendar();

  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } 
    else {
      this.currentMonth++;

    }

    this.generateCalendar();
  }

  selectDay(day: CalendarDay): void {
    if (!day.date) return;
    this.selectedDate = day.date;
    this.dateSelected.emit(day.date);
  }

  isSelected(day: CalendarDay): boolean {
    if (!day.date) return false;

    return (
      day.date.getDate() === this.selectedDate.getDate() && day.date.getMonth() === this.selectedDate.getMonth() && day.date.getFullYear() === this.selectedDate.getFullYear()
    );
  }
}