import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api-service.service';
import { GalleryPhoto } from '@capacitor/camera';
import { SharedService } from '../servicios/shared.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {
  idUser?: number;
  photos?: any[]


  constructor(private apiService:ApiService, private sharedService: SharedService, private toastController: ToastController) {
    this.idUser = +localStorage.getItem('userId')!
    this.apiService.obtenerGaleria(this.idUser).subscribe({
      next: (resp: any) => {
        this.photos = resp;
      },
      error: (error) => {
        console.error(error);
      }
    }
    )
   }

  ngOnInit() {
  }

  cambiarFoto(photo:any){
    this.apiService.actualizarFotoPerfil(this.idUser!, photo.url , false)
    .subscribe({
      next: (response) => {
        console.log('Foto enviada con éxito:', response);
        this.sharedService.updateFotoPerfil('https://api2.ruptur.eu' +  photo.url)
        // Mostrar un toast de éxito
        this.showSuccessToast('Foto subida con éxito');
      },
      error: (error) => {
        console.error('Error al enviar la foto:', error);
        this.showErrorToast('Error al enviar la foto');
      }
    });
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
