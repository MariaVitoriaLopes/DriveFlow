import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLocaisAtualizarVeiculos } from './form-locais-atualizar-veiculos';

describe('FormLocaisAtualizarVeiculos', () => {
  let component: FormLocaisAtualizarVeiculos;
  let fixture: ComponentFixture<FormLocaisAtualizarVeiculos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLocaisAtualizarVeiculos],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLocaisAtualizarVeiculos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
