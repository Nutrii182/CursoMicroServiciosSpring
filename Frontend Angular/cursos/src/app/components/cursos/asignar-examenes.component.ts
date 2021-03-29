import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from '../../models/curso';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { ExamenService } from '../../services/examen.service';
import { FormControl } from '@angular/forms';
import { Examen } from '../../models/examen';
import { map, flatMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css'],
})
export class AsignarExamenesComponent implements OnInit {
  curso: Curso;
  autoCompleteControl = new FormControl();
  examenesFiltrados: Examen[] = [];
  examenesAsignar: Examen[] = [];
  examenes: Examen[] = [];
  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  mostrarColumnas: string[] = ['nombre', 'asignatura', 'eliminar'];
  mostrarColumnasExamenes: string[] = [
    'id',
    'nombre',
    'asignatura',
    'eliminar',
  ];
  pageSizeOptions = [3, 5, 10, 20, 50];
  tabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private examenService: ExamenService
  ) {}

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.route.paramMap.subscribe((params) => {
      const id: number = +params.get('id');
      // tslint:disable-next-line: deprecation
      this.cursoService.ver(id).subscribe((c) => {
        this.curso = c;
        this.examenes = c.examenes;
      });
    });
    this.autoCompleteControl.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        flatMap((valor) =>
          valor ? this.examenService.filtrarPorNombre(valor) : []
        )
      )
      // tslint:disable-next-line: deprecation
      .subscribe((exams) => (this.examenesFiltrados = exams));
  }

  mostrarNombre(examen?: Examen): string {
    return examen ? examen.nombre : '';
  }

  seleccionarExamen(event: MatAutocompleteSelectedEvent): void {
    const examen = event.option.value as Examen;
    if (!this.existe(examen.id)) {
      this.examenesAsignar = this.examenesAsignar.concat(examen);
    } else {
      Swal.fire('Error', 'El examen ya esta en el curso', 'error');
    }
    this.autoCompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  private existe(id: number): boolean {
    let existe = false;
    this.examenesAsignar.concat(this.curso.examenes).forEach((e) => {
      if (id === e.id) {
        existe = true;
      }
    });
    return existe;
  }

  elimnarDelAsignar(examen: Examen): void {
    this.examenesAsignar = this.examenesAsignar.filter(
      (e) => examen.id !== e.id
    );
  }

  asignar(): void {
    // tslint:disable-next-line: deprecation
    this.cursoService
      .asignarExamenes(this.curso, this.examenesAsignar)
      .subscribe((curso) => {
        this.iniciarPaginador();
        this.examenes = this.examenes.concat(this.examenesAsignar);
        Swal.fire('Asignados', 'Examenes Asignados', 'success');
        this.tabIndex = 2;
      });
  }

  eliminarExamenDelCurso(examen: Examen): void {
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
          .eliminarExamen(this.curso, examen)
          // tslint:disable-next-line: deprecation
          .subscribe((curso) => {
            this.examenes = this.examenes.filter((a) => a.id !== examen.id);
            this.iniciarPaginador();
            Swal.fire(
              'Eliminado',
              `Examen Eliminado Exitosamente del curso ${curso.nombre}`,
              'success'
            );
          });
      }
    });
  }

  iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Examen>(this.examenes);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por Página';
  }
}
