import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarProfesionalComponent } from './gestionar-profesional.component';

describe('GestionarProfesionalComponent', () => {
  let component: GestionarProfesionalComponent;
  let fixture: ComponentFixture<GestionarProfesionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarProfesionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
