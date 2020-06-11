import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from 'jquery';

@Component({
  selector: 'app-pedir-turno',
  templateUrl: './pedir-turno.component.html',
  styleUrls: ['./pedir-turno.component.css']
})
export class PedirTurnoComponent implements OnInit {

  dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  listadoMostrar : string ="listado-apellido";
  especialidades:any;
  profesionales:any;
  semana:any;
  current:any;
  profesionalSeleccionado:any;
  diaSeleccionado:string;
  fechaSeleccionada: any;
  turnosProfesional: any;
  horaSeleccionada:any;
  duracion_turno:number;
  turnosPaciente:any;
  especialidadSeleccionada:string;
  vista = "turnos";
  turnoDetalle: any;
  turnoSeleccionado:any;
  motivo:boolean;

  constructor(private auth : AngularFireAuth, private servicio : MiServicioService, private db : AngularFirestore) { }

  ngOnInit(): void {
    this.servicio.getProfesionales().then((datos)=> { //traigo todos los profesionales
      this.profesionales = datos;
    });

    this.servicio.getLogueado().then((user) => { //traigo el usuario logueado
      this.current = user

      this.servicio.getTurnosPaciente(this.current.email).then((datos) => {
        this.turnosPaciente = datos;
        console.log(this.turnosPaciente);
      })

    });

    this.servicio.getTodasEspecialidades().then((datos) => { //traigo todas las especialidades
      this.especialidades = datos;
    })

    this.servicio.getSemanaTodos().then((datos) => { //traigo todos los profesionales
      this.semana = datos;
    })
  }


  filtrarApellido()
  {
    this.listadoMostrar = "listado-apellido"
  }
  filtrarEspecialidades()
  {
    this.listadoMostrar = "listado-especialidades"
  }

  filtrarSemana()
  {
    this.listadoMostrar = "listado-semana"
  }

  setHorariosProfesional(profesional : any)
  {
    this.profesionalSeleccionadoActualizado(profesional.email).then((profesional)=> {
      this.profesionalSeleccionado = profesional;
    })

    $("#h-p-reset").trigger('click');
  }

  //en cada (change) del select se setean el horario maximo y minimo, al igual que la fecha
  cambiarHorarios()
  {
    var select: any = document.getElementById("h-p-select");
    this.diaSeleccionado = select.options[select.selectedIndex].text;

    for(let horario of this.profesionalSeleccionado.horarios)
    {
      if(horario.dia == this.diaSeleccionado)
      {
        $("#h-p-time").attr("min", `${horario.desde}`);
        $("#h-p-time").attr("max", `${horario.hasta}`);
        $("#h-p-date").attr("min", `${this.getDate('min')}`)
        $("#h-p-date").attr("max", `${this.getDate('max')}`)
        this.duracion_turno = horario.du_turnos;
        break;
      }
    }

  }

  setEspecialidad()
  {
    var select: any = document.getElementById("h-p-select-especialidad");
    this.especialidadSeleccionada = select.options[select.selectedIndex].text;
  }

  //traigo el profesional con los datos actualizados
  profesionalSeleccionadoActualizado(email)
  {
    return new Promise((resolve, reject) => {
      this.servicio.getProfesional(email).then((profesional) => {
        resolve(profesional);
      }, error => reject(error));
    })
  }

  crearTurno()
  {
    
  }

  //validacion de las fechas minimas y maximas
  getDate(option : string)
  {
    let fecha = new Date()
    let aux = option=='min'? 1 : 3
    let d :string,m :string,y:string;

    d = fecha.getDate().toString();
    m = (fecha.getMonth()+ aux).toString();
    y = fecha.getFullYear().toString();


    d = d.length == 1 ? '0'+d : d;
    m = m.length == 1 ? '0'+m : m;

    return `${y}-${m}-${d}`
  }

  //validacion de la fecha seleccionada corresponda al dia seleccionado en el select
  valdiarDiaSemana(){

    let date = new Date($("#h-p-date").val());      
    let diaCalendario = this.dias[date.getDay()];

    if(diaCalendario != this.diaSeleccionado){
      console.error('Dia distinto');
      $("#h-p-submit").attr("disabled", "true");
    }
    else
    {
      $("#h-p-submit").removeAttr("disabled");
    }
  }

