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
    return new Promise((resolve,reject) => {
      this.fireAuth.auth.onAuthStateChanged((user) => {
        resolve(user);
      })
    })
  }

  enviarEmail()
  {
    let user = this.fireAuth.auth.currentUser;
    user.sendEmailVerification();
  }


  getEmailVerified()
  {
    let user = this.fireAuth.auth.currentUser;
    return user.emailVerified;
  }

  getUsuario(email : string)
  {
    let user : any;
    return new Promise((resolve, reject) => {this.db.collection("pacientes").doc(email).valueChanges().subscribe((dato) => {
        this.usuario = dato;

          if(this.usuario == undefined)
          {
            this.db.collection("profesionales").doc(email).valueChanges().subscribe((dato) => {
              this.usuario = dato;

              if(this.usuario == undefined)
              {
                this.db.collection("administradores").doc(email).valueChanges().subscribe((dato) => {
                  this.usuario = dato;
                  resolve(this.usuario);
                });
              }
              else
              {
                resolve(this.usuario);
              }
              
            });
          }
          else
          {
            resolve(this.usuario);
          }
      });
    })
  }
}
