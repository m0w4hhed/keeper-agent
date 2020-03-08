import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserService } from './services/user.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [UserService]},
  { path: 'scan', loadChildren: './pages/scan/scan.module#ScanPageModule', canActivate: [UserService] },
  { path: 'resi', loadChildren: './pages/resi/resi.module#ResiPageModule', canActivate: [UserService] },
  { path: 'update-resi', loadChildren: './pages/resi/update-resi/update-resi.module#UpdateResiPageModule', canActivate: [UserService] },
  { path: 'barang-masuk', loadChildren: './pages/barang-masuk/barang-masuk.module#BarangMasukPageModule', canActivate: [UserService] },
  { path: 'list-ambilan', loadChildren: './pages/list-ambilan/list-ambilan.module#ListAmbilanPageModule', canActivate: [UserService] },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },  { path: 'print-ambilan', loadChildren: './pages/list-ambilan/print-ambilan/print-ambilan.module#PrintAmbilanPageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
