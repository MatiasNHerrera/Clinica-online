import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private navegador : Router, private auth : AngularFireAuth) { }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean
  {
    let current = this.auth.auth.currentUser;
    
    if(current != null)
      return true;
    else
      this.navegador.navigate(["login"]);
      return false
  }
}

interface CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
}
