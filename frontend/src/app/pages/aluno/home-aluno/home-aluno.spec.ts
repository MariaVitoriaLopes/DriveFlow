import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAluno } from './home-aluno';

describe('HomeAluno', () => {
  let component: HomeAluno;
  let fixture: ComponentFixture<HomeAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeAluno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
