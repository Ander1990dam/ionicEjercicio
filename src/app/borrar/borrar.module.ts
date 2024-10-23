import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BorrarPageRoutingModule } from './borrar-routing.module';

import { BorrarPage } from './borrar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BorrarPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [BorrarPage],
})
export class BorrarPageModule {}
