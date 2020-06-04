import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'habilitadoPipe'
})
export class HabilitadoPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    let nuevaLista = []

    for(let item of <any>value)
    {
      if(item.habilitado)
      {
        nuevaLista.push(item);
      }
    }

    nuevaLista.sort((a, b) => a.apellido.localeCompare(b.apellido))

    return nuevaLista;
  }

}
