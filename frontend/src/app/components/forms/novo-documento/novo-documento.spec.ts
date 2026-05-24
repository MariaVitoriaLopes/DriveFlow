import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoDocumento } from './novo-documento';

describe('NovoDocumento', () => {
  let component: NovoDocumento;
  let fixture: ComponentFixture<NovoDocumento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoDocumento],
    }).compileComponents();

    fixture = TestBed.createComponent(NovoDocumento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
