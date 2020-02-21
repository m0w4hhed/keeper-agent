import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showpass: boolean;
  email: string;
  pass: string;

  onlogin = false;

  constructor(
    private userS: UserService,
    private popup: PopupService
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userS.saveRouteTo('/home');
      }
    });
    this.showpass = false;
   }

  ngOnInit() {
  }

  showpas() {
    this.showpass = !this.showpass;
  }

  login() {
    this.onlogin = true;
    this.userS.loginWithEmail(this.email, this.pass).then(
      (user) => {
        this.onlogin = false;
        this.popup.showToast(`berhasil login sebagai ${user.user.email}`, 1000);
      },
      (error) => {
        this.popup.showAlert('Login Gagal', error);
        this.onlogin = false;
      }
    );
  }

}
