import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTurnosProfesionalComponent } from './detalle-turnos-profesional.component';

describe('DetalleTurnosProfesionalComponent', () => {
  let component: DetalleTurnosProfesionalComponent;
  let fixture: ComponentFixture<DetalleTurnosProfesionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTurnosProfesionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTurnosProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
