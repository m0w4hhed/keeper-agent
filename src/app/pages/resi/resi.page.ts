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
      this.popupService.showToast('Pilih Tanggal Dulu');
    }
  }

  updateResi(iid: string) {
    const now = moment().toDate().getTime();
    if (this.scannedData) {
      this.dataService.updateData(iid, {
        status: 'Resi',
        wktResi: now,
        resi: this.scannedData
      });
      this.popupService.showToast('Resi Diupdate!');
      this.scannedData = '';
    }
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
      this.popupService.showToast('Error: ' + err);
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
