import { Alumno } from "./alumno"

export interface Curso {
    id: string,
    nombre: string 
}


export interface CursoAlumno{
    curso: Curso,
    alumnos: Alumno[],
    mostrarAlumnos: boolean
}