import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Curso, CursoAlumno } from '../models/curso';
import { Matricula } from '../models/matricula';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public isLogin = false;
  public usuario = '';
  private url = "https://api2.ruptur.eu/ws/";

  // BehaviorSubject para fotoPerfil, con un valor inicial de cadena vacía
  private fotoPerfilSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // Observable que los componentes pueden suscribirse
  public fotoPerfil$: Observable<string> = this.fotoPerfilSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this.httpClient.get<Curso[]>(this.url + "curso");
  }

  getAlumnos(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + "usuario/alumno");
  }

  getMatriculaAlumno(alumno: string) {
    return this.httpClient.get<any[]>(this.url + "matriculas/alumno/" + alumno);
  }

  postMatricula(body: any): Observable<any[]> {
    return this.httpClient.post<any[]>(this.url + "alta", body);
  }

  putLogin(usuario: string, clave: string): Observable<any> {
    return this.httpClient.put<any>(this.url + "login", { usuario, clave });
  }

  getCursosPorUsuario(usuario: string): Observable<Matricula[]> {
    return this.httpClient.get<Matricula[]>(this.url + 'usuario/' + usuario + '/cursos');
  }

  getCursosConAlumnos(): Observable<CursoAlumno[]> {
    return this.httpClient.get<CursoAlumno[]>(this.url + 'cursos/alumnos');
  }

  getCursosNoMatriculados(idUsuario: string): Observable<CursoAlumno[]> {
    return this.httpClient.get<CursoAlumno[]>(this.url + 'usuario/' + idUsuario + '/cursos/no-matriculados');
  }

  postFotoPerfil(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.url + 'usuario/foto/' + formData.get('userId'), formData);
  }

  getFotoPerfil(userId: string): Observable<any> {
    return this.httpClient.get<any>(this.url + 'usuario/foto/' + userId);
  }

  // Método para actualizar la foto de perfil
  actualizarFotoPerfil(nuevaFoto: string): void {
    // Emitir el nuevo valor
    this.fotoPerfilSubject.next(nuevaFoto);
  }
}
