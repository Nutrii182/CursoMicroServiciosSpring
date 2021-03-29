import { Component, OnInit } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { CommonFormComponent } from '../common-form.component';
import { CursoService } from '../../services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.css']
})
export class CursosFormComponent extends CommonFormComponent<Curso, CursoService>{

  constructor(service: CursoService, router: Router, route: ActivatedRoute) {
    super(service, router, route);
    this.model = new Curso();
    this.redirect = '/cursos';
    this.nombreModel = Curso.name;
  }

}
