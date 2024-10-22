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

  private fotoPerfilSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public fotoPerfil$: Observable<string> = this.fotoPerfilSubject.asObservable();

  constructor(private httpClient: HttpClient) {}


  getApiUrl(){
    return this.url;
  }

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

  getFotoPerfil(userId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + 'usuario/foto/' + userId);
  }

  getInfoPerfil(userId: number): Observable<any> {
    return this.httpClient.get<any>(this.url + "usuario/" + userId)
  }

  actualizarFotoPerfil(idUser:number, fotoPerfil: string, agregarAGaleria: boolean = true) {
    const body = { fotoPerfil, agregarAGaleria };
    return this.httpClient.put(`${this.url}usuario/${idUser}/foto`, body);
  }
  crearUsuario(usuario: string, nombre: string, apellido1: string, apellido2: string, clave: string, rol: string) {
    const body = { usuario, nombre, apellido1, apellido2, clave, rol };
    return this.httpClient.post(`${this.url}register`, body);
  }
  
  editarUsuario(idUser: number, usuario: string, nombre: string, apellido1: string, apellido2: string, clave: string, rol: string): Observable<any> {
    const body = { usuario, nombre, apellido1, apellido2, clave, rol };
    return this.httpClient.put(`${this.url}usuario/${idUser}`, body);
  }  

  eliminarUsuario(idUser: number){
    return this.httpClient.delete(`${this.url}usuario/${idUser}`)
  }
  obtenerUsuarios(){
    return this.httpClient.get(`${this.url}usuario`)
  }

  obtenerGaleria(idUser: number){
    return this.httpClient.get(`${this.url}galeria/${idUser}`)
  }

}
