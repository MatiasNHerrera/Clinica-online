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

  getEspecialidades()
  {
    let especialidades = [];
    return new Promise((resolve, reject) => {
      this.db.collection("especialidades").get().subscribe((data)=> {
        data.docs.forEach(doc => {
          especialidades.push(doc.id);
        })

        resolve(especialidades);
      })
    })
  }

  getTodasEspecialidades()
  {
    return new Promise((resolve, reject) => {
      this.db.collection("especialidades").valueChanges().subscribe((datos)=> {
        resolve(datos);
      }, error=> reject(error));
    })
  }

  getProfesional(email : string)
  {
    return new Promise((resolve, reject) => {
      this.db.collection("profesionales").doc(email).valueChanges().subscribe((datos) => {
        resolve(datos);
      }, error => reject(error))
    })
  }

  getProfesionales()
  {
    return new Promise((resolve, reject) => {
      this.db.collection("profesionales").valueChanges().subscribe((datos) => {
        resolve(datos);
      }, error => reject(error));
    })
  }


  getDiaSemana(dia : string)
  {
    console.log(dia);
    return new Promise((resolve, reject) => {
      this.db.collection("semana").doc(dia).valueChanges().subscribe((datos)=> {
        console.log(datos);
        resolve(datos);
      }, error=> reject(error));
    })
  }

  getSemanaDoc()
  {
    let semana = [];
    return new Promise((resolve, reject) => {
      this.db.collection("semana").get().subscribe((data)=> {
        data.docs.forEach(doc => {
          semana.push(doc.id);
        })
        resolve(semana);
      })
    })
  }
  
  getSemanaTodos()
  {
    return new Promise((resolve, reject) => {
      this.db.collection("semana").valueChanges().subscribe((datos) => {
        resolve(datos);
      }, error => reject(error));
    })
  }

  getTurnosPacienteTodos()
  {
    return new Promise((resolve, reject) => {
      this.db.collection("turnos-paciente").valueChanges().subscribe((datos) => {
        resolve(datos);
      }, error => reject(error));
    })
  }

  getTurnosPaciente(email : string)
  {
    return new Promise((resolve, reject) => {
      this.db.collection("turnos-paciente").doc(email).valueChanges()
      .subscribe(datos => resolve(datos), error => reject(error));
    });
  }

  getTurnosProfesionalTodos()
  {
    return new Promise((resolve, reject) => {
      this.db.collection("turnos-profesionales").valueChanges().subscribe((datos) => {
        resolve(datos);
      }, error => reject(error));
    })
  }

  getTurnoProfesional(email: string)
  {
    return new Promise((resolve, reject) => {
      this.db.collection("turnos-profesionales").doc(email).valueChanges()
      .subscribe(datos => resolve(datos), error => reject(error));
    });
  }

  updateSemana(dia : string, data : any)
  {
    this.db.collection('semana').doc(dia).update(data);
  }

  updateEspecialidad(especialidad, data)
  {
    this.db.collection("especialidades").doc(especialidad).update(data);
  }

  updateUser(email : string, perfil : string, data : any)
  {
    this.db.collection(perfil).doc(email).update(data);
  }

  setTurno(profesional:string, paciente:string, data:any)
  {
    console.log(data);
    this.getTurnoProfesional(profesional).then((datos:any) => {
      
      datos.turnos.push(data);
      this.updateTurnos('turnos-profesionales', profesional,datos);
    })

    this.getTurnosPaciente(paciente).then((datos:any) => {
      datos.turnos.push(data);
      this.updateTurnos('turnos-paciente', paciente,datos);
    })
  }

  updateTurnos(collection, doc, data)
  {
    this.db.collection(collection).doc(doc).update(data);
  }
}
