import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  current;
  queMostrar = "principal";
  usuario : any = "";
  constructor(private navegador : Router, private db : AngularFirestore, private fireAuth : AngularFireAuth) { }

  ngOnInit(): void {
  
    this.fireAuth.auth.onAuthStateChanged((dato) => {
      this.current = dato;
      this.getUser(this.current.email);
    })
  }

  cambiarVista(mostrar : string)
  {
    this.queMostrar = mostrar;
    this.navegador.navigate(["login"]);
  }

  logout()
  {
    this.fireAuth.auth.signOut();
    this.navegador.navigate(["login"]);
  }

  getUser(email : string)
  {
    this.db.collection("pacientes").doc(email).valueChanges().subscribe((dato) => {
      this.usuario = dato;
      console.log(dato);
      console.log(this.usuario);
    });

    this.db.collection("profesionales").doc(email).valueChanges().subscribe((dato) => {
      this.usuario = dato;
      console.log(this.usuario);
    });

    this.db.collection("administradores").doc(email).valueChanges().subscribe((dato) => {
      this.usuario = dato;
      console.log(this.usuario);
    });

  }

}
