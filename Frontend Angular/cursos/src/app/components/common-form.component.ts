import { OnInit, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonService } from '../services/common.service';
import { Generic } from '../models/generic';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class CommonFormComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  model: E;
  error: any;
  protected redirect: string;
  protected nombreModel: string;

  constructor(protected service: S, protected router: Router, protected route: ActivatedRoute) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.route.paramMap.subscribe(p => {
      const id: number = +p.get('id');

      if (id) {
        // tslint:disable-next-line: deprecation
        this.service.ver(id).subscribe(model => this.model = model);
      }
    });
  }

  crear(): void{
    // tslint:disable-next-line: deprecation
    this.service.crear(this.model).subscribe(() => {
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

  editar(): void {
    // tslint:disable-next-line: deprecation
    this.service.editar(this.model).subscribe(alu => {
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
