import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { DataService } from 'src/app/services/data.service';
import { PopupService } from 'src/app/services/popup.service';
import { ToolService } from 'src/app/services/tool.service';
import { PdfService } from 'src/app/services/pdf.service';

import { GroupByPipe } from 'ngx-pipes';

import { PrintAmbilanPage } from './print-ambilan/print-ambilan.page';
import { Pesanan } from 'src/app/services/interfaces';

@Component({
  selector: 'app-list-ambilan',
  templateUrl: './list-ambilan.page.html',
  styleUrls: ['./list-ambilan.page.scss'],
  providers: [GroupByPipe]
})
export class ListAmbilanPage implements OnInit {

  dataPrint: Pesanan[]; task;
  selectedPrint: Pesanan[] = [];
  onload = true;
  onPrint = false;

  constructor(
    private dataService: DataService,
    private popup: PopupService,
    public tool: ToolService,
    private pdf: PdfService,
    private modal: ModalController,
    private groupBy: GroupByPipe,
  ) {
    this.task = this.dataService.getDatas<Pesanan>('ambilan', [{field: 'printed', comp: '==', value: false}])
    .subscribe(res => {
      this.onload = false;
      this.dataPrint = res;
      this.selectedPrint = this.updateChecked(res);
      console.log(this.selectedPrint);
    });
  }
  ngOnInit() {
  }

  async openPrintAmbilan() {
    const printModal = await this.modal.create({
      component: PrintAmbilanPage
    });
    return printModal.present();
  }
  async print() {
    if (this.selectedPrint.length <= 500) {
      this.onPrint = true;
      this.pdf.createPDFLabel(this.selectedPrint, {statusPrint: 'ambilan'}).then(
        (fileDir) => {
          this.onPrint = false;
          this.popup.showToast(`PDF Label berhasil dibuat!`, 1000);
          const copyAmbilan = [].concat(this.selectedPrint);
          this.pdf.createPDFNota(this.groupBy.transform(copyAmbilan, 'toko')).then(
            (fileDir2) => {
              this.popup.showToast(`PDF Nota berhasil dibuat!`, 1000);
              this.dataService.updateAllAmbilan(this.selectedPrint, { waktuPrint: this.tool.getTime(), printed: true }).then(
                (e) => {},
                (err) => this.popup.showAlert('INTERNET BERMASALAH', err)
              );
            },
            (err) => this.popup.showAlert('ERROR WRITE NOTA', err)
          );
        },
        (err) => {
          this.onPrint = false;
          this.popup.showAlert('ERROR WRITE AMBILAN', err);
        }
      );
    } else {
      this.popup.showAlert('BATAS AMBILAN TERCAPAI', 'Seleksi print ambilan maksimal 500 pcs!');
    }
  }

  selectAll(all: boolean) {
    this.selectedPrint = [];
    if (all) {
      this.dataPrint.forEach(x => {
        this.selectedPrint.push(x);
      });
    }
  }
  selectPrint(event, data: Pesanan) {
   if (event.target.checked === true) {
      if (!this.selectedPrint.includes(data)) {
        this.selectedPrint.push(data);
      }
    } else {
      const newArray = this.selectedPrint.filter((el) => {
        return el.barcode !== data.barcode;
      });
      this.selectedPrint = newArray;
   }
  }
  isSelected(data: Pesanan) {
    return this.selectedPrint.map(x => x.barcode).includes(data.barcode);
  }
  updateChecked(res: Pesanan[]) {
    const filter = this.selectedPrint.filter(x => res.map(brg => brg.barcode).includes(x.barcode));
    return filter;
  }

}
