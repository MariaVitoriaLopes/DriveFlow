import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCadastro } from './form-cadastro';

describe('FormCadastro', () => {
  let component: FormCadastro;
  let fixture: ComponentFixture<FormCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
