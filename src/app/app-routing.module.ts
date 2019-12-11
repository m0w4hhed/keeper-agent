import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'scan', loadChildren: './pages/scan/scan.module#ScanPageModule' },
  { path: 'resi', loadChildren: './pages/resi/resi.module#ResiPageModule' },
  { path: 'update-resi', loadChildren: './pages/resi/update-resi/update-resi.module#UpdateResiPageModule' },
  { path: 'barang-masuk', loadChildren: './pages/barang-masuk/barang-masuk.module#BarangMasukPageModule' },
  { path: 'list-ambilan', loadChildren: './pages/list-ambilan/list-ambilan.module#ListAmbilanPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
