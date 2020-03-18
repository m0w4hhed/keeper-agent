import { PopupService } from './../../services/popup.service';
import { UserService } from './../../services/user.service';
import { Observable } from 'rxjs';
import { DatabaseTokoPage } from './database-toko/database-toko.page';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserConfig, DataToko } from 'src/app/services/interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  USER_CONFIG: UserConfig; task;
  onLoad = true;
  loadToko = true;
  requestToko: DataToko[]; task2;

  constructor(
    private modalCtrl: ModalController,
    private data: DataService,
    private popup: PopupService,
    private userService: UserService,
  ) {
    this.task = this.userService.config$.subscribe(res => {
      console.log('[SET] Get User Config')
      this.onLoad = false;
      this.USER_CONFIG = res;
    });
    this.task2 = this.data.getDataToko([{ field: 'active', comp: '==', value: false }]).subscribe(res => {
      this.loadToko = false;
      this.requestToko = res;
    });
  }
  ngOnInit() {
  }

  async openDatabase() {
    const modal = await this.modalCtrl.create({
      component: DatabaseTokoPage,
      componentProps: {
        // data_toko: this.USER_CONFIG.data_toko,
        requestToko: this.requestToko
      }
    });
    return await modal.present();
  }

  async editConfig(field: string) {
    const result = await this.popup.showAlertInput(`UPDATE ${field.toUpperCase()}`, `Isi value <b>${field}</b> yang baru dibawah ini:`, {okBtn: 'UPDATE', inputType: 'number'});
    if (result) {
      this.userService.updateConfig(field, result).then(
        () => this.popup.showToast(`${field} berhasil diperbarui`, 1000),
        (err) => this.popup.showToast(`Gagal memperbarui ${field}!`, 1000)
      );
    }
  }

}
