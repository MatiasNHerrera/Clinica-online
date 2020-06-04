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

  captcha: string;
  listadoImagenes;
  pacientes = [];
  profesionales = []
  nombre = "";
  apellido = "";
  claveRepetida;
  email;
  pass;
  especialidades : any = [];
  especialidadesDB: any = [];
  nuevaEspecialidad : string;
  especialidad : string = "";
  user;
  fotoUno = "";
  fotoDos = "";

  constructor(private db : AngularFirestore, private service : MiServicioService) 
  {
    this.service.getEspecialidades().then((datos) => {
      this.especialidades = datos;
    });
  }

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
    if(this.validarNombreApellido() && this.validarCorreo() && this.validarClave() && this.verificarCaptcha())
    {
      if(this.user == 'paciente'){
        this.registrarPaciente();
      }
      else{
        this.registrarProfesional();
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

  validarNombreApellido() : boolean
  {
    let retorno = false;

    if(this.nombre != "" && this.apellido != "")
    {
      retorno = true;
    }
    else
    {
      this.textoMostrar("Campos nombre y apellido son requeridos");
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
    
      this.db.collection("pacientes").doc(this.email).set(this.pacienteToJson());
      this.agregarEnTurnos(this.email);
      this.service.enviarEmail();

    }).catch(() => {
      this.textoMostrar("Este email ya se encuentra registrado");
    })
  }

  registrarProfesional()
  {
    this.service.registrarNuevo(this.email, this.pass).then(() => {
      
        this.agregarEspecialidadBD();
        this.db.collection("profesionales").doc(this.email).set(this.profesionalToJson())
        
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

  agregarEspecialidad()
  {
    let flag = false;

    for(let especilidad of this.especialidades)
    {
      if(this.nuevaEspecialidad.toUpperCase() == especilidad)
      {
        flag = true;
        break;
      }
    }

    if(!flag)
    {
      this.especialidades.push(this.nuevaEspecialidad.toUpperCase());
      $("[name=nueva-especialidad]").val("");
    }

  }

  agregarEspecialidadBD()
  {
    var select: any = document.getElementById("selectRegistrar");
    this.especialidad = select.options[select.selectedIndex].text;

    this.service.getEspecialidades().then((datos) => {
      let flag = false;
      let aux : any = datos;

      for(let especialidad of aux)
      {
        if(this.especialidad == especialidad)
        {
          flag = true;
          break;
        }
      }
  
      if(flag)
      {
        let unsubs = this.db.collection("especialidades").doc(this.especialidad).valueChanges().subscribe((datos) => {
          let info : any = datos 
          info.profesionales.push(this.profesionalToJson())//Obtengo el array para pushear luego el nuevo profesional
  
          this.db.collection("especialidades").doc(this.especialidad).update({
            profesionales : info.profesionales
          })
  
          unsubs.unsubscribe();
        })
      }
      else
      {
        this.db.collection("especialidades").doc(this.especialidad).set({
          nombre : this.especialidad,
          profesionales : [this.profesionalToJson()]
        })
      }

    });
  
  }


  profesionalToJson()
  {
    return {
      nombre : this.nombre,
      apellido : this.apellido,
      email : this.email,
      contraseña : this.pass,
      fotoUno: this.fotoUno,
      fotoDos: this.fotoDos,
      especialidades : this.especialidad,
      habilitado : false,
      perfil: this.user
    }
  }

  pacienteToJson()
  {
    return {
      nombre : this.nombre,
      apellido : this.apellido,
      email : this.email,
      contraseña : this.pass,
      fotoUno: this.fotoUno,
      fotoDos: this.fotoDos,
      perfil: this.user
    }
  }

  verificarCaptcha() : boolean
  {
    let retorno = false;

    if(this.captcha == "qgphjd"){
      retorno = true
      $("#captcha-img").css("box-shadow", "0px 1px 10px 2px rgb(94, 197, 15)");
    }
    else if(this.captcha == null)
    {
      this.textoMostrar("Debes verificar el captcha");
    }
    else{
      $("#captcha-img").css("box-shadow", "0px 1px 10px 2px rgb(255, 0, 0)");
    }

    return retorno
  } 

  agregarEnTurnos(email)
  {
    this.service.getTurnosPaciente(email).then((datos) => {
      if(datos == undefined)
      {
        this.db.collection("turnos-paciente").doc(email).set({
          turnos : []
        })
      }
    })
  }

}
