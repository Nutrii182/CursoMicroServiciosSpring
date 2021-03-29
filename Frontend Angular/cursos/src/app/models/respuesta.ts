import { Alumno } from './alumno';
import { Pregunta } from './pregunta';

export class Respuesta {

    id: string;
    texto: string;
    alumno: Alumno;
    pregunta: Pregunta;
}
