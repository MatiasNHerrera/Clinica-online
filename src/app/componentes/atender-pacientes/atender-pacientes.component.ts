import { Component, OnInit } from '@angular/core';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';

@Component({
  selector: 'app-atender-pacientes',
  templateUrl: './atender-pacientes.component.html',
  styleUrls: ['./atender-pacientes.component.css']
})
export class AtenderPacientesComponent implements OnInit {

  edad:string;
  temperatura:number;
  peso:number;
  estatura:number;
  presion:number;
  turnos : any;
  dato:string;
  valor:any;
  datosAgregados = [];
  turnoSeleccionado
  current : any
  atender:boolean;
  id_actual:string;

  constructor(private service : MiServicioService) { }

  ngOnInit(): void {
    this.service.getLogueado().then((current: any) => {
      this.current = current;
      this.service.getTurnoProfesional(this.current.email).then((datos:any) => {
        this.turnos = datos;
        console.log(datos);
      })
    })
  
  }

  //modifico los turnos en la base de datos, tanto para el paciente como para el profesional
  finalizarTurno()
  {
    let i = this.turnos.turnos.indexOf(this.turnoSeleccionado);//busco el indice el turno con el que se esta trabajando
    this.agregarDatos();
    this.turnoSeleccionado.estado = "atendido";
    this.turnos.turnos[i] = this.turnoSeleccionado //modifico el turno y guardo el que tiene los datos nuevos
    this.service.updateTurnos("turnos-profesionales", this.current.email, this.turnos);
    this.service.updateTurnos("turnos-paciente", this.turnoSeleccionado.paciente, this.turnos);
    this.limpiarInputs();
    this.cerrarEncuesta();
    this.cambiarVista('cancelar')
  }

  //agrego los datos nuevos al array de datos general
  agregarNuevoDato()
  {
    this.datosAgregados.push({nombre: this.dato, valor : this.valor});
    (<HTMLInputElement>document.querySelector("[name='dato']")).value = null;
    (<HTMLInputElement>document.querySelector("[name='valor']")).value = null;
  }

  //agrego los datos por defecto al array de datos general
  agregarDatos()
  {

    this.datosAgregados.push({nombre: "temperatura", valor : this.temperatura})
    this.datosAgregados.push({nombre: "peso", valor : this.peso})
    this.datosAgregados.push({nombre: "estatura", valor : this.estatura})
    this.datosAgregados.push({nombre: "presion", valor : this.presion})
    this.datosAgregados.push({nombre: "edad", valor : this.edad})
    this.turnoSeleccionado.datos = this.datosAgregados;//creo una nueva variable en turnos que guarde el array de datos
  }

  //coloco los inputs para ingresar datos o los cierro, segun corresponda
  cambiarVista(opcion)
  {
    if(opcion == 'atender'){
      this.atender = true;
    }
    else{
      this.atender = false;
      this.datosAgregados = [];
      this.limpiarInputs();
    }
  }

  // agrego la clase al list item para dar efecto seleccionado
  seleccionar(turno :any)
  {
    this.turnoSeleccionado = turno;
    this.id_actual != undefined ? document.getElementById(this.id_actual).classList.remove("selected") : console.log("no hago nada");
    document.getElementById(`${turno.dia}${turno.fecha}${turno.horario}`).classList.add("selected");
    this.id_actual=`${turno.dia}${turno.fecha}${turno.horario}`;
    this.atender = false;
    this.limpiarInputs();
  }

  limpiarInputs()
  {
    (<HTMLInputElement>document.querySelector("#reset-atender")).click(); //limpio los inputs
  }

  //abro ventana modal de encuesta
  abrirEncuesta()
  {
    (<HTMLInputElement>document.querySelector(".encuesta-component")).removeAttribute("hidden");
  }

  //cierro ventana modal de encuesta
  cerrarEncuesta()
  {
    (<HTMLInputElement>document.querySelector(".encuesta-component")).setAttribute("hidden", "true");
  }

}
