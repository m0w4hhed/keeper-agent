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

  inputResi;
  inputOngkir;
  inputBerat;
  inputTgl;

  afterEdit = false;
  afterEditOngkir = false;

  editResi = false;
  editOngkir = false;
  editTgl = false;

  constructor(
    public modalCtrl: ModalController,
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
    this.afterEditOngkir = true;
  }
  updateTgl(tgl) {
    this.dataService.updateData(this.data.id, {tglDikirim: tgl.trim()});
    this.editTgl = false;
    this.popup.showToast('Tanggal kirim berhasil diperbarui', 2000);
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
    this.inputTgl = this.data.tglDikirim;
    this.inputOngkir = this.data.totalOngkir;
    this.inputBerat = this.data.berat;
    if (this.data.resi) {
      this.inputResi = this.data.resi;
    }
  }
  dismiss() {
    if (this.afterEdit) {
      if (!this.afterEditOngkir) {
        this.updateOngkir(this.data.totalOngkir, this.data.berat);
        this.popup.showToast('Perubahan disimpan', 2000);
      }
    }
    this.modalCtrl.dismiss();
  }
}
