import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgPipesModule } from 'ngx-pipes';

import { UpdateResiPage } from './update-resi.page';

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
    NgPipesModule,
  ],
  declarations: [UpdateResiPage]
})
export class UpdateResiPageModule {}
