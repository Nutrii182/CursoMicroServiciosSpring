import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFormComponent } from '../common-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent extends CommonFormComponent<Alumno, AlumnoService> implements OnInit {

  private foto: File;

  constructor(service: AlumnoService, router: Router, route: ActivatedRoute) {
    super(service, router, route);
    this.model = new Alumno();
    this.redirect = '/alumnos';
    this.nombreModel = Alumno.name;
  }

  seleccionarFoto(event): void{
    this.foto = event.target.files[0];
    if (this.foto.type.indexOf('image') < 0){
      this.foto = null;
      Swal.fire('Error', 'El archivo debe ser del tipo imagen', 'error');
    }
  }

  crearAlumno(): void{
    if (!this.foto){
      super.crear();
    }else {
      console.log(this.foto);
      // tslint:disable-next-line: deprecation
      this.service.crearConFoto(this.model, this.foto).subscribe(alu => {
        console.log(alu);
        Swal.fire({
          title: 'Éxito',
          text: `${this.nombreModel} Registrado Correctamente`,
          icon: 'success'
        });
        this.router.navigate([this.redirect]);
      }, err => {
        if (err.status === 400){
          this.error = err.error;
          console.log(this.error);
        }
      });
    }
  }

  editarAlumno(): void{
    if (!this.foto){
      super.editar();
    }else {
      // tslint:disable-next-line: deprecation
      this.service.editarConFoto(this.model, this.foto).subscribe(() => {
        Swal.fire({
          title: 'Éxito',
          text: `${this.nombreModel} Editado Correctamente`,
          icon: 'success'
        });
        this.router.navigate([this.redirect]);
      }, err => {
        if (err.status === 400){
          this.error = err.error;
          console.log(this.error);
        }
      });
    }
  }

}
