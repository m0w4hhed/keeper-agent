import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';
import { ScannerService } from 'src/app/services/scanner.service';
import { AlertController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { Invoice } from 'src/app/services/interfaces';

@Component({
  selector: 'app-barang-keluar',
  templateUrl: 'barang-keluar.page.html',
  styleUrls: ['barang-keluar.page.scss'],
})
export class BarangKeluarPage {

  task;
  onload = true;

  encodedData: any;
  scannedData: string;

  closingData: Invoice[];
  olahdataExist: Observable<boolean>;

  now; tanggal;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
    private dataService: DataService,
    private popupService: PopupService,
    private alertController: AlertController,
    private tool: ToolService,
    ) {
    this.tanggal = this.dataService.getTime('DD');
    const {startTime, endTime} = this.tool.getRangeTime(this.tool.getTime());
    // this.task = this.dataService.getDatas<Invoice>(
    //   'keep', [{field: 'status', comp: '==', value: 'dikirim'}],
    //   false, {from: startTime, to: endTime}
    // ).subscribe(res => {
    //   this.onload = false;
    //   this.closingData = res;
    // });
    this.olahdataExist = this.dataService.olahdataExist(moment(this.now).format('YYYYMMDD'), 'keluar');
  }

  tampilkan() {
    this.onload = true;
    this.task.unsubscribe();
    const {startTime, endTime} = this.tool.getRangeTime(moment(this.now).unix());
    // console.log(startTime, endTime);
    this.tanggal = moment(this.now).format('DD');
    // this.task = this.dataService.getDatas<Invoice>(
    //   'keep', [{field: 'status', comp: '==', value: 'dikirim'}],
    //   false, {from: startTime, to: endTime}
    // ).subscribe(res => {
    //   this.onload = false;
    //   this.closingData = res;
    // });
    this.olahdataExist = this.dataService.olahdataExist(moment(this.now).format('YYYYMMDD'), 'keluar');
  }

  scanMassal() {
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
      if (barcodeData.text && barcodeData.text.length === 12) {
        const now = this.tool.getTime();
        this.dataService.updateInvoice(barcodeData.text, {
          status: 'dikirim',
          waktuDikirim: now
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
        cssClass: 'primary',
        handler: (data) => {
          data.id = data.id.trim();
          if (data.id && data.id.length === 12) {
            const now = moment().toDate().getTime();
            this.dataService.updateInvoice(data.id, {
              status: 'dikirim',
              waktuDikirim: this.tool.getTime(),
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
  rekap() {
    this.popupService.showAlertConfirm('REKAP', 'Apakah semua data barang keluar sudah valid?').then(
      (yes) => {
        if (yes) {
          this.dataService.olahData(this.closingData, 'keluar', moment(this.now).format('YYYYMMDD')).then(
            () => this.popupService.showToast('Berhasil rekapan!', 1000),
            (err) => this.popupService.showAlert('ERROR REKAP', err)
          );
        }
      }
    );
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
