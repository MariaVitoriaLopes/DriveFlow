import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddNovoVeiculo } from './form-add-novo-veiculo';

describe('FormAddNovoVeiculo', () => {
  let component: FormAddNovoVeiculo;
  let fixture: ComponentFixture<FormAddNovoVeiculo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddNovoVeiculo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormAddNovoVeiculo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
