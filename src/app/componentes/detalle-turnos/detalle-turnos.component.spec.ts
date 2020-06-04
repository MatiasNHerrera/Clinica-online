import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTurnosComponent } from './detalle-turnos.component';

describe('DetalleTurnosComponent', () => {
  let component: DetalleTurnosComponent;
  let fixture: ComponentFixture<DetalleTurnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTurnosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
