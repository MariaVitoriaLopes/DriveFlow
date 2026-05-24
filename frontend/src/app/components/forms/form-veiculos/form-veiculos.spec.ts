import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVeiculos } from './form-veiculos';

describe('FormVeiculos', () => {
  let component: FormVeiculos;
  let fixture: ComponentFixture<FormVeiculos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormVeiculos],
    }).compileComponents();

    fixture = TestBed.createComponent(FormVeiculos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
