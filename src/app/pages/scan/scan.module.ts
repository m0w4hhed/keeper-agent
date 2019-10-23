import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScanPage } from './scan.page';
import { NgPluckPipeModule, NgGroupByPipeModule, NgOrderByPipeModule, NgFlattenPipeModule } from 'angular-pipes';

const routes: Routes = [
  {
    path: '',
    component: ScanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgPluckPipeModule,
    NgGroupByPipeModule,
    NgOrderByPipeModule,
    NgFlattenPipeModule,
  ],
  declarations: [ScanPage]
})
export class ScanPageModule {}
