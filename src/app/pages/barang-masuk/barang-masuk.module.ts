import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BarangMasukPage } from './barang-masuk.page';
import { NgPipesModule } from 'ngx-pipes';

const routes: Routes = [
  {
    path: '',
    component: BarangMasukPage
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
  declarations: [BarangMasukPage]
})
export class BarangMasukPageModule {}
