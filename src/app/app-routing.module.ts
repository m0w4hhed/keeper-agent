import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserService } from './services/user.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [UserService]},
  { path: 'barang-keluar', loadChildren: './pages/barang-keluar/barang-keluar.module#BarangKeluarPageModule', canActivate: [UserService] },
  { path: 'resi', loadChildren: './pages/resi/resi.module#ResiPageModule', canActivate: [UserService] },
  { path: 'update-resi', loadChildren: './pages/resi/update-resi/update-resi.module#UpdateResiPageModule', canActivate: [UserService] },
  { path: 'barang-masuk', loadChildren: './pages/barang-masuk/barang-masuk.module#BarangMasukPageModule', canActivate: [UserService] },
  { path: 'list-ambilan', loadChildren: './pages/list-ambilan/list-ambilan.module#ListAmbilanPageModule', canActivate: [UserService] },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'print-ambilan', loadChildren: './pages/list-ambilan/print-ambilan/print-ambilan.module#PrintAmbilanPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },  { path: 'database-toko', loadChildren: './pages/settings/database-toko/database-toko.module#DatabaseTokoPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
