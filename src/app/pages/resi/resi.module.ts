import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgPipesModule } from 'ngx-pipes';

import { IonicModule } from '@ionic/angular';

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
    NgPipesModule
  ],
  declarations: [ResiPage]
})
export class ResiPageModule {}
