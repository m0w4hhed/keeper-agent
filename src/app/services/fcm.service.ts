import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private fcm: FCM,
    private afs: AngularFirestore,
    private platform: Platform,
    private router: Router,
  ) { }

  subscribeTo(topic: string) {
    return this.fcm.subscribeToTopic(topic);
  }
  async landingTo(route: string, str?: string) {
    console.log('LANDING TO:', route);
    const nav = str ? [route, str] : [route];
    return await this.router.navigate(nav);
  }

  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.fcm.getToken();
    }
    if (this.platform.is('ios')) {
      token = await this.fcm.getToken();
    }
    this.saveToken(token);
  }
  saveToken(token) {
    if (!token) { return; }
    return this.afs.collection('devices').doc(token).set({token});
  }

  onNotifications() {
    return this.fcm.onNotification();
  }
  onTokenRefresh() {
    return this.fcm.onTokenRefresh();
  }
}
