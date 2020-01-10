import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { DataService, Ambilan } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';
import { ScannerService } from 'src/app/services/scanner.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-barang-masuk',
  templateUrl: 'barang-masuk.page.html',
  styleUrls: ['barang-masuk.page.scss'],
})
export class BarangMasukPage {

  dataAmbilan: Ambilan[]; task;
  onload = true;

  now; tanggal;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
    private dataService: DataService,
    private popup: PopupService,
    private alertController: AlertController,
    ) {
    this.tanggal = this.dataService.getTime('DD');
    this.task = this.dataService.getAmbilan(this.dataService.getTime('YYYYMMDD').toString()).subscribe(res => {
      this.onload = false;
      this.dataAmbilan = res;
    });
  }

  test() {
    console.log(this.now);
  }
  tampilkan() {
    if (this.now) {
      this.onload = true;
      this.task.unsubscribe();
      const tgl = moment(this.now).format('YYYYMMDD');
      this.tanggal = moment(this.now).format('DD');
      this.task = this.dataService.getAmbilan(tgl).subscribe(res => {
        this.onload = false;
        this.dataAmbilan = res;
      });
    } else {
      this.popup.showToast('Pilih Tanggal Dulu', 1000);
    }
  }

  scanMassal() {
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
      this.barangDiambil(barcodeData.text);
    })
    .catch(err => {
      this.popup.showAlert('Error Camera: ', err);
    });
  }
  async scanManual() {
    const alert = await this.alertController.create({
      header: 'Scan Manual',
      mode: 'ios',
      inputs: [{
        name: 'id', type: 'text',
        placeholder: 'Masukkan Barcode barang disini',
        min: 16, max: 16
        },
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => { }
      }, {
        text: 'Masuk!',
        cssClass: 'tertiary',
        handler: (data) => {
          this.barangDiambil(data.id);
        }
      }]
    });
    await alert.present();
  }

  barangDiambil(barcode: string) {
    if (barcode && barcode.length === 18) {
      const now = moment().toDate().getTime();
      this.dataService.updateAmbilan(barcode, {
        status: 'diambil',
        tglScan: this.dataService.getTime('YYYYMMDD'),
        wktScan: now
      }).then(
        () => this.popup.showToast('Barang Diambil!', 1000),
        (err) => this.popup.showAlert('Barcode Salah!', err)
      );
    } else {
      this.popup.showAlert('Barcode Error!', 'Barcode terlalu panjang / pendek');
    }
  }

  gantiStatus(barang: Ambilan, status: string) {
    const now = moment().toDate().getTime();
    this.dataService.updateAmbilan(barang.id, {
      status,
      tglScan: this.dataService.getTime('YYYYMMDD'),
      wktScan: now
    }).then(
      () => this.popup.showToast(`Barang ${status}!`, 1000),
      (err) => this.popup.showAlert('Barcode Salah!', err)
    );
  }

  hitungDiambil(barangToko: Ambilan[]): number {
    let total = 0;
    barangToko.forEach(barang => {
      if (barang.status === 'diambil') {
        total += barang.hargaBeli;
      }
    });
    return total;
  }
  addExpand(index: number, obj) {
    return { ...obj, expand: false };
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
