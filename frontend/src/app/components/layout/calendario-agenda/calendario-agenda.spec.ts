import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAgenda } from './calendario-agenda';

describe('CalendarioAgenda', () => {
  let component: CalendarioAgenda;
  let fixture: ComponentFixture<CalendarioAgenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioAgenda],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioAgenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
