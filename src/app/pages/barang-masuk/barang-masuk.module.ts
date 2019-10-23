import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BarangMasukPage } from './barang-masuk.page';
import { NgPluckPipeModule, NgFlattenPipeModule, NgGroupByPipeModule } from 'angular-pipes';

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
    NgPluckPipeModule,
    NgFlattenPipeModule,
    NgGroupByPipeModule,
  ],
  declarations: [BarangMasukPage]
})
export class BarangMasukPageModule {}
