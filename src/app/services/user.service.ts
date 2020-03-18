import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as firebase from 'firebase';
import { PopupService } from './popup.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserConfig } from './interfaces';

export interface User {
  access: string[];
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<User>;
  config$: BehaviorSubject<UserConfig>; task;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private zone: NgZone,
    private popup: PopupService,
    private afs: AngularFirestore
  ) {
    this.config$ = new BehaviorSubject({} as UserConfig);
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.collection('admins').doc<User>(user.uid).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
          this.popup.showToast('Anda harus login dulu', 700);
          this.saveRouteTo('/login');
        }
      });
    });
  }
  saveRouteTo(page: string) {
    this.zone.run(async () => {
      this.router.navigate([page]);
    });
  }

  logout() {
    console.log('[USR] Log-out');
    this.user$ = of(null);
    return this.afAuth.auth.signOut();
  }
  async loginWithEmail(username: string, password: string) {
    try {
      console.log('login as ', username, ' & ', password);
      return await firebase.auth().signInWithEmailAndPassword(username + '@keeper.com', password);
    } catch (error) {
      throw error;
    }
  }

  getUserData() {
    return this.user$;
  }
  getConfig() {
    console.log('[USR] Get Config');
    this.task = this.afs.collection('configs').doc<UserConfig>('user_config').valueChanges().subscribe(res => {
      console.log('[USR] Config Subscribed');
      this.config$.next(res);
    });
  }
  updateConfig(field: string, value: string) {
    return this.afs.collection('configs').doc('user_config').update({ [field]: value });
  }

  onDestroy() {
    this.task.unsubscribe();
  }
}
