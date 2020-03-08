import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

export interface Entry {
  isFile: boolean;
  isDirectory: boolean;
  name: string; // "VID-20200214-WA0000.mp4"
  fullPath: string; // "/VID-20200214-WA0000.mp4"
  filesystem: object; // {name: "sdcard", root: DirectoryEntry}
  nativeURL: string; // "file:///storage/emulated/0/VID-20200214-WA0000.mp4"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private file: File,
    private fileOpener: FileOpener,
    private plt: Platform,
    private printer: Printer
    ) { }

  writeFile(base64data: any, fileName: string): Promise<string> {
    if (this.plt.is('cordova')) {
      return new Promise((resolve, reject) => {
        base64data.getBuffer(async (buffer) => {
          const blob = new Blob([buffer], { type: 'application/pdf' });
          const saveDir = this.file.externalRootDirectory + 'ambilan/';
          this.file.writeFile(saveDir, fileName, blob, { replace: true }).then(
            () => resolve(saveDir + fileName),
            (err) => reject(err)
          );
        });
      });
    }
  }
  deleteFile(fileName) {
    const saveDir = this.file.externalRootDirectory + 'ambilan/';
    this.file.removeFile(saveDir, fileName);
  }
  openFile(fileDir) {
    return this.fileOpener.open(fileDir, 'application/pdf');
  }
  printFile(fileDir) {
    this.printer.check().then(
      () => this.printer.print(fileDir)
    );
  }
  async readFolder(): Promise<Entry[]> {
    const internalDir = this.file.externalRootDirectory;
    const dirExist = await this.file.checkDir(internalDir, 'ambilan');
    let result: any[] = [];
    if (dirExist) {
      result = await this.file.listDir(internalDir, 'ambilan');
    } else { result = []; }
    console.log('DIR LIST: ', result);
    return result;
  }

}
