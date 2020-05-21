import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  queMostrar = "principal";
  usuario : any;
  constructor() { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  }

  cambiarVista(mostrar : string)
  {
    this.queMostrar = mostrar;
  }

}
