import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrintAmbilanPage } from './print-ambilan.page';
import { NgPipesModule } from 'ngx-pipes';

const routes: Routes = [
  {
    path: '',
    component: PrintAmbilanPage
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
  declarations: [PrintAmbilanPage]
})
export class PrintAmbilanPageModule {}
