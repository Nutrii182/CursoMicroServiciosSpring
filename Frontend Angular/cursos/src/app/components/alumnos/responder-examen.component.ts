import { Component, OnInit, ViewChild } from '@angular/core';
import { Alumno } from '../../models/alumno';
import { Curso } from 'src/app/models/curso';
import { Examen } from '../../models/examen';
import { ActivatedRoute } from '@angular/router';
import { AlumnoService } from '../../services/alumno.service';
import { CursoService } from '../../services/curso.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ResponderExamenModalComponent } from './responder-examen-modal.component';
import { RespuestaService } from '../../services/respuesta.service';
import { Respuesta } from '../../models/respuesta';
import Swal from 'sweetalert2';
import { VerExamenModalComponent } from './ver-examen-modal.component';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css'],
})
export class ResponderExamenComponent implements OnInit {
  alumno: Alumno;
  curso: Curso;
  examenes: Examen[] = [];
  mostrarColumnasExamenes: string[] = [
    'id',
    'nombre',
    'apellido',
    'email',
    'preguntas',
    'responder',
    'ver'
  ];
  pageSizeOptions = [3, 5, 10, 20, 50];

  dataSource: MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private respuestService: RespuestaService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      // tslint:disable-next-line: deprecation
      this.alumnoService.ver(id).subscribe((alumno) => {
        this.alumno = alumno;
        // tslint:disable-next-line: deprecation
        this.cursoService.obtenerCursoPorAlumnoId(this.alumno).subscribe(curso => {
          this.curso = curso;
          this.examenes = (curso && curso.examenes) ? curso.examenes : [];
          this.dataSource = new MatTableDataSource<Examen>(this.examenes);
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = 'Registros por Página';
        });
      });
    });
  }

  responderExamen(examen: Examen): void{
    const modalRef = this.dialog.open(ResponderExamenModalComponent, {
      width: '750px',
      data: {curso: this.curso, alumno: this.alumno, examen}
    });
    modalRef.afterClosed().subscribe((respMap: Map<Number, Respuesta>) => {
      if (respMap){
        const respuestas = Array.from(respMap.values());
        this.respuestService.crear(respuestas).subscribe(rs => {
          examen.respondido = true;
          Swal.fire('Enviadas', 'Preguntas enviadas', 'success');
        });
      }
    });
  }

  verExamen(examen: Examen): void{
    this.respuestService.obtenerRespuestasPorAlumnoPorExamen(this.alumno, examen).subscribe(rs => {
      const modelRef = this.dialog.open(VerExamenModalComponent, {
        width: '750px',
        data: {curso: this.curso, examen, respuestas: rs}
      });
      modelRef.afterClosed().subscribe(() => {
        console.log('Closed');
      });
    });
  }

}
