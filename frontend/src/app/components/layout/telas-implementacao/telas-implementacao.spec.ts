import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelasImplementacao } from './telas-implementacao';

describe('TelasImplementacao', () => {
  let component: TelasImplementacao;
  let fixture: ComponentFixture<TelasImplementacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelasImplementacao],
    }).compileComponents();

    fixture = TestBed.createComponent(TelasImplementacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
