import { Component } from '@angular/core';
import { CommonListarComponent } from '../common-listar.component';
import { CursoService } from '../../services/curso.service';
import { Curso } from 'src/app/models/curso';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent extends CommonListarComponent<Curso, CursoService>{

  constructor(service: CursoService) {
    super(service);
    this.nombreModel = Curso.name;
  }

}
