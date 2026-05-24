import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSistema } from './config-sistema';

describe('ConfigSistema', () => {
  let component: ConfigSistema;
  let fixture: ComponentFixture<ConfigSistema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigSistema],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigSistema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
