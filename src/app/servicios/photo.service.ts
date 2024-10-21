import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserPhoto } from '../models/userPhoto';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ApiService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photoSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null); // Inicializamos el BehaviorSubject con un valor null

  constructor(private apiService: ApiService) { }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    
    const newPhoto: UserPhoto = {
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath!
    };
    this.savePicture(newPhoto)
    // Actualizar el BehaviorSubject con la nueva foto
  }

  // Observable para obtener la foto
  public getPhoto(): Observable<string | null> {
    return this.photoSubject.asObservable(); // Exponemos el BehaviorSubject como un observable
  }

  private async savePicture(photo: UserPhoto) {
    // Convertir la imagen a Base64
    const base64Data = await this.readAsBase64(photo);
  
    // Convertir el Base64 en Blob
    const blobData = this.base64ToBlob(base64Data, 'image/jpeg');
    
    // Crear un FormData para enviar la imagen
    const formData = new FormData();
    formData.append('file', blobData, 'perfil.jpg');  // 'file' es el nombre del campo que recibirá Symfony
  
    // Obtener el ID del usuario (si es necesario enviarlo)
    const idUsuario = localStorage.getItem('userId');
    if (idUsuario) {
      formData.append('userId', idUsuario);  // Envía también el ID de usuario si es necesario
    }
  
    // Hacer la petición HTTP usando el servicio de API
    this.apiService.postFotoPerfil(formData).subscribe(response => {
      this.photoSubject.next('http://44.219.93.34:8000/ws/usuario/foto/'+idUsuario);      
    }, error => {
      console.error('Error al subir la imagen', error);
    });
  }

  base64ToBlob(base64String: string, contentType: string = '', sliceSize: number = 512): Blob {
    // Eliminar el prefijo del Base64 (si tiene el formato data:mime/type;base64,...)
    const byteCharacters = atob(base64String.split(',')[1]);

    // Crear un array para almacenar los bytes
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    // Crear el blob a partir del array de bytes
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}


  public async readAsBase64(photo: UserPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webviewPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
