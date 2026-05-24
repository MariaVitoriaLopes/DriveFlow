import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLocaisAtendimento } from './form-locais-atendimento';

describe('FormLocaisAtendimento', () => {
  let component: FormLocaisAtendimento;
  let fixture: ComponentFixture<FormLocaisAtendimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLocaisAtendimento],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLocaisAtendimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
