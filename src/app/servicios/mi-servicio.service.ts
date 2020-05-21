import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MiServicioService {

  usuario : any;
  constructor(private fireAuth : AngularFireAuth, private db : AngularFirestore) 
  {}

  registrarNuevo(email : string, password : string)
  {
    return this.fireAuth.auth.createUserWithEmailAndPassword(email,password);
  }

  login(email : string, password : string)
  {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  getLogueado()
  {
    return this.fireAuth.auth.currentUser;
  }

  enviarEmail()
  {
    let user = this.fireAuth.auth.currentUser;
    user.sendEmailVerification();
  }

  retornarInfoUsuario(email : string) : any
  {
    let listado : any;

    this.db.collection("pacientes").valueChanges().subscribe((datos) => {

      listado = datos

      for(let paciente of listado)
      {
        if(paciente.email == email)
        {
          this.usuario = paciente;
          break;
        }
      }

      this.db.collection("profesionales").valueChanges().subscribe((datos) => {

        listado = datos

        for(let profesional of listado)
        {
          if(profesional.email == email)
          {
            this.usuario = profesional;
            break;
          }
        }

        this.db.collection("administradores").valueChanges().subscribe((datos) => {
          listado = datos

          for(let admin of listado)
          {
            if(admin.email == email)
            {
              this.usuario = admin;
              break;
            }
          }
        });
      });
    });

    setTimeout(() => {
      localStorage.setItem("usuarioLogueado", JSON.stringify(this.usuario));
    },3000);
  }


  getEmailVerified()
  {
    let user = this.fireAuth.auth.currentUser;
    return user.emailVerified;
  }
}
