import { Injectable } from '@angular/core';
import { Alumno } from '../models/alumno';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends CommonService<Alumno> {

  protected baseEndpoint = BASE_ENDPOINT + '/alumnos';

  constructor(http: HttpClient) {
    super(http);
  }

  crearConFoto(alumno: Alumno, file: File): Observable<Alumno>{
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    return this.http.post<Alumno>(this.baseEndpoint + '/crear-con-foto', formData);
  }

  editarConFoto(alumno: Alumno, file: File): Observable<Alumno>{
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('nombre', alumno.nombre);
    formData.append('apellido', alumno.apellido);
    formData.append('email', alumno.email);
    return this.http.put<Alumno>(`${this.baseEndpoint}/editar-con-foto/${alumno.id}`, formData);
  }

  filtrarPorNombre(nombre: string): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.baseEndpoint}/filtrar/${nombre}`);
  }

}
