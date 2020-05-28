import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtenderPacientesComponent } from './atender-pacientes.component';

describe('AtenderPacientesComponent', () => {
  let component: AtenderPacientesComponent;
  let fixture: ComponentFixture<AtenderPacientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtenderPacientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtenderPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
