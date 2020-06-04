import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { storage } from 'firebase';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  current;
  queMostrar = "principal";
  usuario : any = "";
  fotoUno = true;
  fotoDos = false;
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
  }

  logout()
  {
    this.fireAuth.auth.signOut();
    this.navegador.navigate(["login"]);
  }

  getUser(email : string)
  {
    let user : any;
    this.db.collection("pacientes").doc(email).valueChanges().subscribe((dato) => {
      this.usuario = dato;

        if(this.usuario == undefined)
        {
          this.db.collection("profesionales").doc(email).valueChanges().subscribe((dato) => {
            this.usuario = dato;

            if(this.usuario == undefined)
            {
              this.db.collection("administradores").doc(email).valueChanges().subscribe((dato) => {
                this.usuario = dato;
              });
            }
            
          });
        }
    });
  }

  getFotosUser()
  {
    /**********************OBTENGO PRIMER FOTO CON VALIDACION******************/
    if(this.usuario.fotoUno != "")
    {
      storage().ref().child(this.usuario.fotoUno).getDownloadURL().then((url) => {
        this.usuario.fotoUno = url;
        console.log(url);
      })
    }
    else
    {
      this.usuario.fotoUno = "../../assets/imagenes/defectoUser.webp";
    }

    /**********************OBTENGO SEGUNDA FOTO CON VALIDACION******************/
    if(this.usuario.fotoDos != "")
    {
      storage().ref().child(this.usuario.fotoDos).getDownloadURL().then((url) => {
        this.usuario.fotoDos = url;
        console.log(url);
      })
    }
    else
    {
      this.usuario.fotoDos = "../../assets/imagenes/defectoUser.webp";
    }
  }

  cambiarImagen(foto : string)
  {
    switch(foto)
    {
      case 'dos':
        this.fotoDos = true;
        this.fotoUno = false;
        break;
      case 'uno':
      this.fotoDos = false;
      this.fotoUno = true;
    }
  }

}
