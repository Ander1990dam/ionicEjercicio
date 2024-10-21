import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../servicios/api-service.service';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {
  formulario: FormGroup;
  alumnos: any[] = [];
  cursos: any[] = [];
  rol?: string;
  mensajeNoAdmin: string = 'Contenido solo para administradores';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.formulario = this.formBuilder.group({
      alumno: ['', Validators.required],
      curso: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.rol = localStorage.getItem('rol') || undefined
    if(!this.rol){
      this.mensajeNoAdmin = 'Es necesario estar logeado'
    }
    this.loadAlumnos();
    this.loadCursos();
  }

  loadAlumnos() {
    this.apiService.getAlumnos().subscribe((data: any) => {
      this.alumnos = data;
    }, error => {
      console.error('Error al cargar los alumnos', error);
    });
  }

  loadCursos() {
    this.apiService.getCursos().subscribe((data: any) => {
      this.cursos = data;
    }, error => {
      console.error('Error al cargar los cursos', error);
    });
  }

  onSubmit() {

    if (this.formulario.valid) {
      const {alumno, curso} = this.formulario.value;

      // Aquí puedes manejar lo que sucederá cuando se confirme la selección
      this.apiService.postMatricula({id_alumno:alumno , id_curso: curso}).subscribe({
        next: (resp) => {
          console.log('Curso añadido correctamente');
          this.formulario.reset();

        },
        error: (error) => {
          console.error(error); // Maneja el error aquí
        }
      })
    } else {
      console.error('Formulario no válido');
    }
  }

  obtenerCursosAlumno(){
    this.apiService.getCursosNoMatriculados(this.formulario.value.alumno).subscribe({
      next: (resp) => {
       this.cursos = Object.values(resp)

      },
      error: (error) => {
        console.error(error); // Maneja el error aquí
      }
    })
  }

}
