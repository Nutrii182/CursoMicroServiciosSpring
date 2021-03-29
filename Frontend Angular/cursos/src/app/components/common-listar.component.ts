import { Directive, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  lista: E[];
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 5;
  pageSizeOptions = [] = [5, 10, 25, 100];
  protected nombreModel: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(protected service: S) { }

  ngOnInit(): void {
    this.calcularRangos();
  }

  eliminar(e: E): void {

    Swal.fire({
      title: '¿Estás Seguro?',
      text: 'No Podrás Revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Bórralo!'
    }).then((result) => {
      if (result.value) {
        // tslint:disable-next-line: deprecation
        this.service.eliminar(e.id).subscribe(() => {
          this.calcularRangos();
          Swal.fire({
              title: 'Éxito',
              text:  `${this.nombreModel} Eliminado Correctamente`,
              icon: 'success'
            });
        }, (err) => {
          Swal.fire({
            title: 'Error',
            text: `Error eliminando ${this.nombreModel}`,
            icon: 'error'
          });
        });
      }
    });
  }

  paginar(event: PageEvent): void{
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;

    this.calcularRangos();
  }

  calcularRangos(): void {
    // tslint:disable-next-line: deprecation
    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(pagi => {
      this.lista = pagi.content as E[];
      this.totalRegistros = pagi.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros por Página';
    });
  }

}
