import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';

@Component({
  selector: 'app-resi',
  templateUrl: 'resi.page.html',
  styleUrls: ['resi.page.scss'],
})
export class ResiPage {

  encodedData: any;
  scannedData: string;

  salahOngkir = false;
  realOngkir;

  now;

  task;
  closingData: Observable<any>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataService: DataService,
    private popupService: PopupService
    ) {
    // this.encodedData = 'https://www.FreakyJolly.com';
  }

  tampilkan() {
    if (this.now) {
      const tgl = moment(this.now).format('YYYYMMDD');
      this.closingData = this.dataService.getDatas(tgl);
    } else {
      this.popupService.showToast('Pilih Tanggal Dulu', 2000);
    }
  }

  updateResi(item) {
    if (this.scannedData) {
      if (!this.salahOngkir) {
        this.dataService.updateData(item.id, {
          resi: this.scannedData,
          realOngkir: Number(item.ongkir)
        });
        this.reset();
      } else {
        const real = this.realOngkir.toString().trim().replace(/[^0-9]/g, '');
        this.dataService.updateData(item.id, {
          resi: this.scannedData,
          realOngkir: Number(real)
        });
        this.reset();
      }
    }
  }

  reset() {
      this.popupService.showToast('Resi Diupdate!', 2000);
      this.scannedData = '';
      this.realOngkir = '';
      this.salahOngkir = false;
  }

  scan() {
    this.barcodeScanner.scan(
      {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt : 'Scan barcode barang keluarnya bos', // Android
        resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
      }
    ).then(barcodeData => {
      this.scannedData = barcodeData.text;
    })
    .catch(err => {
      console.log('Error', err);
      this.popupService.showToast('Error: ' + err, 3000);
    });
  }

  /*
  encodedText() {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodedData)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodedData = encodedData;
        },
        err => {
          console.log('Error occured : ' + err);
        }
      );
  }
  */

  onDestroy() {
    this.task.unsubscribe();
  }

}
