import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ApiService } from '../servicios/api-service.service';
import { AppComponent } from '../app.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private photoSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private navCtrl: NavController, private apiService: ApiService) {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      clave: ['', [Validators.required]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { usuario, clave } = this.loginForm.value;
      this.apiService.putLogin(usuario, clave).subscribe({
        next: (resp) => {
          localStorage.setItem('userId', resp.userId);
          localStorage.setItem('rol', resp.rol);
          localStorage.setItem('fotoPerfil', 'http://44.219.93.34:8000'+ resp.fotoPerfil);
          localStorage.setItem('usuario', resp.usuario);
          this.loginForm.reset()
          this.apiService.usuario = resp.usuario
          this.apiService.isLogin = true;
          this.navCtrl.navigateForward('/inicio');

        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

}
