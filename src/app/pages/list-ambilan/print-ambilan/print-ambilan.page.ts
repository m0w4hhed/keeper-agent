import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService, Entry } from 'src/app/services/storage.service';

@Component({
  selector: 'app-print-ambilan',
  templateUrl: './print-ambilan.page.html',
  styleUrls: ['./print-ambilan.page.scss'],
})
export class PrintAmbilanPage implements OnInit {

  fileList: Entry[];

  constructor(
    private modal: ModalController,
    private storage: StorageService,
  ) {
    this.storage.readFolder().then(
      (fileList) => this.fileList = fileList.filter(data => {
        const fileName = data.name.split('.');
        return (fileName[fileName.length - 1].toLowerCase() === 'pdf');
      })
    );
  }
  ngOnInit() {
  }

  openFile(fileDir: string) {
    this.storage.openFile(fileDir);
  }
  deleteFile(fileName: string) {
    this.storage.deleteFile(fileName);
  }

  dismiss() {
    this.modal.dismiss();
  }

}
