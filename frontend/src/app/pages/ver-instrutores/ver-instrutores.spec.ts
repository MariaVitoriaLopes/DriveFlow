import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInstrutores } from './ver-instrutores';

describe('VerInstrutores', () => {
  let component: VerInstrutores;
  let fixture: ComponentFixture<VerInstrutores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerInstrutores],
    }).compileComponents();

    fixture = TestBed.createComponent(VerInstrutores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
