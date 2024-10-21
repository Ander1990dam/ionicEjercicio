import { Curso } from "./curso"

export interface Matricula {
    curso: Curso,
    nota: number
    mostrarNota?: boolean
}