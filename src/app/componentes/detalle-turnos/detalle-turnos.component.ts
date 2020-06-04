import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detalle-turnos',
  templateUrl: './detalle-turnos.component.html',
  styleUrls: ['./detalle-turnos.component.css']
})
export class DetalleTurnosComponent implements OnInit {

  constructor() { }

  @Input() turno : any
  @Output() vista : EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
  }

  cambiarVista(vista: string)
  { 
    this.vista.emit(vista);
  }

}
