import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../servicios/api-service.service';

@Component({
  selector: 'app-borrar',
  templateUrl: './borrar.page.html',
  styleUrls: ['./borrar.page.scss'],
})
export class BorrarPage implements OnInit {
  formulario: FormGroup;
  alumnos: any[] = [];
  cursos: any[] = [];

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.formulario = this.formBuilder.group({
      alumno: ['', Validators.required],
      curso: ['', Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.formulario.valid) {
      const { alumno, curso } = this.formulario.value;

      this.apiService
        .postMatricula({ id_alumno: alumno, id_curso: curso })
        .subscribe({
          next: (resp) => {
            console.log('Curso añadido correctamente');
            this.formulario.reset();
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      console.error('Formulario no válido');
    }
  }

  obtenerAginaturasAlumno() {}
}
