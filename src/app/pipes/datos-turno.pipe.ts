import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datosTurno'
})
export class DatosTurnoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    
    let aux = [];

    for(let item of Object.keys(value))
    {
      aux.push({nombre: item , valor : value[item]});
    }

    return aux;
  }

}
