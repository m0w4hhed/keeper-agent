import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { PopupService } from 'src/app/services/popup.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ScannerService } from 'src/app/services/scanner.service';
import { Invoice } from 'src/app/services/interfaces';
import { ToolService } from 'src/app/services/tool.service';

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
    private tool: ToolService,
  ) {}

  updateResi(resi) {
    this.dataService.updateResi(this.data.id, {resi}).then(
      () => {
        this.editResi = false;
        this.popup.showToast('Resi berhasil diperbarui', 1000);
        this.afterEdit = true;
      },
      (error) => this.popup.showAlert('Resi gagal diperbarui', error)
    );
  }
  updateOngkir(ongkir, berat) {
    this.dataService.updateResi(this.data.id, {realOngkir: Number(ongkir), realBerat: Number(berat)}).then(
      () => {
        this.editOngkir = false;
        this.popup.showToast('Ongkir berhasil diperbarui', 1000);
        this.afterEdit = true;
        this.afterEditOngkir = true;
      },
      (error) => this.popup.showAlert('Ongkir gagal diperbarui', error)
    );
  }
  updateTgl(tgl) {
    const date = this.tool.formatTime(tgl);
    this.dataService.updateResi(this.data.id, {waktuDikirim: date}).then(
      () => {
        this.editTgl = false;
        this.popup.showToast('Tanggal kirim berhasil diperbarui', 1000);
      },
      (error) => this.popup.showAlert('Tanggal kirim gagal diperbarui', error)
    );
  }

  scan() {
    this.editResi = true;
    this.barcodeScanner.scan(this.scanner.settings).then(barcodeData => {
      this.inputResi = barcodeData.text;
    })
    .catch(err => {
      console.log('Error', err);
      this.popup.showToast('Error: ' + err, 3000);
    });
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

  ngOnInit() {
    this.inputTgl = this.data.waktuDikirim;
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
