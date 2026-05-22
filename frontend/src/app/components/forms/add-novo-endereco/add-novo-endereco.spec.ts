import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNovoEndereco } from './add-novo-endereco';

describe('AddNovoEndereco', () => {
  let component: AddNovoEndereco;
  let fixture: ComponentFixture<AddNovoEndereco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNovoEndereco],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNovoEndereco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
