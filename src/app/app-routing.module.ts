import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RegistroAdminComponent } from './componentes/registro-admin/registro-admin.component';
import { AuthGuardService } from './servicios/auth-guard.service';
import { HabilitarProfesionalComponent } from './componentes/habilitar-profesional/habilitar-profesional.component';
import { PedirTurnoComponent } from './componentes/pedir-turno/pedir-turno.component';
import { AtenderPacientesComponent } from './componentes/atender-pacientes/atender-pacientes.component';
import { AuthGuardProfesionalService } from './servicios/auth-guard-profesional.service';
import { GestionarProfesionalComponent } from './componentes/gestionar-profesional/gestionar-profesional.component';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';


const routes: Routes = [
  {path: "", redirectTo: "/login", pathMatch: "full"},
  {path: "registro", component: RegistroComponent, data: {animation: 'Usuario'}},
  {path: "login", component: LoginComponent, data: {animation: 'Login'}},
  {path: "principal", component: PrincipalComponent, data: {animation: 'Principal'}},
  {path: "registro/admin", component: RegistroAdminComponent},
  {path: "habilitar", component: HabilitarProfesionalComponent},
  {path: "pedir-turno", component: PedirTurnoComponent, canActivate: [AuthGuardService]},
  {path: "atender-pacientes", component: AtenderPacientesComponent, canActivate : [AuthGuardProfesionalService], data: {animation: 'Atender'}},
  {path: "gestionar-profesional", component: GestionarProfesionalComponent, data:{animation: 'Gestion'}},
  {path: "encuesta", component: EncuestaComponent},
  {path: "graficos", component: GraficosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
