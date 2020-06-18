import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listadoTurnosPaciente'
})
export class ListadoTurnosPacientePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    
    let aux = [];
    let now = this.getDateNow();

    for(let item of value)
    {
      if(item.fecha < now)
      {
        aux.push(item);
      }
    }

    return aux;
  }

  getDateNow()
  {
    let fecha = new Date()
    let d :string,m :string,y:string;

    d = (fecha.getDate()).toString();
    m = (fecha.getMonth()+1).toString();
    y = fecha.getFullYear().toString();

    if((parseInt(d) + 15) > 31)
      m = (parseInt(m) + 1).toString();
      if(parseInt(m) == 12)
        m = '1';

    d = (parseInt(d) + 15) <= 31 ? d : ((parseInt(d)+15) - 31).toString();

    d = d.length == 1 ? '0'+d : d;
    m = m.length == 1 ? '0'+m : m;

    return `${y}-${m}-${d}`
  }

}
