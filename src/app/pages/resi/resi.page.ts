import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { PopupService } from '../../services/popup.service';

import * as moment from 'moment';
import { ScannerService } from 'src/app/services/scanner.service';
import { ModalController } from '@ionic/angular';

import { UpdateResiPage } from 'src/app/pages/resi/update-resi/update-resi.page';
import { Invoice } from 'src/app/services/interfaces';
import { ToolService } from 'src/app/services/tool.service';

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

  now; tanggal;

  closingData: Observable<any>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
    private dataService: DataService,
    private popupService: PopupService,
    private modal: ModalController,
    private tool: ToolService,
    ) {
      this.tanggal = this.dataService.getTime();
      const {startTime, endTime} = this.tool.getRangeTime(this.tool.getTime());
      this.closingData = this.dataService.getDatas<Invoice>(
        'keep', [{field: 'status', comp: '==', value: 'dikirim'}],
        false, {from: startTime, to: endTime}
      );
      this.task = this.closingData.subscribe(() => this.onLoad = false);
  }
  tampilkan() {
    this.onLoad = true;
    this.task.unsubscribe();
    const {startTime, endTime} = this.tool.getRangeTime(moment(this.now).unix());
    this.closingData = this.dataService.getDatas<Invoice>(
      'keep', [{field: 'status', comp: '==', value: 'dikirim'}],
      false, {from: startTime, to: endTime}
    );
    this.task = this.closingData.subscribe(() => this.onLoad = false);
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

  hitung(berat: number, ongkir?: number) {
    let hasil = Math.ceil(berat / 1000);
    if (ongkir) { hasil = hasil * ongkir; }
    return hasil;
  }
  hitungOngkir(data: Invoice[], real?: boolean) {
    let allOngkir = 0;
    data.forEach(invoice => {
      let ongkir = 0;
      real ? ongkir = invoice.realOngkir : ongkir = this.hitung(invoice.berat, invoice.ekspedisi.ongkir);
      allOngkir += ongkir;
    });
    return allOngkir;
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
