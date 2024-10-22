import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/camera';
import { ApiService } from '../servicios/api-service.service';
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  capturedImage: string | null | undefined = null;
  userId: number | null = null;

  constructor(
    private apiService: ApiService,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      this.userId = +userIdString;
    } else {
      console.error('No se encontró el userId en el localStorage');
    }
  }

  async takePicture() {
    try {
      // Capturar la imagen usando la cámara del dispositivo
      const image: CameraPhoto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      // Guardar la imagen en base64
      this.capturedImage = image.dataUrl?.split(',')[1]; 

      // Verificar que userId y la imagen capturada existan
      if (this.userId && this.capturedImage) {
        // Llamar a la API para enviar la foto
        this.apiService.actualizarFotoPerfil(this.userId, this.capturedImage)
          .subscribe({
            next: (response) => {
              console.log('Foto enviada con éxito:', response);
              // Mostrar un toast de éxito
              this.showSuccessToast('Foto subida con éxito');
            },
            error: (error) => {
              console.error('Error al enviar la foto:', error);
              this.showErrorToast('Error al enviar la foto');
            }
          });
      } else {
        console.error('La imagen capturada o el userId son inválidos');
        this.showErrorToast('Error al capturar la imagen o no se encontró el userId');
      }

    } catch (error) {
      console.log('Error al tomar la foto:', error);
      this.showCancelToast(); // Mostrar un toast si el usuario cancela
    }
  }

  // Toast para cancelación
  async showCancelToast() {
    const toast = await this.toastController.create({
      message: 'Cancelaste la subida de la foto',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // Toast para éxito
  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  // Toast para error
  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}
