import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';
import { ScannerService } from 'src/app/services/scanner.service';
import { ModalController } from '@ionic/angular';

import { UpdateResiPage } from 'src/app/pages/resi/update-resi/update-resi.page';

@Component({
  selector: 'app-resi',
  templateUrl: 'resi.page.html',
  styleUrls: ['resi.page.scss'],
})
export class ResiPage {

  task;
  onLoad = false;

  encodedData: any;
  scannedData: string;

  salahOngkir = false;
  realOngkir;

  now;

  closingData: Observable<any>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
    private dataService: DataService,
    private popupService: PopupService,
    private modal: ModalController,
    ) {
    // this.encodedData = 'https://www.FreakyJolly.com';
  }

  tampilkan() {
    if (this.now) {
      this.onLoad = true;
      const tgl = moment(this.now).format('YYYYMMDD');
      this.closingData = this.dataService.getDatas(tgl);
      this.task = this.closingData.subscribe(() => this.onLoad = false);
    } else {
      this.popupService.showToast('Pilih Tanggal Dulu', 2000);
    }
  }

  async detailPaket(paket) {
    const modal = await this.modal.create({
      component: UpdateResiPage,
      componentProps: {
        data: paket
      }
    });
    return await modal.present();
  }

  reset() {
      this.popupService.showToast('Resi Diupdate!', 2000);
      this.scannedData = '';
      this.realOngkir = '';
      this.salahOngkir = false;
  }

  scan() {
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
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
