import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MiServicioService } from 'src/app/servicios/mi-servicio.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FileService } from 'src/app/servicios/file.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  series = [];
  especialidades:any;
  semana:any;
  turnos:any;
  dias:any = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  constructor(private service : MiServicioService, private file : FileService) { }

  ngOnInit(): void {

    this.service.getEspecialidades().then((datos : any) => {
      this.especialidades = datos;
    })

    this.service.getSemanaTodos().then((datos) => {
      this.semana = datos;
    })

    this.service.getTurnosProfesionalTodos().then((datos:any) => {
      this.turnos = datos
    })
  }

  options:any = {
    chart: {
      type: 'bar',
      height: 300,
      width: 850,
      backgroundColor: {
        linearGradient: [0, 0, 500, 500],
        stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(240, 240, 255)']
        ]
      },
      borderWidth: 2,
      plotBackgroundColor: 'rgba(255, 255, 255, .9)',
      plotShadow: true,
      plotBorderWidth: 1
    },
    title: {
      text: 'Sample Scatter Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return Highcharts.format('cantidad', this.x)+ ": " + this.y;
      }
    },
    xAxis: {
      type: 'string',
      labels: {
        formatter: function() {
          
        }
      }
    },
    yAxis:{
      title:{
        text:""
      }
    },
    series: []
  }

  cargarOperacionesEspecialidades(option:string)
  {
    let c_especialidad:number = 0;
    this.series = [];

    for(let especialidad of this.especialidades)
    {
      for(let item of this.turnos)
      {
          for(let turno of item.turnos)
          {
            if(turno.especialidad == especialidad)
            {
              c_especialidad++;
            }
          }
      }
      
      this.series.push({name: especialidad, data: [c_especialidad]}); 
      c_especialidad = 0;
    }

    this.options.series = this.series;
    this.cargarCharEspecialidades();

    if(option == 'pdf')
      this.generarPdf("Operaciones por especialidad");
    else if(option == 'excel')
      this.descargarExcel('opxesp')
  }

  cargarCharEspecialidades()
  {
    this.setOptionsAndChart("bar","Operacion por especialidad","Cantidad de operaciones","operaciones");
  }

  cargarCantidadTurnosPorSemana(option:string)
  {
    let c_turnos:number = 0;
    this.series = [];

    for(let dias of this.dias)
    {
      for(let item of this.turnos)
      {
          for(let turno of item.turnos)
          {
            if(turno.dia == dias)
            {
              c_turnos++;
            }
          }
      }
      
      this.series.push({name: dias, data: [c_turnos]});
      c_turnos = 0;
    }

    this.options.series = this.series;
    this.cargarCharCantidadTurnosPorSemana();

    if(option == 'pdf')
      this.generarPdf("Turnos por semana");
    else if(option == 'excel')
      this.descargarExcel('turnxdia')
  }

  cargarCharCantidadTurnosPorSemana()
  {
    this.setOptionsAndChart("column","Cantidad de turnos por dia","Cantidad de turnos", "cantidad turnos");
  }

  cargarTurnosPorProfesional(option:string)
  {
    this.series = [];

    for(let item of this.turnos)
    {
      this.series.push({name: item.nombre + " " + item.apellido, data: [item.turnos.length]});
    }

    this.options.series = this.series;
    this.cargarChartTurnosPorProfesional();

    if(option == 'pdf')
      this.generarPdf("Turnos por profesional");
    else if(option == 'excel')
      this.descargarExcel('turnxmed')

  }

  cargarChartTurnosPorProfesional()
  {
    this.setOptionsAndChart("bar","Cantidad de turnos por profesional","Cantidad de turnos","cantidad turnos");
  }

  cargarProfesionalesPorDia(option:string)
  {
    this.series = [];

    for(let dias of this.semana)
    {
      this.series.push({name: dias.nombre, data: [dias.profesionales.length]});
    }

    this.options.series = this.series;
    this.cargarChartProfesionalesPorDia();

    if(option == 'pdf')
      this.generarPdf("Profesionales por dia");
    else if(option == 'excel')
      this.descargarExcel('medxdia')
  }

  cargarChartProfesionalesPorDia()
  {
    this.setOptionsAndChart("column","Cantidad de medicos por dia","Cantidad de medicos", "cantidad profesionales");
  }

  setOptionsAndChart(type:string, title:string, yAxis:string, tooltip:string)
  {
    this.options.tooltip = {
      formatter: function() {
        return Highcharts.format(tooltip, this.x)+ ": " + this.y;
      }
    }

    this.options.chart.type = type
    this.options.yAxis.title.text = yAxis;
    this.options.title.text = title;
    Highcharts.chart('graficos', this.options);
  }

  generarPdf(title:string)
  {
    let aux = [];

    var docDefinition = {
      content: [
        title,
        {
          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          ul: []
        }
      ]
    };

    for(let serie of this.series)
      aux.push({text: `${serie.name}: ${serie.data[0]}`})

    docDefinition.content[1] = {ul : aux};
    pdfMake.createPdf(docDefinition).open();
  }


  preparaParaDescargar(lista, name, nameData){
    return lista.map(dato=>{
       return {[name]:dato.name,[nameData]:dato.data[0]}
     })
   }

   descargarExcel(option){
    switch(option){
      case 'opxesp':
        this.file.exportAsExcelFile(this.preparaParaDescargar(this.series,'Especialidad', 'Cant Operaciones'), 'Operaciones por especialidades')
        break;
      case 'turnxdia':
        this.file.exportAsExcelFile(this.preparaParaDescargar(this.series,'Día', 'Cant Turnos'), 'Turnos por día')
        break;
      case 'turnxmed':
        this.file.exportAsExcelFile(this.preparaParaDescargar(this.series, 'Profesional', 'Cant Turnos'), 'Turnos por profesional')
        break;
      case 'medxdia':
          this.file.exportAsExcelFile(this.preparaParaDescargar(this.series,'Día', 'Cant Profesionales'), 'Profesional por día')
          break;
    }
   }

}


