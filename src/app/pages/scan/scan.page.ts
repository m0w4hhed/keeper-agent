import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss'],
})
export class ScanPage {

  encodedData: any;
  scannedData: string;

  task;
  closingData: Observable<any>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataService: DataService,
    private popupService: PopupService
    ) {
    // this.encodedData = 'https://www.FreakyJolly.com';
    this.closingData = this.dataService.getDatas(this.dataService.getTime('YYYYMMDD'));
  }

  scanMassal() {
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
      const now = moment().toDate().getTime();
      this.dataService.updateData(barcodeData.text, {
        status: 'Dikirim',
        wktDikirim: now,
        tglDikirim: this.dataService.getTime('YYYYMMDD')
      });
      this.popupService.showToast('Barang Dikirim!');
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
