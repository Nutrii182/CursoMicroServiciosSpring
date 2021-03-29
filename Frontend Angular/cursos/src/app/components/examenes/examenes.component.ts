import { Component, OnInit } from '@angular/core';
import { Examen } from '../../models/examen';
import { ExamenService } from '../../services/examen.service';
import { CommonListarComponent } from '../common-listar.component';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})
export class ExamenesComponent extends CommonListarComponent<Examen, ExamenService> {

  constructor(service: ExamenService) {
    super(service);
    this.nombreModel = Examen.name;
  }

}
