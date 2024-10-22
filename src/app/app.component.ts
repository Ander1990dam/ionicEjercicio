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
  public appPages: any[] = [];
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

    const rol = localStorage.getItem('rol');
    if (rol) {
      this.sharedService.updateAppPages(rol);
    } else {
      this.sharedService.updateAppPages('default');
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.sharedService.fotoPerfil$.subscribe((foto) => {
        this.fotoPerfilUrl = foto;
      }),
      this.sharedService.usuario$.subscribe((usuario) => {
        this.usuario = usuario;
      }),
      this.sharedService.appPages$.subscribe((pages) => {
        this.appPages = pages;
      })
    );

    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.getInfoPerfil();
      })
    );

    const savedFoto = localStorage.getItem('fotoPerfil');
    if (savedFoto) {
      const fotoParsed = this.apiService.getApiUrl() + savedFoto;
      this.sharedService.updateFotoPerfil(fotoParsed);
    }

    const savedUsuario = localStorage.getItem('usuario');
    if (savedUsuario) {
      this.sharedService.updateUsuario(savedUsuario);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.apiService.isLogin = false;
    localStorage.clear();
    this.sharedService.clearUserData();
    this.router.navigateByUrl("/login");
  }

  getInfoPerfil(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.apiService.getInfoPerfil(+userId).subscribe((response) => {
        const fotoBase64 = (this.apiService.getApiUrl() + response.fotoPerfil).replace('ws/', '');
        const nombreUsuario = response.usuario;

        this.sharedService.updateFotoPerfil(fotoBase64);
        this.sharedService.updateUsuario(nombreUsuario);

        localStorage.setItem('fotoPerfil', fotoBase64);
        localStorage.setItem('usuario', nombreUsuario);
        console.log(nombreUsuario)

        const rol = localStorage.getItem('rol');
        if (rol) {
          this.sharedService.updateAppPages(rol);
        }
      }, (error) => {
        console.error('Error al obtener la información del perfil:', error);
      });
    }
  }
}
