import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from 'jquery';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.css']
})
export class RegistroAdminComponent implements OnInit {

  @Output() cambioVista : EventEmitter<any> = new EventEmitter<any>();
  email;
  pass;
  claveRepetida;

  constructor(private service : MiServicioService, private db : AngularFirestore) { }

  ngOnInit(): void {
  }

  registroMasValidacion()
  {
    if(this.validarCorreo())
    {
      if(this.validarClave())
      {
        this.registrar();
      }
    }
  }

  cancelar()
  {
    this.cambioVista.emit("principal");
  }

  registrar()
  {
    this.service.registrarNuevo(this.email, this.pass).then(() => {

      this.db.collection("administradores").doc(this.email).set({
        email : this.email,
        contraseña : this.pass,
        perfil: "admin"
      })
      
      this.service.enviarEmail();

    }).catch(() => {
      this.textoMostrar("Este email ya se encuentra registrado");
    });
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

    if(this.pass.length >= 6 && this.pass == this.claveRepetida)
    {
        retorno = true;
    }
    else if(this.pass == "")
    {
      this.textoMostrar("Contraseña Requerida")
    }
    else if(this.pass.length < 6)
    {
      this.textoMostrar("La clave debe ser mayor a 6 digitos");

    }
    else
    {
      this.textoMostrar("Las claves no coinciden, revise");

    }

    return retorno;
  }

  fadeIn()
  {
    $("#mensajeRegistroAdmin").fadeIn();
    setTimeout( () => {
      $("#mensajeRegistroAdmin").fadeOut();
    },2000);
  }

  textoMostrar(mensaje : string)
  {
    $("#mensajeRegistroAdmin").text(mensaje);
    this.fadeIn();
  }

}
