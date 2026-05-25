import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInformacoesPessoais } from './form-informacoes-pessoais';

describe('FormInformacoesPessoais', () => {
  let component: FormInformacoesPessoais;
  let fixture: ComponentFixture<FormInformacoesPessoais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInformacoesPessoais],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInformacoesPessoais);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
