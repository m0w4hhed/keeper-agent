import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { PopupService } from 'src/app/services/popup.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-update-resi',
  templateUrl: './update-resi.page.html',
  styleUrls: ['./update-resi.page.scss'],
})
export class UpdateResiPage implements OnInit {

  data;
  inputResi = '';
  inputOngkir;
  inputBerat;

  afterEdit = false;

  editResi = false;
  editOngkir = false;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
    private popup: PopupService,
    private barcodeScanner: BarcodeScanner,
    private scanner: ScannerService,
  ) {}

  updateResi(resi) {
    this.dataService.updateData(this.data.id, {resi});
    this.editResi = false;
    this.popup.showToast('Resi berhasil diperbarui', 2000);
    this.afterEdit = true;
  }
  updateOngkir(ongkir, berat) {
    this.dataService.updateData(this.data.id, {realOngkir: Number(ongkir), realBerat: Number(berat)});
    this.editOngkir = false;
    this.popup.showToast('Ongkir berhasil diperbarui', 2000);
    this.afterEdit = true;
  }

  scan() {
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
      this.inputResi = barcodeData.text;
    })
    .catch(err => {
      console.log('Error', err);
      this.popup.showToast('Error: ' + err, 3000);
    });
  }

  ngOnInit() {
  }
  dismiss() {
    if (this.afterEdit) {
      if (!this.data.realOngkir) {
        this.updateOngkir(this.data.totalOngkir, this.data.berat);
        this.popup.showToast('Perubahan disimpan', 2000);
      }
    }
    this.modalCtrl.dismiss();
  }
}
