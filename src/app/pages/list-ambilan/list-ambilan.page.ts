import { Component, OnInit } from '@angular/core';
import { DataService, Ambilan } from 'src/app/services/data.service';
import * as moment from 'moment';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-list-ambilan',
  templateUrl: './list-ambilan.page.html',
  styleUrls: ['./list-ambilan.page.scss'],
})
export class ListAmbilanPage implements OnInit {

  dataAmbilan: Ambilan[]; task;
  onload = true;

  now; tanggal;

  constructor(
    private dataService: DataService,
    private popup: PopupService,
  ) {
    this.tanggal = this.dataService.getTime('DD/MM YYYY');
    this.task = this.dataService.getAmbilan(this.dataService.getTime('YYYYMMDD')).subscribe(res => {
      this.onload = false;
      this.dataAmbilan = res;
    });
  }

  ngOnInit() {
  }

  tampilkan() {
    if (this.now) {
      this.onload = true;
      this.task.unsubscribe();
      const tgl = moment(this.now).format('YYYYMMDD');
      this.tanggal = moment(this.now).format('DD/MM YYYY');
      this.task = this.dataService.getAmbilan(tgl).subscribe(res => {
        this.onload = false;
        this.dataAmbilan = res;
      });
    } else {
      this.popup.showToast('Pilih Tanggal Dulu', 1000);
    }
  }

  hitung(barangToko: Ambilan[]): number {
    let total = 0;
    barangToko.forEach(barang => {
      if (barang.status === 'diambil') {
        total += barang.hargaBeli;
      }
    });
    return total;
  }
  addExpand(index: number, obj) {
    return { ...obj, expand: false };
  }

}
