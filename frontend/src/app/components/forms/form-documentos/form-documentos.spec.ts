import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocumentos } from './form-documentos';

describe('FormDocumentos', () => {
  let component: FormDocumentos;
  let fixture: ComponentFixture<FormDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDocumentos],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDocumentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
