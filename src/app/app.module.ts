import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RegistroAdminComponent } from './componentes/registro-admin/registro-admin.component';
import { HabilitarProfesionalComponent } from './componentes/habilitar-profesional/habilitar-profesional.component';
import { MiServicioService } from './servicios/mi-servicio.service';
import { AuthGuardService } from './servicios/auth-guard.service';
import { PedirTurnoComponent } from './componentes/pedir-turno/pedir-turno.component';
import { AtenderPacientesComponent } from './componentes/atender-pacientes/atender-pacientes.component';
import { GestionarProfesionalComponent } from './componentes/gestionar-profesional/gestionar-profesional.component';
import { HabilitadoPipePipe } from './pipes/habilitado-pipe.pipe';
import { DetalleTurnosComponent } from './componentes/detalle-turnos/detalle-turnos.component';
import { MotivoCancelacionComponent } from './componentes/motivo-cancelacion/motivo-cancelacion.component';
import { TurnosDelDiaPipe } from './pipes/turnos-del-dia.pipe';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';
import { DetalleTurnosProfesionalComponent } from './componentes/detalle-turnos-profesional/detalle-turnos-profesional.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    PrincipalComponent,
    RegistroAdminComponent,
    HabilitarProfesionalComponent,
    PedirTurnoComponent,
    AtenderPacientesComponent,
    GestionarProfesionalComponent,
    HabilitadoPipePipe,
    DetalleTurnosComponent,
    MotivoCancelacionComponent,
    TurnosDelDiaPipe,
    EncuestaComponent,
    DetalleTurnosProfesionalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDGvGWqMOZs7N_Wgux6v8ODNuUtxeFL0Tk",
      authDomain: "clinica-27d87.firebaseapp.com",
      databaseURL: "https://clinica-27d87.firebaseio.com",
      projectId: "clinica-27d87",
      storageBucket: "clinica-27d87.appspot.com",
      messagingSenderId: "418548508556",
      appId: "1:418548508556:web:5e675b3cc435f4243f98a9",
      measurementId: "G-3QYB7QHDQ5"
    }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule
  ],
  providers: [MiServicioService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
