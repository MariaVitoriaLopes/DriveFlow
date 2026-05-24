import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAgenda } from './cadastro-agenda';

describe('CadastroAgenda', () => {
  let component: CadastroAgenda;
  let fixture: ComponentFixture<CadastroAgenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAgenda],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroAgenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
