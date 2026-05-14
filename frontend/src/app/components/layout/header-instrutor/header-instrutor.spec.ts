import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInstrutor } from './header-instrutor';

describe('HeaderInstrutor', () => {
  let component: HeaderInstrutor;
  let fixture: ComponentFixture<HeaderInstrutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderInstrutor],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderInstrutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
