import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAluno } from './header-aluno';

describe('HeaderAluno', () => {
  let component: HeaderAluno;
  let fixture: ComponentFixture<HeaderAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderAluno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
