import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { PopupService } from 'src/app/services/popup.service';
import { Ambilan } from 'src/app/services/interfaces';
import { ToolService } from 'src/app/services/tool.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-list-ambilan',
  templateUrl: './list-ambilan.page.html',
  styleUrls: ['./list-ambilan.page.scss']
})
export class ListAmbilanPage implements OnInit {

  dataPrint: Ambilan[]; task;
  selectedPrint: Ambilan[] = [];
  onload = true;
  onPrint = false;

  constructor(
    private dataService: DataService,
    private popup: PopupService,
    public tool: ToolService,
    private pdf: PdfService,
  ) {
    this.task = this.dataService.getAmbilan([{field: 'printed', comp: '==', value: false}])
    .subscribe(res => {
      this.onload = false;
      this.dataPrint = res;
      this.selectedPrint = this.updateChecked(res);
    });
  }
  ngOnInit() {
  }

  print() {
    this.pdf.printPDFLabel(this.selectedPrint, 'Ambilan', {statusPrint: 'ambilan'});
  }

  selectAll(all: boolean) {
    this.selectedPrint = [];
    if (all) {
      this.dataPrint.forEach(x => {
        this.selectedPrint.push(x);
      });
    }
  }
  selectPrint(event, data: Ambilan) {
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
  isSelected(data: Ambilan) {
    return this.selectedPrint.map(x => x.barcode).includes(data.barcode);
  }
  updateChecked(res: Ambilan[]) {
    const filter = this.selectedPrint.filter(x => res.map(brg => brg.barcode).includes(x.barcode));
    return filter;
  }

}
