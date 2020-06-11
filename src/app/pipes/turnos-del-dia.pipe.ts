import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turnosDelDia'
})
export class TurnosDelDiaPipe implements PipeTransform {

  turnosDia : any[] = [];
  turnoAtender : any;

  transform(value: any, ...args: unknown[]): unknown {
    
    let dateNow = this.getDateNow();

    for(let item of value)
    {
      if(item.fecha == dateNow && item.estado == 'aceptado')
      {
        this.turnosDia.push(item);
      } 
    }

    this.ordenarLista();

    return this.turnosDia;

  }

  getDateNow()
  {
    let fecha = new Date()
    let d :string,m :string,y:string;

    d = fecha.getDate().toString();
    m = (fecha.getMonth()+1).toString();
    y = fecha.getFullYear().toString();


    d = d.length == 1 ? '0'+d : d;
    m = m.length == 1 ? '0'+m : m;

    return `${y}-${m}-${d}`
  }

  ordenarLista()
  {
    this.turnosDia.sort((a,b) => {
      if(a.horario> b.horario)
        return 1
      else
        return -1;
    })
  }

}
