import { Component, OnInit } from '@angular/core';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-busqueda-turnos',
  templateUrl: './busqueda-turnos.component.html',
  styleUrls: ['./busqueda-turnos.component.css']
})
export class BusquedaTurnosComponent implements OnInit {

  constructor(private service : MiServicioService) { }

  turnosEncontrados = [];
  turnos = [];
  stringClave:string;
  turnoSeleccionado:any;

  ngOnInit(): void {
    this.service.getTurnosProfesionalTodos().then((datos:any) => {
      for(let turno of datos)
        for(let turnos of turno.turnos)
          this.turnos.push(turnos);
    })
  }

  filtrarTurnos()
  {
    this.turnosEncontrados = [];
    this.stringClave = this.stringClave.trim().toLocaleLowerCase();

    if(this.stringClave.length > 0)
    {
      for(let turno of this.turnos)
      {
        if(turno.nombrePaciente.toLowerCase().includes(this.stringClave) || turno.nombreProfesional.toLowerCase().includes(this.stringClave) 
          || turno.especialidad.toLowerCase().includes(this.stringClave) || turno.estado.includes(this.stringClave) || turno.fecha.includes(this.stringClave))
        {
          this.turnosEncontrados.push(turno);
        }
        else
        {
          if(turno.datos != undefined)
          {
            for(let item of Object.keys(turno.datos))
            {   
              if(item.includes(this.stringClave))
                this.turnosEncontrados.push(turno);
            }
          }
        }
      }
    }
  }

}
