import { Component, OnInit } from '@angular/core';
import { CommonFormComponent } from '../common-form.component';
import { Examen } from '../../models/examen';
import { ExamenService } from '../../services/examen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Asignatura } from '../../models/asignatura';
import { Pregunta } from 'src/app/models/pregunta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-examenes-form',
  templateUrl: './examenes-form.component.html',
  styleUrls: ['./examenes-form.component.css'],
})
export class ExamenesFormComponent
  extends CommonFormComponent<Examen, ExamenService>
  implements OnInit {
  asignaturasPadre: Asignatura[] = [];
  asignaturasHija: Asignatura[] = [];

  constructor(service: ExamenService, router: Router, route: ActivatedRoute) {
    super(service, router, route);
    this.model = new Examen();
    this.nombreModel = Examen.name;
    this.redirect = '/examenes';
  }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.route.paramMap.subscribe((p) => {
      const id: number = +p.get('id');
      if (id) {
        // tslint:disable-next-line: deprecation
        this.service.ver(id).subscribe((model) => {
          this.model = model;
          this.cargarHijos();
        });
      }
    });

    // tslint:disable-next-line: deprecation
    this.service
      .findAllAsignaturas()
      .subscribe(
        (asig) => (this.asignaturasPadre = asig.filter((a) => !a.padre))
      );
  }

  crear(): void{
    this.eliminarPreguntasVacias();
    super.crear();
  }

  editar(): void{
    this.eliminarPreguntasVacias();
    super.editar();
  }

  cargarHijos(): void {
    this.asignaturasHija = this.model.asignaturaPadre
      ? this.model.asignaturaPadre.hijos
      : [];
  }

  compararAsignatura(a1: Asignatura, a2: Asignatura): boolean {
    if (a1 === undefined && a2 === undefined) {
      return true;
    }

    return a1 === null || a2 === null || a1 === undefined || a2 === undefined
      ? false
      : a1.id === a2.id;
  }

  agregarPregunta(): void {
    this.model.preguntas.push(new Pregunta());
  }

  asignarTexto(pregunta: Pregunta, event: any): void {
    pregunta.texto = event.target.value as string;
  }

  eliminarPregunta(pregunta: Pregunta): void{
    this.model.preguntas = this.model.preguntas.filter(p => pregunta.texto !== p.texto);
  }

  eliminarPreguntasVacias(): void{
    this.model.preguntas = this.model.preguntas.filter(p => p.texto != null && p.texto.length > 0)
  }
}
