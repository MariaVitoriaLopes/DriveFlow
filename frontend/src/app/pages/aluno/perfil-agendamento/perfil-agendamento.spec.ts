import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAgendamento } from './perfil-agendamento';

describe('PerfilAgendamento', () => {
  let component: PerfilAgendamento;
  let fixture: ComponentFixture<PerfilAgendamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilAgendamento],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilAgendamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
