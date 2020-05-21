import { Component, OnInit } from '@angular/core';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  current;
  usuario;
  email;
  pass;
  constructor(private servicio : MiServicioService, private navegador : Router, private auth : AngularFireAuth, private db : AngularFirestore)
  {

  }

  ngOnInit(): void {
  }

  cancelar()
  {
    this.navegador.navigate(["principal"]);
  }

  loguear()
  {

    this.servicio.login(this.email, this.pass).then(() => {

      if(this.servicio.getEmailVerified())
      {
        this.loading()
        setTimeout(() => {
          this.navegador.navigate(["principal"]);
        },3000);
      }
      else
        this.textoMostrar("Debes verificar el email");

    }).catch(() => {
      this.textoMostrar("Este usuario no se encuentra registrado");
    });

  }

  fadeIn()
  {
    $("#mensajeLogin").fadeIn();
    setTimeout( () => {
      $("#mensajeLogin").fadeOut();
    },2000);
  }

  textoMostrar(mensaje : string)
  {
    $("#mensajeLogin").text(mensaje);
    this.fadeIn();
  }

  loading()
  {
    let cnt = document.getElementById("cntLogin").style.filter = "blur(5px)"
    document.getElementById("loadingLogin").hidden = false;
  }
}
