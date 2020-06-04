import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { storage } from 'firebase';

@Component({
  selector: 'app-habilitar-profesional',
  templateUrl: './habilitar-profesional.component.html',
  styleUrls: ['./habilitar-profesional.component.css']
})
export class HabilitarProfesionalComponent implements OnInit {

  @Output() cambioVista : EventEmitter<any> = new EventEmitter<any>();
  profesionales = [];
  especialidades : any;
  semana : any;

  constructor(private db: AngularFirestore, private servicio : MiServicioService) { }

  ngOnInit(): void {
    this.db.collection("profesionales").valueChanges().subscribe((datos)=>{
      this.profesionales = datos;
      this.getImagenes();
    });
  }

  getImagenes()
  {
    for(let profesional of this.profesionales)
    {
      storage().ref().child(profesional.fotoUno).getDownloadURL().then((dato) => {
        profesional.fotoUno = dato;
      })

      storage().ref().child(profesional.fotoDos).getDownloadURL().then((dato) => {
        profesional.fotoDos = dato;
      })
    }
  }

  habilitar(email : string, opcion : boolean)
  {
    this.db.collection("profesionales").doc(email).update({
        habilitado : opcion
    });
    this.agregarEnTurnos(email);
    this.habilitarEspecialidades(email, opcion);
    this.habilitarSemana(email, opcion)
  }

  cancelar()
  {
    this.cambioVista.emit("principal");
  }

  habilitarEspecialidades(email: string, opcion : boolean)
  {
    this.servicio.getTodasEspecialidades().then((datos) => {
      this.especialidades = datos;

      for(let especialidad of this.especialidades)
      {
        for(let profesional of especialidad.profesionales)
        {
          if(profesional.email == email)
          {
            profesional.habilitado = opcion;
            this.servicio.updateEspecialidad(especialidad.nombre, {profesionales : especialidad.profesionales})
            break;
          }
        }
      }
    })
  }

  habilitarSemana(email: string, opcion: boolean)
  {
    this.servicio.getSemanaTodos().then((datos) => {
      this.semana = datos;

      for(let dia of this.semana)
      {
        for(let profesional of dia.profesionales)
        {
          if(profesional.email == email)
          {
            profesional.habilitado = opcion;
            this.servicio.updateSemana(dia.nombre, {profesionales : dia.profesionales});
            break;
          }
        }
      }
    })
  }

  agregarEnTurnos(email : string)
  {
    this.servicio.getTurnoProfesional(email).then((datos) => {
      if(datos == undefined)
      {
        this.db.collection("turnos-profesionales").doc(email).set({
          turnos : []
        })
      }
    })
  }

}
