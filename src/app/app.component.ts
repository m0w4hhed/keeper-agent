import { UserService } from './services/user.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FcmService } from './services/fcm.service';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private userService: UserService,
    private fcmService: FcmService,
    private popup: PopupService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkPermission();
      this.userService.getConfig();
      this.notificationSetup();
    });
  }
  
  private notificationSetup() {
    // this.fcmService.getToken();
    this.fcmService.subscribeTo('pendaftaran_keeper');
    this.fcmService.subscribeTo('pembayaran_keeper');
    this.fcmService.subscribeTo('pengambilan_keeper');
    this.fcmService.onNotifications().subscribe((data) => {
      console.log(data);
      if (data.wasTapped) {
        // Received in background
        console.log(data);
        data.landing_page ? this.fcmService.landingTo(data.landing_page) : console.log();
      } else {
        // Received in foreground
        console.log(data);
        if (data.image) {
          this.popup.showImage(data.title, data.body, data.image);
        } else {
          this.popup.showAlert(data.title, data.body);
        }
      }
    });
    this.fcmService.onTokenRefresh().subscribe(token => this.fcmService.saveToken(token));
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('CAMERA PERMIT?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('FILE PERMIT?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );
  }
  

}
