import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgPipesModule } from 'ngx-pipes';

import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../modules/material.module';

import { UpdateResiPage } from '../update-resi/update-resi.page';
import { ResiPage } from './resi.page';

const routes: Routes = [
  {
    path: '',
    component: ResiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgPipesModule,
    MaterialModule,
  ],
  declarations: [
    UpdateResiPage,
    ResiPage,
  ],
  entryComponents: [
    UpdateResiPage,
  ]
})
export class ResiPageModule {}
