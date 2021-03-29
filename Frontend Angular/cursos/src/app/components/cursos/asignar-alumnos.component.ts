import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from '../../models/curso';
import { CursoService } from '../../services/curso.service';
import { AlumnoService } from '../../services/alumno.service';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from '../../models/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css'],
})
export class AsignarAlumnosComponent implements OnInit {
  curso: Curso;
  alumnos: Alumno[] = [];
  alumnosAsignar: Alumno[] = [];
  mostrarColumnas: string[] = ['nombre', 'apellido', 'selección'];
  mostrarColumnasAlumnos: string[] = [
    'id',
    'nombre',
    'apellido',
    'email',
    'eliminar',
  ];
  seleccion: SelectionModel<Alumno> = new SelectionModel<Alumno>(true, []);
  pageSizeOptions = [3, 5, 10, 20, 50];
  tabIndex = 0;

  dataSource: MatTableDataSource<Alumno>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private alumnoService: AlumnoService
  ) {}

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.route.paramMap.subscribe((params) => {
      const id: number = +params.get('id');
      // tslint:disable-next-line: deprecation
      this.cursoService.ver(id).subscribe((c) => {
        this.curso = c;
        this.alumnos = this.curso.alumnos;
        this.iniciarPaginador();
      });
    });
  }

  filtrar(texto: string): void {
    texto = texto !== undefined ? texto.trim() : '';
    if (texto !== '') {
      // tslint:disable-next-line: deprecation
      this.alumnoService.filtrarPorNombre(texto).subscribe(
        (alumnos) =>
          (this.alumnosAsignar = alumnos.filter((a) => {
            let filtrar = true;
            this.alumnos.forEach((ca) => {
              if (a.id === ca.id) {
                filtrar = false;
              }
            });
            return filtrar;
          }))
      );
    }
  }

  todosSeleccionados(): boolean {
    const seleccionados = this.seleccion.selected.length;
    const numAlumnos = this.alumnosAsignar.length;
    return seleccionados === numAlumnos;
  }

  selDesTodos(): void {
    this.todosSeleccionados()
      ? this.seleccion.clear()
      : this.alumnosAsignar.forEach((a) => {
          this.seleccion.select(a);
        });
  }

  asignar(): void {
    this.cursoService
      .asignarAlumnos(this.curso, this.seleccion.selected)
      // tslint:disable-next-line: deprecation
      .subscribe(
        (c) => {
          this.tabIndex = 2;
          Swal.fire('Asignados', 'Alumnos Asignados Exitósamente', 'success');
          this.alumnos = this.alumnos.concat(this.seleccion.selected);
          this.iniciarPaginador();
          this.alumnosAsignar = [];
          this.seleccion.clear();
        },
        (e) => {
          if (e.status === 500) {
            const mensaje = e.error.message as string;
            if (mensaje.indexOf('ConstraintViolationException') > -1) {
              Swal.fire('Cuidado', 'No se puede asignar el alumno', 'error');
            }
          }
        }
      );
  }

  eliminarAlumno(alumno: Alumno): void {
    Swal.fire({
      title: '¿Estás Seguro?',
      text: 'No Podrás Revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Bórralo!',
    }).then((result) => {
      if (result.value) {
        this.cursoService
          .eliminarAlumno(this.curso, alumno)
          // tslint:disable-next-line: deprecation
          .subscribe((curso) => {
            this.alumnos = this.alumnos.filter((a) => a.id !== alumno.id);
            this.iniciarPaginador();
            Swal.fire(
              'Eliminado',
              `Alumno Eliminado Exitosamente del curso ${curso.nombre}`,
              'success'
            );
          });
      }
    });
  }

  iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por Página';
  }
}
