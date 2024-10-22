import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from './servicios/api-service.service';
import { SharedService } from './servicios/shared.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home', enabled: true },
    { title: 'Alta', url: '/alta', icon: 'person-add', enabled: true },
  ];

  fotoPerfilUrl: string = '';
  usuario: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    public apiService: ApiService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.apiService.isLogin = !!localStorage.getItem('rol');
    this.usuario = localStorage.getItem('usuario') ?? '';
  }

  ngOnInit(): void {
    // Suscribirse a los cambios de foto de perfil y nombre de usuario
    this.subscriptions.push(
      this.sharedService.fotoPerfil$.subscribe((foto) => {
        this.fotoPerfilUrl = foto;
      }),
      this.sharedService.usuario$.subscribe((usuario) => {
        this.usuario = usuario;
      })
    );

    // Detectar cambios de ruta y ejecutar getInfoPerfil
    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd) // Solo eventos de fin de navegación
      ).subscribe(() => {
        this.getInfoPerfil(); // Llamar a la función para obtener la información del perfil
      })
    );

    // Cargar el usuario y foto almacenados si están disponibles
    const savedFoto = localStorage.getItem('fotoPerfil');
    if (savedFoto) {
      let fotoParsed = this.apiService.getApiUrl + savedFoto;
      this.sharedService.updateFotoPerfil(fotoParsed);
    }

    const savedUsuario = localStorage.getItem('usuario');
    if (savedUsuario) {
      this.sharedService.updateUsuario(savedUsuario);
    }
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.apiService.isLogin = false;
    localStorage.clear();
    this.sharedService.clearUserData();
  }

  // Método para obtener la información del perfil (nombre y foto)
  getInfoPerfil(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.apiService.getInfoPerfil(+userId).subscribe((response) => {
        let fotoBase64 = response.fotoPerfil;
        const nombreUsuario = response.nombre;


        fotoBase64 = (this.apiService.getApiUrl() + fotoBase64).replace('ws/', '');
        this.sharedService.updateFotoPerfil(fotoBase64);
        this.sharedService.updateUsuario(nombreUsuario);

        // Guardar en localStorage
        localStorage.setItem('fotoPerfil', fotoBase64);
        localStorage.setItem('usuario', nombreUsuario);
      }, (error) => {
        console.error('Error al obtener la información del perfil:', error);
      });
    }
  }
}
