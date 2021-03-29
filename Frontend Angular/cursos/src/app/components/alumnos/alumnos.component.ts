import { Component } from '@angular/core';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno';
import { CommonListarComponent } from '../common-listar.component';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent extends CommonListarComponent<Alumno, AlumnoService> {

  baseEndpoint = BASE_ENDPOINT + '/alumnos';

  constructor(service: AlumnoService) {
    super(service);
    this.nombreModel = Alumno.name;
  }

}
