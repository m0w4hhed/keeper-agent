import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-barang-masuk',
  templateUrl: 'barang-masuk.page.html',
  styleUrls: ['barang-masuk.page.scss'],
})
export class BarangMasukPage {

  task;
  onLoad = true;

  encodedData: any;
  scannedData: string;

  closingData: Observable<any>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
    private dataService: DataService,
    private popupService: PopupService
    ) {
    // this.encodedData = 'https://www.FreakyJolly.com';
    this.closingData = this.dataService.getDatas(this.dataService.getTime('YYYYMMDD'));
    this.task = this.closingData.subscribe(() => this.onLoad = false);
  }

  scanMassal() {
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
      if (barcodeData.text && barcodeData.text.length === 16) {
        const now = moment().toDate().getTime();
        this.dataService.updateResi(barcodeData.text, {
          status: 'Dikirim',
          tglDikirim: this.dataService.getTime('YYYYMMDD'),
          wktDikirim: now
        });
        this.popupService.showToast('Dikirim', 1000);
      } else {
        this.popupService.showAlert('Error!', 'Barcode Salah Bro!');
      }
    })
    .catch(err => {
      this.popupService.showAlert('Error: ', err);
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
