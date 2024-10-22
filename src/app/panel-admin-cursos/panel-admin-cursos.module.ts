import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelAdminCursosPageRoutingModule } from './panel-admin-cursos-routing.module';

import { PanelAdminCursosPage } from './panel-admin-cursos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelAdminCursosPageRoutingModule
  ],
  declarations: [PanelAdminCursosPage]
})
export class PanelAdminCursosPageModule {}
