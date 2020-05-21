import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor() { }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean
  {
    let retorno = false;
    let usuario = localStorage.getItem("usuarioLogueado");
    
    if(usuario != "")
      retorno = true;

    return retorno; 
  }
}

interface CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
}
