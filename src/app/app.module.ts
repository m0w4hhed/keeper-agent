import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Printer } from '@ionic-native/printer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { UpdateResiPageModule } from 'src/app/pages/resi/update-resi/update-resi.module';
import { BarangMasukPageModule } from 'src/app/pages/barang-masuk/barang-masuk.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { PrintAmbilanPageModule } from './pages/list-ambilan/print-ambilan/print-ambilan.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    // Page Modules
    UpdateResiPageModule,
    BarangMasukPageModule,
    PrintAmbilanPageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileOpener,
    Printer,
    AndroidPermissions,
    AppVersion,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
