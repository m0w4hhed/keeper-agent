import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpdateResiPage } from './update-resi.page';
import { NgPluckPipeModule, NgSumPipeModule } from 'angular-pipes';

const routes: Routes = [
  {
    path: '',
    component: UpdateResiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgPluckPipeModule,
    NgSumPipeModule,
  ],
  declarations: [UpdateResiPage]
})
export class UpdateResiPageModule {}
