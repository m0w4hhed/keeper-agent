import { PopupService } from './../../../services/popup.service';
import { DataService } from './../../../services/data.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DataToko } from 'src/app/services/interfaces';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-database-toko',
  templateUrl: './database-toko.page.html',
  styleUrls: ['./database-toko.page.scss'],
})
export class DatabaseTokoPage implements OnInit {

  addToko = false;
  addForm: FormGroup;

  loadToko = true;
  data_toko: any[]; task;
  requestToko: DataToko[];

  field: string; value: string;

  constructor(
    private modalCtrl: ModalController,
    private data: DataService,
    private popup: PopupService,
    private fb: FormBuilder,
  ) {
    this.addForm = this.fb.group({
      active: [true],
      jual: [[]],
      kode: ['', Validators.compose([Validators.required, Validators.pattern('^[a-z0-9]+$')])],
      nama: ['', Validators.compose([Validators.required])],
      lantai: ['', Validators.compose([Validators.required])],
      blok: ['', Validators.compose([Validators.required])],
      no: ['', Validators.compose([Validators.required])],
      hpDaftar: ['', Validators.compose([Validators.required])],
      hpKeep: ['', Validators.compose([Validators.required])]
    });
    this.task = this.data.getDataToko([{ field: 'active', comp: '==', value: true }]).subscribe(res => {
      this.loadToko = false;
      this.data_toko = res.map(x => ({ ...x, expand: false}));
    });
  }
  ngOnInit() {
  }

  async create(data: DataToko) {
    try {
      const success = await this.data.createDataToko(data);
      if (!success) { this.popup.showToast(`kode ${data.kode} sudah digunakan`, 1000); }
        else {
          this.addForm.reset();
          this.addToko = false;
          this.popup.showToast('Sukses tambah toko!', 1000);
        }
    } catch (err) { this.popup.showAlert('ERROR', err); }
  }
  
  cari(toko: string) {
    console.log('cari');
    if (toko.charAt(0) !== '#') {
      this.task = this.data.getDataToko([], {searchMode: {field: 'nama', searchText: toko}}).subscribe(res => {
        this.loadToko = false;
        this.data_toko = res.map(x => ({ ...x, expand: false}));
      });
    } else {
      const filter = toko.substring(1).split('=');
      this.filter(filter[0], filter[1]);
    }
  }
  filter(field: string, value: any) {
    const split = value.split(';');
    if (split[0] === 'string') { value = split[1]; }
    if (split[0] === 'number') { value = +split[1]; }
    if (split[0] === 'boolean') { value = (split[1] == true); }
    console.log(field, value);
    this.task = this.data.getDataToko([{ field, comp: '==', value }]).subscribe(res => {
      this.loadToko = false;
      this.data_toko = res.map(x => ({ ...x, expand: false}));
    });
  }

  update({ expand, ...toko }) {
    console.log(toko);
    this.data.updateDataToko(toko as DataToko).then(
      () => this.popup.showToast(`Toko ${toko.nama} berhasil dupudate!`, 1000),
      (err) => this.popup.showAlert(`Toko ${toko.nama} gagal dupudate!`, err)
    )
  }
  async delete(toko: DataToko) {
    const iya = await this.popup.showAlertConfirm('HAPUS TOKO', `Yakin mau hapus toko ${toko.nama}?`);
    if (iya) {
      this.data.updateDataToko(toko, true).then(
        () => this.popup.showToast(`Toko ${toko.nama} berhasil dihapus!`, 1000)
      )
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
