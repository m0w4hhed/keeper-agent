import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as firebase from 'firebase';
import { PopupService } from './popup.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface User {
  access: string[];
  kode: string;
  nama: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: Observable<User>;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private zone: NgZone,
    private popup: PopupService,
    private afs: AngularFirestore
    ) {
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.collection('admin').doc<User>(user.uid).valueChanges();
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
    this.user = of(null);
    return this.afAuth.auth.signOut();
  }

  async loginWithEmail(username: string, password: string) {
    try {
      console.log('login as ', username, ' & ', password);
      return await firebase.auth().signInWithEmailAndPassword(username + '@nabiilah.com', password);
      // if (userdata) {
      //   console.log('login');
      //   this.popup.showToast('Berhasil masuk sebagai ' + userdata.user.email, 700);
      // }
    } catch (error) {
      throw error;
      this.popup.showAlert('Error!', error);
    }
  }

  getUserData() {
    return this.user;
  }
}
