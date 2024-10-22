import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api-service.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-panel-admin-cursos',
  templateUrl: './panel-admin-cursos.page.html',
  styleUrls: ['./panel-admin-cursos.page.scss'],
})
export class PanelAdminCursosPage implements OnInit {
  public cursos: any[] = [];
  public curso = { id: null, nombre: '' };
  public isEditing = false;

  constructor(private apiService: ApiService, private toastController: ToastController) {}

  ngOnInit() {
    this.cargarCursos();
  }

  cargarCursos() {
    this.apiService.obtenerCursos().subscribe(
      (response: any) => {
        this.cursos = response;
      },
      (error) => {
        this.presentToast('Error al cargar los cursos', 'danger');
      }
    );
  }

  crearCurso() {
    this.apiService.crearCurso(this.curso.nombre).subscribe(
      (response: any) => {
        this.presentToast('Curso creado con éxito', 'success');
        this.cargarCursos();
        this.resetForm();
      },
      (error) => {
        this.presentToast('Error al crear el curso', 'danger');
      }
    );
  }

  cargarCurso(curso: any) {
    this.curso = { ...curso };
    this.isEditing = true;
  }

  editarCurso() {
    if (this.curso.id) {
      this.apiService.editarCurso(this.curso.id, this.curso.nombre).subscribe(
        (response: any) => {
          this.presentToast('Curso editado con éxito', 'success');
          this.cargarCursos();
          this.resetForm();
        },
        (error) => {
          this.presentToast('Error al editar el curso', 'danger');
        }
      );
    }
  }

  eliminarCurso(cursoId: number) {
    this.apiService.eliminarCurso(cursoId).subscribe(
      (response: any) => {
        this.presentToast('Curso eliminado con éxito', 'success');
        this.cargarCursos();
      },
      (error) => {
        this.presentToast('Error al eliminar el curso', 'danger');
      }
    );
  }

  resetForm() {
    this.curso = { id: null, nombre: '' };
    this.isEditing = false;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
