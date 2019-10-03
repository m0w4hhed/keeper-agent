import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgPipesModule } from 'ngx-pipes';

import { IonicModule } from '@ionic/angular';

import { BarangMasukPage } from './barang-masuk.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [BarangMasukPage]
})
export class BarangMasukPageModule {}
