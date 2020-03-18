import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';
import { ScannerService } from 'src/app/services/scanner.service';
import { AlertController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { Observable } from 'rxjs';
import { Pesanan } from 'src/app/services/interfaces';

@Component({
  selector: 'app-barang-masuk',
  templateUrl: 'barang-masuk.page.html',
  styleUrls: ['barang-masuk.page.scss'],
})
export class BarangMasukPage {

  dataAmbilan: Pesanan[]; task;
  onload = true; onrekap = false;
  olahdataExist: Observable<boolean>;

  now; tanggal;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
    private dataService: DataService,
    private popup: PopupService,
    private alertController: AlertController,
    public tool: ToolService,
    ) {
    this.tanggal = this.dataService.getTime('DD');
    const {startTime, endTime} = this.tool.getRangeTime(this.tool.getTime());
    // console.log(startTime, endTime);
    // this.task = this.dataService.getDatas<Pesanan>(
    //   'ambilan',
    //   [{field: 'printed', comp: '==', value: true}],
    //   false, {from: startTime, to: endTime}
    // ).subscribe(res => {
    //   this.onload = false;
    //   this.dataAmbilan = res;
    //   // console.log(res);
    // });
    this.olahdataExist = this.dataService.olahdataExist(moment(this.now).format('YYYYMMDD'), 'masuk');
  }

  tampilkan() {
    if (this.now) {
      this.onload = true;
      this.task.unsubscribe();
      const {startTime, endTime} = this.tool.getRangeTime(moment(this.now).unix());
      // console.log(startTime, endTime);
      this.tanggal = moment(this.now).format('DD');
      // this.task = this.dataService.getDatas<Pesanan>(
      //   'ambilan',
      //   [{field: 'printed', comp: '==', value: true}],
      //   false, {from: startTime, to: endTime}
      // ).subscribe(res => {
      //   this.onload = false;
      //   this.dataAmbilan = res;
      // });
      this.olahdataExist = this.dataService.olahdataExist(moment(this.now).format('YYYYMMDD'), 'masuk');
    } else {
      this.popup.showToast('Pilih Tanggal Dulu', 1000);
    }
  }

  rekap() {
    const tanggal = moment(this.now).format('YYYYMMDD');
    this.onrekap = true;
    const belumStatus = this.dataAmbilan.filter(barang => barang.statusKeep === 'keep');
    this.popup.showAlertConfirm('REKAP', 'Semua status barang dari <b>keep</b> akan menjadi <b>kosong</>, lanjut rekapan?').then(
      (yes) => {
        if (yes) {
          try {
            this.dataService.updateAllAmbilan(belumStatus, {
              statusKeep: 'kosong',
              wktScan: this.tool.getTime()
            }).then(() => this.onrekap = false);
            this.dataService.olahData(this.dataAmbilan, 'masuk', tanggal).then(
              () => {this.onrekap = false; this.popup.showToast('Rekap berhasil!', 1000); }
            );
          } catch (err) {
            this.onrekap = false;
            this.popup.showAlert('ERROR UPDATE', err);
          }
        }
      }
    );
  }
  scanMassal() {
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
      this.barangDiambil(barcodeData.text);
    })
    .catch(err => {
      this.popup.showAlert('Error Camera: ', err);
    });
  }

  barangDiambil(barcode: string) {
    if (barcode && barcode.length === 17) {
      this.dataService.updateAmbilan(barcode, {
        statusKeep: 'diambil',
        wktScan: this.tool.getTime()
      }).then(
        () => this.popup.showToast('Barang Diambil!', 1000),
        (err) => this.popup.showAlert('Barcode Salah!', err)
      );
    } else {
      this.popup.showAlert('Barcode Error!', 'Barcode terlalu panjang / pendek');
    }
  }
  gantiStatus(barang: Pesanan, statusKeep: string) {
    const data = {
      statusKeep,
      wktScan: this.tool.getTime(),
      printed: true
    };
    // if (statusKeep === 'fullkeep') { data.printed = false; }
    this.dataService.updateAmbilan(barang.barcode, data).then(
      () => this.popup.showToast(`Barang ${statusKeep}!`, 1000),
      (err) => this.popup.showAlert('Barcode Salah!', err)
    );
  }

  hitungDiambil(barangToko: Pesanan[]): {total: number, jumlah: number} {
    let total = 0;
    let jumlah = 0;
    barangToko.forEach(barang => {
      if (barang.statusKeep === 'diambil') {
        total += barang.hargaBeli;
        jumlah++;
      }
    });
    return {total, jumlah};
  }
  addExpand(index: number, obj) {
    return { ...obj, expand: true };
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
