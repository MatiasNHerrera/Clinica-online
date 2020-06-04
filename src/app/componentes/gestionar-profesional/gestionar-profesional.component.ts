import { Component, OnInit } from '@angular/core';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { Time } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from 'jquery';

@Component({
  selector: 'app-gestionar-profesional',
  templateUrl: './gestionar-profesional.component.html',
  styleUrls: ['./gestionar-profesional.component.css']
})
export class GestionarProfesionalComponent implements OnInit {

  constructor(private servicio : MiServicioService, private db : AngularFirestore) { }

  semana : any;
  semanaDia: any;
  current : any;
  profesionales : any;
  profesional: any;
  desde : string = "";
  hasta : string = "";
  dia : string;
  duracion : number;
  turnosProfesional:any;
  turnoSeleccionado:any = false;;

  ngOnInit(): void {
    this.servicio.getLogueado().then((log) => {
      this.current = log;
      this.servicio.getProfesional(this.current.email).then((prof) => {
        this.profesional = prof;
        console.log(this.profesional);
      })

      this.servicio.getTurnoProfesional(this.current.email).then((datos) => {
        this.turnosProfesional = datos;
      })
    })

    this.servicio.getProfesionales().then((datos) => {
      this.profesionales = datos;
    })

    this.servicio.getSemanaDoc().then((datos) =>{
      this.semana = datos;// todos los dias de la semana
    })
  }

  agregarHorario()
  {
    var select: any = document.getElementById("select-dia-profesional");
    this.dia = select.options[select.selectedIndex].text;
    let data = {dia: this.dia, desde: this.desde, hasta: this.hasta, du_turnos: this.duracion};
    let fireData : any;


    if(this.profesional.horarios != undefined){

      if(!this.validarHorarioDia()){

        this.profesional.horarios.push(data);
        fireData = {horarios : this.profesional.horarios}
        this.servicio.updateUser(this.profesional.email, 'profesionales', fireData); //agrego horario a firebase
        this.agregarDiaSemana();
      }
      else{
        console.log("ya trabaja ese dia!");
      }

    }
    else{
      this.crearNuevoCampoHorario(data);
    }
  }

  validarHorarioDia() : boolean
  {
    let retorno = false;
    for(let horarios of this.profesional.horarios)
    {
      if(this.dia == horarios.dia || this.desde == this.hasta || (this.desde == "" || this.hasta == "") 
        || this.dia == undefined)
      {
        retorno = true;
        break;
      }
    }

    return retorno;
  }

  validarSabado()
  {
    var select: any = document.getElementById("select-dia-profesional");
    this.dia = select.options[select.selectedIndex].text;


    $("[name=time-desde]").val('');
    $("[name=time-hasta]").val('');

    if(this.dia == "Sabado")
    {
      $("[name=time-desde]").attr('max','14:00');
      $("[name=time-desde]").attr('min','08:00');
      $("[name=time-hasta]").attr('max','14:00');
      $("[name=time-hasta]").attr('min','08:00');
    }
    else
    {
      $("[name=time-desde]").attr('max','19:00');
      $("[name=time-desde]").attr('min','08:00');
      $("[name=time-hasta]").attr('max','19:00');
      $("[name=time-hasta]").attr('min','08:00');
    }
  }

  borrarHorario(h : any)
  {
    let i = this.profesional.horarios.indexOf(h)
    this.profesional.horarios.splice(i, 1);
    let data = {horarios : this.profesional.horarios}
    this.servicio.updateUser(this.profesional.email, 'profesionales', data); //borro el elemento de la lista
    this.borrarProfesionalSemana(h.dia); //borro al profesional en ese dia
  }

  borrarProfesionalSemana(dia : string)
  {
    let data: any;
    this.servicio.getDiaSemana(dia.toLowerCase()).then((datos)=>{ //borro de ese dia la semana el profesional correspondiente
      this.semanaDia = datos;
      let i = this.getIndex(this.semanaDia.profesionales);

      if(i > -1)
      {
        this.semanaDia.profesionales.splice(i, 1);
      }

      data = {profesionales : this.semanaDia.profesionales};
      console.log(data);
      this.servicio.updateSemana(dia.toLowerCase(), data);
    })
  }

  crearNuevoCampoHorario(data)
  {
    this.db.collection("profesionales").doc(this.profesional.email).update({
      horarios : [data]
    })
  }

  agregarDiaSemana()
  {
    let flag = false;

    for(let dia of this.semana)
    {
      if(this.dia.toLowerCase() == dia)// verifico si se encuentra o no el dia seleccionado
      {
        flag = true;
        break;
      }
    }

    if(!flag) //si es falso, agrego un nuevo dia en la bd
    {
      this.db.collection("semana").doc(this.dia.toLowerCase()).set({
        nombre: this.dia.toLowerCase(),
        profesionales : [this.profesional] 
      })
    }
    else //si es verdadero, hago un update en ese dia, junto con el profesional que se suma a ese dia
    {
      let data: any;
      this.servicio.getDiaSemana(this.dia.toLowerCase()).then((datos)=> {
        this.semanaDia = datos;
        this.semanaDia.profesionales.push(this.profesional);
        data = {profesionales : this.semanaDia.profesionales};
        console.log(data);
        this.servicio.updateSemana(this.dia.toLowerCase(), data);
      })
    }


  }

  getIndex(array : any) : number
  {
    let index : number;

    for(let prof of array){
       if(prof.email == this.profesional.email){
          index = array.indexOf(prof)
          break;
        }
    }

    return index;
  }

  modificarTurno(opcion:string){
    let motivo = "estoy de viaje";
    for(let item of this.turnosProfesional.turnos)
    {
      if(item.fecha == this.turnoSeleccionado.fecha && item.horario == this.turnoSeleccionado.horario && item.profesional == this.turnoSeleccionado.profesional)
      {
        if(opcion == 'acepto')
        {
          item.estado = 'aceptado';
          item.motivoCancelado = motivo
        }
        else
        {
          item.estado = 'cancelado';
        }

        this.servicio.updateTurnos("turnos-profesionales", this.turnoSeleccionado.profesional, this.turnosProfesional);
        this.servicio.updateTurnos("turnos-paciente", this.turnoSeleccionado.paciente, this.turnosProfesional);
        break;
      }
    }  
  }


  verificarEstado(turno: any)
  {
    if(turno.estado == 'cancelado')
    {
      $("#btn-g-t-aceptar").attr("disabled","true");
      $("#btn-g-t-rechazar").attr("disabled","true");
    }
    else
    {
      $("#btn-g-t-aceptar").removeAttr("disabled");
      $("#btn-g-t-rechazar").removeAttr("disabled");
    }
  }

}
