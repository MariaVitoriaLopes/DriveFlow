import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaAluno } from './agenda-aluno';

describe('AgendaAluno', () => {
  let component: AgendaAluno;
  let fixture: ComponentFixture<AgendaAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaAluno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
