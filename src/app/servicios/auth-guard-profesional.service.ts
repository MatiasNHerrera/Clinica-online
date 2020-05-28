import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MiServicioService } from './mi-servicio.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardProfesionalService {

  constructor(private service : MiServicioService, private auth : AngularFireAuth, private navegador : Router) { }

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot)
  {
    return this.service.getUsuario(this.auth.auth.currentUser.email).then((user) => {
      let usuario : any = user;
      if(usuario.habilitado)
      {
        return usuario.habilitado;
      }
      else
      {
        this.navegador.navigate(["login"]);
        return usuario.habilitado
      }
    });
  }
}
