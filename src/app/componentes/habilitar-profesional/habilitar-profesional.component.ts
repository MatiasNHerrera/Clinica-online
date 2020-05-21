import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { storage } from 'firebase';

@Component({
  selector: 'app-habilitar-profesional',
  templateUrl: './habilitar-profesional.component.html',
  styleUrls: ['./habilitar-profesional.component.css']
})
export class HabilitarProfesionalComponent implements OnInit {

  profesionales = [];

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.db.collection("profesionales").valueChanges().subscribe((datos)=>{
      this.profesionales = datos;
      this.getImagenes();
    });
  }

  getImagenes()
  {
    for(let profesional of this.profesionales)
    {
      storage().ref().child(profesional.fotoUno).getDownloadURL().then((dato) => {
        profesional.fotoUno = dato;
      })

      storage().ref().child(profesional.fotoDos).getDownloadURL().then((dato) => {
        profesional.fotoDos = dato;
      })
    }
  }

  habilitar(email : string, opcion : string)
  {
    switch(opcion)
    {
      case 'habilitar':
      this.db.collection("profesionales").doc(email).update({
        habilitado : true
      });
      break;
      case 'deshabilitar':
        this.db.collection("profesionales").doc(email).update({
          habilitado : false
        });
      break;
    }
  }

}
