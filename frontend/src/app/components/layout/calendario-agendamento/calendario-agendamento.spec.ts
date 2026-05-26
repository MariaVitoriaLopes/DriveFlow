import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAgendamento } from './calendario-agendamento';

describe('CalendarioAgendamento', () => {
  let component: CalendarioAgendamento;
  let fixture: ComponentFixture<CalendarioAgendamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioAgendamento],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioAgendamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