  //validacion de la existencia de turnos antes o despues del turno que se desea cargar
  validarTurnosDisponibles()
  {
    let flag = false;

    this.servicio.getTurnoProfesional(this.profesionalSeleccionado.email).then((datos:any) =>{
      this.turnosProfesional = datos;
      console.log(this.turnosProfesional);
      
        for(let item of this.turnosProfesional.turnos)
        {
          if(this.fechaSeleccionada == item.fecha && this.horaSeleccionada > this.sumarHorasMin(item.horario, this.duracion_turno) && 
            this.horaSeleccionada < this.sumarHorasMax(item.horario, this.duracion_turno) && (item.estado != 'cancelado' || item.estado != 'atendido'))
          {
            flag = true;
            break;
          }
        }
    

      if(!flag){
        this.servicio.setTurno(this.profesionalSeleccionado.email,this.current.email, this.toJSON(this.duracion_turno))
      }
      else{
        console.log("como el orto funciona tu programa mogolico");
      }

    })
  }

  //calculo para validar si el horario deseado no se encuentra entre un turno ya existente(maximo)
  sumarHorasMax(horario, duracion)
  {
    let minutosStr:string;
    let horasStr:string;
    let horas = Number.parseInt(horario.split(":")[0]);
    let minutos = Number.parseInt(horario.split(":")[1]);
    let retorno:string;

    minutos += duracion;
    console.log(minutos);

    if(minutos >= 60){
      horas++
      minutos-= 60
      minutosStr = minutos < 10 ? "0"+minutos.toString() : minutos.toString()
      horasStr = horas < 10 ? "0"+horas.toString() : horas.toString()

      retorno = horasStr + ':' + minutosStr
    }
    else{
      minutosStr = minutos < 10 ? "0"+minutos.toString() : minutos.toString()
      horasStr = horas < 10 ? "0"+horas.toString() : horas.toString()
      retorno = horasStr + ":" + minutosStr;
    }
    console.log(retorno);
    return retorno
  }
  
  //calculo para validar si el horario deseado no se encuentra entre un turno ya existente(minimo)
  sumarHorasMin(horario, duracion)
  {
    let minutosStr
    let horasStr
    let horas = Number.parseInt(horario.split(":")[0])
    let minutos = Number.parseInt(horario.split(":")[1])
    minutos -= duracion;
    let retorno:string

    if(minutos < 0){
      horas--
      minutos+= 60
      minutosStr = minutos < 10 ? "0"+minutos.toString() : minutos.toString()
      horasStr = horas < 10 ? "0"+horas.toString() : horas.toString()
      retorno = horasStr + ':' + minutosStr
    }
    else{
      minutosStr = minutos < 10 ? "0"+minutos.toString() : minutos.toString()
      horasStr = horas < 10 ? "0"+horas.toString() : horas.toString()
      retorno = horasStr + ":" + minutosStr;
    }

    console.log(retorno);
    return retorno
  } 

  //creo un json con todos los datos del turno
  toJSON(duracion : number)
  {
    return {
      dia: this.diaSeleccionado,
      duracion: duracion,
      estado: "pendiente",
      fecha: this.fechaSeleccionada,
      horario: this.horaSeleccionada,
      paciente: this.current.email,
      profesional: this.profesionalSeleccionado.email,
      especialidad : this.especialidadSeleccionada
    }
  }

  setTurnoSeleccionado(turno : any)
  {
    this.turnoSeleccionado = turno;
    this.motivo = true;
  }

  cancelarTurno(eleccion:any)
  {
    console.log(eleccion);
    console.log(this.turnoSeleccionado);

    if(eleccion.opcion != null)
    {
      for(let item of this.turnosPaciente.turnos)
      {
        if(item.fecha == this.turnoSeleccionado.fecha && item.horario == this.turnoSeleccionado.horario && item.profesional == this.turnoSeleccionado.profesional)
        {
          item.estado = 'cancelado';
          item.motivoCanceladoPaciente = eleccion.motivo
          this.servicio.updateTurnos("turnos-profesionales", item.profesional, this.turnosPaciente);
          this.servicio.updateTurnos("turnos-paciente", item.paciente, this.turnosPaciente);
          break;
        }
      }
    }

    this.motivo = false;
  }

  cambiarVista(opcion:string, turno:any)
  {
    this.vista = opcion

    if(opcion == 'detalle'){
      this.turnoDetalle = turno;
    }
  }

}
