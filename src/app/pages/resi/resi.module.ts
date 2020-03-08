import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../modules/material.module';

import { ResiPage } from './resi.page';
import { NgPipesModule } from 'ngx-pipes';

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
    MaterialModule,
    NgPipesModule,
  ],
  declarations: [
    ResiPage,
  ]
})
export class ResiPageModule {}
