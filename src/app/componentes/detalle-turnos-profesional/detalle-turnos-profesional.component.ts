import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-detalle-turnos-profesional',
  templateUrl: './detalle-turnos-profesional.component.html',
  styleUrls: ['./detalle-turnos-profesional.component.css']
})
export class DetalleTurnosProfesionalComponent implements OnInit {

  constructor() { }

  @Output() cerrarDetalle : EventEmitter<any> = new EventEmitter<any>();
  @Input() turno:any;

  ngOnInit(): void {
  }

  cerrar()
  {
    this.cerrarDetalle.emit(false);
  }

}
