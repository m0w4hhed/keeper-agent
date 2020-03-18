import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';
import { PopupService } from '../services/popup.service';
import { ToolService } from '../services/tool.service';
import { Pesanan } from '../services/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataPrint; task;
  appVersion;

  constructor(
    public userService: UserService,
    private router: Router,
    private dataService: DataService,
    private tool: ToolService,
    private popup: PopupService,
  ) {
    this.tool.getAppVersion().then(
      (ver) => this.appVersion = ver
    );
    this.task = this.dataService.getDatas<Pesanan>('ambilan', [{field: 'printed', comp: '==', value: false}])
    .subscribe(res => {
      this.dataPrint = res;
    });
  }

  settings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.popup.showAlertConfirm('Keluar', 'Yakin Ingin Log-Out?').then(
      (iya) => {
        if (iya) { this.userService.logout(); }
      }
    );
  }

}
