import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api-service.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.page.html',
  styleUrls: ['./panel-admin.page.scss'],
})
export class PanelAdminPage implements OnInit {
  public usuarios: any[] = [];
  public usuario = { id: null, usuario: '', nombre: '', apellido1: '', apellido2: '', clave: '', rol: '' };
  public isEditing = false;

  constructor(private apiService: ApiService, private toastController: ToastController) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.apiService.obtenerUsuarios().subscribe(
      (response: any) => {
        this.usuarios = response;
      },
      (error) => {
        this.presentToast('Error al cargar los usuarios', 'danger');
      }
    );
  }

  crearUsuario() {
    this.apiService.crearUsuario(this.usuario.usuario, this.usuario.nombre, this.usuario.apellido1, this.usuario.apellido2, this.usuario.clave, this.usuario.rol).subscribe(
      (response: any) => {
        this.presentToast('Usuario creado con éxito', 'success');
        this.cargarUsuarios();
        this.resetForm();
      },
      (error) => {
        this.presentToast('Error al crear el usuario', 'danger');
      }
    );
  }

  cargarUsuario(user: any) {
    this.usuario = { ...user };
    this.isEditing = true;
  }

  editarUsuario() {
    if (this.usuario.id) {
      this.apiService.editarUsuario(
        this.usuario.id,
        this.usuario.usuario, 
        this.usuario.nombre, 
        this.usuario.apellido1, 
        this.usuario.apellido2, 
        this.usuario.clave, 
        this.usuario.rol
      ).subscribe(
        (response: any) => {
          this.presentToast('Usuario editado con éxito', 'success');
          this.cargarUsuarios();
          this.resetForm();
        },
        (error) => {
          this.presentToast('Error al editar el usuario', 'danger');
        }
      );
    }
  }

  eliminarUsuario(userId: number) {
    this.apiService.eliminarUsuario(userId).subscribe(
      (response: any) => {
        this.presentToast('Usuario eliminado con éxito', 'success');
        this.cargarUsuarios();
      },
      (error) => {
        this.presentToast('Error al eliminar el usuario', 'danger');
      }
    );
  }

  resetForm() {
    this.usuario = { id: null, usuario: '', nombre: '', apellido1: '', apellido2: '', clave: '', rol: '' };
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
