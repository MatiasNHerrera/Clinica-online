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

  mostrarUsuarios = false;
  listadoCompleto = [];
  current;
  usuario;
  email;
  pass;

  constructor(private servicio : MiServicioService, private navegador : Router, private auth : AngularFireAuth, private db : AngularFirestore)
  {

  }

  ngOnInit(): void {
    this.retornarTodos();
  }

  cancelar()
  {
    this.navegador.navigate(["principal"]);
  }

  loguear()
  {
    this.email = $("#correo").val()
    this.pass = $("#clave").val()

      if(this.validarCorreo())
      {
        if(this.validarClave())
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
      }
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
    document.getElementById("cntLogin").style.filter = "blur(5px)"
    document.getElementById("ui").style.filter = "blur(5px)";
    document.getElementById("loadingLogin").hidden = false;
  }

  validarCorreo() : boolean
  {
    let retorno = false;
    let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if(regex.test(this.email))
    {
      retorno = true;
    }
    else if(this.email == "")
    {
      this.textoMostrar("Correo Requerido");
    }
    else
    {
      this.textoMostrar("El campo debe ser de tipo correo");
    }

    return retorno;
  }

  validarClave() : boolean
  {
    let retorno = false

    if(this.pass == "")
    {
      this.textoMostrar("Contraseña Requerida")
    }
    else if(this.pass.length < 6)
    {
      this.textoMostrar("La clave debe ser mayor a 6 digitos");
    }
    else
    {
      retorno = true;
    }
    return retorno;
  }

  retornarTodos() : any
  {
    this.listadoCompleto = [];
    let listado : any;

    this.db.collection("pacientes").valueChanges().subscribe((datos) => {

      listado = datos

      for(let paciente of listado)
      {
        this.listadoCompleto.push(paciente);
      }

      this.db.collection("profesionales").valueChanges().subscribe((datos) => {

        listado = datos

        for(let profesional of listado)
        {
          this.listadoCompleto.push(profesional);
        }

        this.db.collection("administradores").valueChanges().subscribe((datos) => {
          listado = datos

          for(let admin of listado)
          {
            this.listadoCompleto.push(admin);
          }
          
        });
      });
    });
  }

  quitarBoton()
  {
    let btnUsuario = document.getElementById("btnUsuarios");
    btnUsuario.style.animation = "moveBottom";
    btnUsuario.style.animationDuration = "1.5s";
    
    setTimeout(() => {
      this.mostrarUsuarios = true;
      $("#ui").css("display", "flex");
    },1500)
  
  }

  completar(email : string)
  {
    for(let usuario of this.listadoCompleto)
    {
      if(email == usuario.email)
      {
        $("#correo").val(usuario.email);
        $("#clave").val(usuario.contraseña);
        break;
      }
    }
  }
}
