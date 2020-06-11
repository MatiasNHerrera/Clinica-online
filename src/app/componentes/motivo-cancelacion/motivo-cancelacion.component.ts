import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-motivo-cancelacion',
  templateUrl: './motivo-cancelacion.component.html',
  styleUrls: ['./motivo-cancelacion.component.css']
})
export class MotivoCancelacionComponent implements OnInit {

  constructor() { }

  @Output() motivoEnviar : EventEmitter<any> = new EventEmitter<any>();
  motivo:boolean;
  motivoText:string;

  ngOnInit(): void {
  }

  enviarMotivo(opcion:string)
  {
    this.motivoText = (<HTMLInputElement>document.querySelector("#modal-motivo-textarea")).value;
    this.motivoEnviar.emit({opcion : opcion, motivo : this.motivoText});
  }

}
