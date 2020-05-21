import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from 'jquery';
import { storage } from 'firebase';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  listadoImagenes;
  pacientes = [];
  profesionales = []
  claveRepetida;
  email;
  pass;
  especialidades;
  user;
  fotoUno = "";
  fotoDos = "";
  constructor(private db : AngularFirestore, private service : MiServicioService) { }

  ngOnInit(): void {
    this.db.collection('pacientes').valueChanges().subscribe((pacientes)=>{
        this.pacientes = pacientes;
    })

    this.db.collection('profesionales').valueChanges().subscribe((profesionales)=>{
      this.profesionales = profesionales;
  })   
  }

  nuevo(opcion : string)
  {
    this.user = opcion;
  }

  cancelar()
  {
    localStorage.setItem("usuarioLogueado", "");
    this.user = null;
    this.fotoDos = "";
    this.fotoUno = "";
  }

  registrar()
  {
    if(this.validarCorreo())
    {
      if(this.validarClave())
      {
        if(this.user == 'paciente'){
          this.registrarPaciente();
        }
        else{
          this.registrarProfesional();
        }
      }
    }
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
    $("#mensajeRegistro").fadeIn();
    setTimeout( () => {
      $("#mensajeRegistro").fadeOut();
    },2000);
  }

  textoMostrar(mensaje : string)
  {
    $("#mensajeRegistro").text(mensaje);
    this.fadeIn();
  }

  registrarPaciente()
  {
    this.service.registrarNuevo(this.email, this.pass).then(() => {
    
      this.db.collection("pacientes").doc(this.email).set({
        email : this.email,
        contraseña : this.pass,
        fotoUno: this.fotoUno,
        fotoDos: this.fotoDos,
        perfil: this.user
      });

      this.service.enviarEmail();

    }).catch(() => {
      this.textoMostrar("Este email ya se encuentra registrado");
    })
  }

  registrarProfesional()
  {
    this.service.registrarNuevo(this.email, this.pass).then(() => {

        this.db.collection("profesionales").doc(this.email).set({
          email : this.email,
          contraseña : this.pass,
          fotoUno: this.fotoUno,
          fotoDos: this.fotoDos,
          especialidades : this.especialidades,
          habilitado : false,
          perfil: this.user
        })
        
        this.service.enviarEmail();

      }).catch(() => {
        this.textoMostrar("Este email ya se encuentra registrado");
      });
  }

  upload(e, imgNum : number)
  {

    if(this.fotoUno == "")
    {
      this.fotoUno = `${this.user}/${this.getFecha()}_${1}`
      this.fotoDos = `${this.user}/${this.getFecha()}_${2}`
    }

    if(imgNum == 1){
      let file = e.target.files[0];
      let ref = storage().ref(this.fotoUno)
      const metaData = {'contentType' : file.type}
      ref.put(file, metaData);
    }
    else{
      let file = e.target.files[0];
      let ref = storage().ref(this.fotoDos);
      const metaData = {'contentType' : file.type};
      ref.put(file, metaData);
    }
  }

  getFecha() : string
  {
    var fecha = new Date();
    let d,m,y,h,min,s;
    d = fecha.getDate();
    m = fecha.getUTCMonth();
    y = fecha.getFullYear();
    h = fecha.getHours().toString();
    min = fecha.getMinutes().toString();
    s = fecha.getSeconds().toString();

    return y + "-" + m + "-" + d + "_" + h + "-" + min + "-" + s;
  }

}
