import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MiServicioService } from './mi-servicio.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardProfesionalService {

  constructor(private service : MiServicioService, private auth : AngularFireAuth, private navegador : Router, private db : AngularFirestore) { }

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot)
  {
    return this.auth.authState
      .pipe(take(1))
      .pipe(map(authState => !!authState))
      .pipe(tap(auth => {
        if(!auth){
          this.navegador.navigate(['/error'])
        }
        else{
          let promise = this.db.collection('profesionales', ref=>{return ref.where('email', '==', this.auth.auth.currentUser.email)})
          let observable = promise.valueChanges();
          observable.subscribe((listado:any[])=>{
            if(!listado[0].habilitado){
              this.navegador.navigate(['login'])
            }
          })
        }
      }));
  }
}
