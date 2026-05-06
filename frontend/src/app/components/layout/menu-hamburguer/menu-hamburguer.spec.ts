import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHamburguer } from './menu-hamburguer';

describe('MenuHamburguer', () => {
  let component: MenuHamburguer;
  let fixture: ComponentFixture<MenuHamburguer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHamburguer],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuHamburguer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
