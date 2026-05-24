import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilInstrutor } from './perfil-instrutor';

describe('PerfilInstrutor', () => {
  let component: PerfilInstrutor;
  let fixture: ComponentFixture<PerfilInstrutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilInstrutor],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilInstrutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
