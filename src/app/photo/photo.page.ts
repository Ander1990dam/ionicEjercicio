import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../servicios/photo.service';
import { UserPhoto } from '../models/userPhoto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  photo?: string | null;
  private photoSubscription?: Subscription;
  constructor(private photoService: PhotoService) { }

  ngOnInit(): void {
    // Nos suscribimos al observable para obtener el valor de la foto cuando cambie
    this.photoSubscription = this.photoService.getPhoto().subscribe(
      (newPhoto: string | null) => {
        this.photo = newPhoto;
        if (newPhoto) {
          console.log('Nueva foto recibida:', newPhoto);
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción cuando se destruya el componente
    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
    }
  }

  addPhotoToGallery(){
    this.photoService.addNewToGallery()
  }
}
