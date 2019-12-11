import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListAmbilanPage } from './list-ambilan.page';
import { NgPluckPipeModule, NgGroupByPipeModule, NgOrderByPipeModule, NgFlattenPipeModule } from 'angular-pipes';

const routes: Routes = [
  {
    path: '',
    component: ListAmbilanPage
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
    NgOrderByPipeModule,
  ],
  declarations: [ListAmbilanPage]
})
export class ListAmbilanPageModule {}
