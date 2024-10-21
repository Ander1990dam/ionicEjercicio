import { Component, OnInit } from '@angular/core';
import { ApiService } from './servicios/api-service.service';
import { UserPhoto } from './models/userPhoto';
import { PhotoService } from './servicios/photo.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home', enabled: true },
    { title: 'Alta', url: '/alta', icon: 'person-add', enabled: true },
  ];
  private photoSubscription?: Subscription;
  fotoPerfilUrl: string =  ''

  constructor(public apiService: ApiService, public photoService: PhotoService){
    this.apiService.isLogin = !!localStorage.getItem('rol');
    this.apiService.usuario = localStorage.getItem('usuario') ?? '';
    this.apiService.actualizarFotoPerfil(localStorage.getItem('fotoPerfil') ?? '')
  }

  ngOnInit(): void {

    this.apiService.fotoPerfil$.subscribe(foto => {
      this.fotoPerfilUrl = foto;
    });
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción cuando se destruya el componente
    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
    }
  }


  logout(){
    this.apiService.isLogin = false;
    this.apiService.usuario = '';
    this.apiService.actualizarFotoPerfil('')
    localStorage.clear()
  }
}
