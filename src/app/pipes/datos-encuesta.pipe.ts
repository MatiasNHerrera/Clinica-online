import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datosEncuesta'
})
export class DatosEncuestaPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    
    let aux = []

    if(value != undefined)
    {
      aux.push(value[0].valor);

      for(let item of value[1].valor)
      {
        aux.push(item);
      }
    }
    
    return aux;
  }

}
