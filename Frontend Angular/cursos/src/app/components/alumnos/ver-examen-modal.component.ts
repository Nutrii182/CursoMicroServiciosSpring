import { Component, OnInit, Inject } from '@angular/core';
import { Examen } from '../../models/examen';
import { Curso } from '../../models/curso';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Respuesta } from '../../models/respuesta';

@Component({
  selector: 'app-ver-examen-modal',
  templateUrl: './ver-examen-modal.component.html',
  styleUrls: ['./ver-examen-modal.component.css'],
})
export class VerExamenModalComponent implements OnInit {

  curso: Curso;
  examen: Examen;
  respuestas: Respuesta[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<VerExamenModalComponent>
  ) {}

  ngOnInit(): void {
    this.curso = this.data.curso as Curso;
    this.examen = this.data.examen as Examen;
    this.respuestas = this.data.resspuestas as Respuesta[];
  }

  cerrar(): void{
    this.modalRef.close();
  }
}
