import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api-service.service';
import { Curso, CursoAlumno } from '../models/curso';
import { NavController } from '@ionic/angular';
import { Matricula } from '../models/matricula';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  rol: string | null = '';
  userId: string = '';
  cursosAlumn?: CursoAlumno[];
  matriculas?: Matricula[];
  cursos?: Curso[];

  constructor(private apiService: ApiService, private navCtrl: NavController) {
    this.rol = localStorage.getItem('rol');
    this.userId = localStorage.getItem('userId') || '';
  }

  ngOnInit() {
    // Si no hay un usuario autenticado, redirigir al login
    if (!this.userId) {
      this.apiService.getCursos().subscribe({
        next: (resp) => {
          this.cursos = resp
        }
      })
      return;
    }

    // Lógica para cargar los cursos o las matrículas según el rol del usuario
    if (this.rol === 'administrador') {
      this.apiService.getCursosConAlumnos().subscribe({
        next: (resp) => {
          this.cursosAlumn = resp.map(curso => ({...curso, mostrarAlumnos: false}));
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else if (this.rol === 'alumno') {
      console.log(this.userId);
      this.apiService.getCursosPorUsuario(this.userId).subscribe({
        next: (resp) => {
          this.matriculas = resp.map((matricula) => ({...matricula, mostrarNota: false})) ;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  mostrarNota(idCurso: string){
    this.matriculas?.forEach((matricula) => {
      if (matricula.curso.id === idCurso) {
        matricula.mostrarNota = !matricula.mostrarNota;
      }
    });
  }

  mostrarAlumnos(idCurso: string){
    this.cursosAlumn?.forEach((curso) => {
      
      if (curso.curso.id === idCurso) {
        curso.mostrarAlumnos = !curso.mostrarAlumnos;
      }
    });
  }

}
