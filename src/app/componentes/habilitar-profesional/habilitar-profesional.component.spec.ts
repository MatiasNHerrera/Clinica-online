import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitarProfesionalComponent } from './habilitar-profesional.component';

describe('HabilitarProfesionalComponent', () => {
  let component: HabilitarProfesionalComponent;
  let fixture: ComponentFixture<HabilitarProfesionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitarProfesionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitarProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
