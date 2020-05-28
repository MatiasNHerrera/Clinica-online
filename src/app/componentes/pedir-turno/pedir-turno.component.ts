import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-pedir-turno',
  templateUrl: './pedir-turno.component.html',
  styleUrls: ['./pedir-turno.component.css']
})
export class PedirTurnoComponent implements OnInit {

  profesionales = [];
  current;
  usuario;
  constructor(private auth : AngularFireAuth, private servicio : MiServicioService, private db : AngularFirestore) { }

  ngOnInit(): void {
    this.getProfesionales();
    this.servicio.getLogueado().then((user) => {
      this.current = user
      this.getUser(this.current.email);
    });
  }

  getUser(email : string)
  { 
    this.servicio.getUsuario(email).then((user) => {
      this.usuario = user;
    })
  }

  getProfesionales()
  {
    this.db.collection("profesionales").valueChanges().subscribe((datos)=>{
      let prof : any = datos
      for(let profesional of prof)
      {
        if(profesional.habilitado)
        {
          this.profesionales.push(profesional);
        } 
      }
    });
  }

}
