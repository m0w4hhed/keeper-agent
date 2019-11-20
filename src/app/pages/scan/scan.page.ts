import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';
import { ScannerService } from 'src/app/services/scanner.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss'],
})
export class ScanPage {

  task;
  onLoad = true;

  encodedData: any;
  scannedData: string;

  closingData: Observable<any>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
    private dataService: DataService,
    private popupService: PopupService,
    private alertController: AlertController,
    ) {
    // this.encodedData = 'https://www.FreakyJolly.com';
    this.closingData = this.dataService.getDatas(this.dataService.getTime('YYYYMMDD'));
    this.task = this.closingData.subscribe(() => this.onLoad = false);
  }

  scanMassal() {
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
      if (barcodeData.text && barcodeData.text.length === 16) {
        const now = moment().toDate().getTime();
        this.dataService.updateDikirim(barcodeData.text, {
          status: 'Dikirim',
          tglDikirim: this.dataService.getTime('YYYYMMDD'),
          wktDikirim: now
        });
      }
    })
    .catch(err => {
      this.popupService.showAlert('Error: ', err);
    });
  }
  async scanManual() {
    const alert = await this.alertController.create({
      header: 'Scan Manual',
      mode: 'ios',
      inputs: [{
        name: 'id', type: 'text',
        placeholder: 'Masukkan ID Invoice Disini',
        min: 16, max: 16
        },
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => { }
      }, {
        text: 'Kirim!',
        cssClass: 'tertiary',
        handler: (data) => {
          if (data.id && data.id.length === 16) {
            const now = moment().toDate().getTime();
            this.dataService.updateDikirim(data.id, {
              status: 'Dikirim',
              tglDikirim: this.dataService.getTime('YYYYMMDD'),
              wktDikirim: now
            });
          } else {
            this.popupService.showAlert('Salah!', 'Barcode Salah Tulis Bro!');
          }
          console.log(data.id);
        }
      }]
    });
    await alert.present();
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
