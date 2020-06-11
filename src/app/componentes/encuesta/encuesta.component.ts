import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  constructor(private servicio: MiServicioService) { }

  @Output() finalizarTurno : EventEmitter<any> = new EventEmitter<any>();
  @Input() turnoSeleccionado:any
  cometario:string;
  checkbox = [];
  radio : string;
  datos:any = [];
  turnos:any = [];

  ngOnInit(): void {
    
  }

  cargarEncuesta()
  {
    this.getRadio();
    this.getCheckbox();
    this.getComentario();

    if(this.turnoSeleccionado.encuestaProfesional == undefined){
      this.turnoSeleccionado.encuestaProfesional = this.guardarDatos(); //guardo los datos de la encuesta en el array de la base de datos
      this.turnoSeleccionado.comentarioProfesional = this.cometario;
    }
    else{
      this.turnoSeleccionado.encuestaPaciente = this.guardarDatos(); //guardo los datos de la encuesta en el array de la base de datos
      this.turnoSeleccionado.comentarioPaciente = this.cometario;
    }

    this.turnos.turnos[this.getIndex()] = this.turnoSeleccionado //guardo los datos actualizados en el turno en el cual se esta trabajando
    this.servicio.updateTurnos("turnos-profesionales",this.turnoSeleccionado.profesional,this.turnos);
    this.servicio.updateTurnos("turnos-paciente",this.turnoSeleccionado.paciente,this.turnos);
    this.vaciarDatos();
    this.finalizarTurno.emit();
  }

  //recorro todos los radio y obtengo aquel que este seleccionado
  getRadio()
  {
    let aux_radio:any= document.querySelectorAll('input[type=radio]');

    for(let item of aux_radio)
    {
      if(item.checked)
      {
        this.radio = item.value;
        break;
      }
    }
  }

  //recorro todos los checkbox y obtengo aquellos que esten seleccionados
  getCheckbox()
  {
    let aux_check:any= document.querySelectorAll('input[type=checkbox]');

    for(let item of aux_check)
    {
      if(item.checked)
      {
        this.checkbox.push(item.value);
      }
    }
  }

  getComentario()
  { 
    this.cometario = (<HTMLInputElement>document.querySelector('#encuesta-textarea')).value;
  }

  //obtengo los datos cargados por el profesional
  guardarDatos() : any[]
  {
    this.datos.push({nombre : "satisfecho" , valor : this.radio})
    this.datos.push({nombre : "modalidad" , valor : this.checkbox})
    return this.datos;
  }

  //traigo el turno que estamos trabajando
  subirEncuesta()
  {
    this.servicio.getTurnoProfesional(this.turnoSeleccionado.profesional).then((turnos) => {
      this.turnos = turnos;
      this.cargarEncuesta();
    })
  }

  //obtengo el indice del profesional con el que se esta trabajando
  getIndex()
  {
    let index : number = 0;

    for(index; index < this.turnos.turnos.length; index++)
    {
      if(this.turnos.turnos[index].horario == this.turnoSeleccionado.horario && this.turnos.turnos[index].fecha == this.turnoSeleccionado.fecha)
      {
        break;
      }
    }

    return index;
  }

  //vacio los inputs y los array para borrar datos viejos
  vaciarDatos()
  {
    (<HTMLInputElement>document.querySelector('#encuesta-textarea')).value = null;
    this.checkbox = [];
  }

}
