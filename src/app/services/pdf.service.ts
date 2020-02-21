import { Injectable } from '@angular/core';

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import { NavController, Platform } from '@ionic/angular';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const options = [
  {
    name: 'GOLDEN COCK',
    labelCode: '105',
    labelSize: '25x38 mm',
    widths: [ 104, 104, 104, 104, 104 ], // panjang tiap label + margin
    heights: [ 73, 73, 73, 73, 73 ], // tinggi tiap label + margin
    csFont: 12,
  },
  {
    name: 'BENG YU',
    labelCode: '105',
    labelSize: '24x37 mm',
    widths: [ 100, 100, 100, 100, 100 ], // panjang tiap label + margin
    heights: [ 66, 66, 66, 66, 66 ], // tinggi tiap label + margin
    csFont: 8,
  }
];

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  labelOptions = options[0];
  pdfObj;

  constructor(
    public navCtrl: NavController,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener
    ) {}

  getOptions(index?: number | null) {
    if (index >= 0) {
      return options[index];
    } else { return options; }
  }
  setOptions(index) {
    this.labelOptions = options[index];
  }

  generatePdf(data, pdfName?: string) {
    this.pdfObj = pdfMake.createPdf(data);
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, pdfName, blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + pdfName, 'application/pdf');
        });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download(pdfName);
    }
  }

  // PRINT PDF LABEL
  printPDFLabel(data: any[], fileName: string, option: {statusPrint: string, labelMerk?: number}) {
    const printData = data;
    if (option.labelMerk) { this.setOptions(option.labelMerk); }
    printData.map(x => ({ ...x, null: false, statusPrint: option.statusPrint }));
    const dataLabel = this.split_refill(printData, 30, { null: true });
    const content = dataLabel.map((blockData) => {
      const newArr = [];
      while (blockData.length) { newArr.push(blockData.splice(0, 5)); }
      const body = newArr.map((labelBlock: any[]) => {
        return labelBlock.map(label => {
          let labelData = [];

          if (!label.null) {
            switch (option.statusPrint) {
              case 'ambilan': {
                if (label.toko !== 'RUMAH') {
                  labelData = [
                    [
                      { qr: label.barcode, rowSpan: 2, fit: '50' }, { text: label.toko.toUpperCase(), colSpan: 2, fontSize: 7 }, {}
                    ],
                    [
                      {}, { text: label.barang + ' ' + label.warna, colSpan: 2, fontSize: 7, border: [ false, true, false, false ] }, {}
                    ],
                    [
                      { text: label.penerima, colSpan: 2, fontSize: 5, bold: true },
                      {},
                      // tslint:disable-next-line: max-line-length
                      { text: label.cs, fontSize: this.labelOptions.csFont, bold: true, border: [ true, true, false, false ], alignment: 'center' }
                    ]
                  ];
                } else {
                  const qr = label.barcode + '=' + label.cs + '=' + label.penerima.split(' ')[0];
                  labelData = [
                    [
                      { qr, rowSpan: 2, fit: '70' }, {}, { text: '  ' + label.cs + ' | ' + label.date, fontSize: 5, bold: true }
                    ],
                    [ // tslint:disable-next-line: max-line-length
                      {}, {}, { text: '  ' + label.barang + ' ' + label.warna + '\n\n  ' + label.penerima, fontSize: 5, border: [ true, true, true, true ] }
                    ],
                    [ {}, {}, {} ]
                  ];
                }
                break;
              }
              case 'stock': {
                const qr = label.barcode;
                labelData = [
                  [
                    { qr, rowSpan: 2, fit: '50' },
                    { text: label.toko, colSpan: 2, fontSize: 7 },
                    {}
                  ],
                  // tslint:disable-next-line: max-line-length
                  [{}, { text: label.nama + ' ' + label.warna, colSpan: 2, fontSize: 7, border: [ false, true, false, false ] }, {}],
                  [
                    { text: 'JUAL: ' + label.hargaJual, colSpan: 2, fontSize: 5, bold: true },
                    {},
                    // tslint:disable-next-line: max-line-length
                    { text: qr, fontSize: 5, bold: true, border: [ true, true, false, false ], alignment: 'center' }
                  ]
                ];
                break;
              }
            }
          } else {
            labelData = [
              [ {}, {}, {} ],
              [ {}, {}, {} ],
              [ {}, {}, {} ]
            ];
          }

          return {
            margin: [0, 0, 0, 0],
            layout: { defaultBorder: false },
            table: {
              widths: [40, 'auto', 'auto'],
              body: labelData
            }
          };
        });
      });
      const blockLabel = {
        layout: { defaultBorder: false },
        table: {
          widths: this.labelOptions.widths, // panjang tiap label
          heights: this.labelOptions.heights, // tinggi tiap label
          body
        },
        pageBreak: 'after'
      };
      return blockLabel;
    });

    const pdfRaw = {
      pageSize: 'A4',
      pageMargins: [ 3, 5, 1, 1 ],
      content
    };

    this.generatePdf(pdfRaw, `${fileName}_${moment().format('YYYY-MM-DD')}`);
  }
  split_refill(data: any[], splitLength: number, dataRefill?: any | null) {
    const dataResult = [];
    const dataTmp = [].concat(data);
    while (dataTmp.length) {
      const oldArray = dataTmp.splice(0, splitLength);
      const newArray = oldArray;
      if (oldArray.length !== splitLength) {
        let sisa = splitLength - oldArray.length;
        while (sisa !== 0) { newArray.push(dataRefill); sisa--; }
        dataResult.push(newArray);
      } else { dataResult.push(oldArray); }
    }
    return dataResult;
  }
  // PRINT PDF LABEL

  refillArray(array: any[], lengthArray: number) {
    const newArray = array;
    if (array.length !== lengthArray) {
      let sisa = lengthArray - array.length;
      while (sisa !== 0) { newArray.push({ null: true }); sisa--; }
      return newArray;
    } else { return array; }
  }

  // PRINT PDF NOTA
  printPDFNota(orderan) {
    const orderanGroup = [];
    for (const key in orderan) { // reorder data {LTS: value[]} => [ {key: 'LTS', value: []}, ... ]
      if (orderan.hasOwnProperty(key)) {
        if (key !== 'RUMAH') { // filter data without RUMAH
          orderanGroup.push({key, value: orderan[key]});
        }
      }
    }
    const orderanGroup2 = orderanGroup.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));
    const orderanGroup3 = orderanGroup2.map(x => ({ ...x, null: false }));
    const groupBlock = [];
    while (orderanGroup3.length) { groupBlock.push(this.refillArray(orderanGroup3.splice(0, 2), 2)); } // split menjadi 2 blok

    const newBlock = groupBlock.map(blokNota => (
      {
        pageBreak: 'after',
        style: 'tableExample',
        table: {
          widths: ['*', '*'],
          body: [
                  [
                    {
                    border: [false, false, false, false],
                      style: 'tableExample',
                      table: {
                        widths: [20, '*', 17, 60, 25],
                        body: this.buatNota(blokNota[0])
                      }
                    },
                    {
                    border: [false, false, false, false],
                      style: 'tableExample',
                      table: {
                        widths: [20, '*', 17, 60, 25],
                        body: this.buatNota(blokNota[1])
                      }
                    }
                  ]
                ]
        }
      }
    ));
    // Buat list toko ambilan
    const listToko = [];
    const title = [
      {text: 'LIST TOKO AMBILAN', style: 'subheader', colSpan: '5', alignment: 'center'},
      {}, {}, {}, {},
    ];
    const header = [
      {text: 'NO', style: 'tableHeader', fillColor: '#dddddd'},
      {text: 'NAMA TOKO', style: 'tableHeader', fillColor: '#dddddd'},
      {text: 'Pcs', style: 'tableHeader', fillColor: '#dddddd'},
      {text: 'TOTAL', style: 'tableHeader', fillColor: '#dddddd'},
      {text: 'CEK', style: 'tableHeader', fillColor: '#dddddd'},
    ];
    listToko.push(title);
    listToko.push(header);
    orderanGroup2.sort((a, b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))
    .forEach((toko, i) => {
      const list = [
        {text: i + 1, alignment: 'center'},
        toko.key.toUpperCase(),
        {text: toko.value.length, alignment: 'center'},
        '', '',
      ];
      listToko.push(list);
    });

    newBlock.push({ // Buat list toko yg diambil
      pageBreak: 'after',
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
                [
                  {
                  border: [false, false, false, false],
                    style: 'tableExample',
                    table: {
                      widths: [20, '*', 17, 60, 25],
                      body: listToko
                    }
                  },
                  {
                  border: [false, false, false, false],
                    style: 'tableExample',
                    table: {
                      widths: [20, '*', 17, 60, 25],
                      body: [ [ {}, {}, {}, {}, {}, ] ]
                    }
                  }
                ]
              ]
      }
    });
    const pdfRaw = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [ 10, 5, 10, 5 ],
      styles: {
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 0]
        },
        tableExample: {
          margin: [5, 5, 5, 5],
          fontSize: 10
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black'
        }
      },
      content: newBlock
    };
    this.generatePdf(pdfRaw, `Nota_Ambilan_${moment().format('YYYY-MM-DD')}`);
  }
  buatNota(blokNota) {
    const nota = [];
    if (!blokNota.null) {
      const title = [
        {text: blokNota.key.toUpperCase(), style: 'subheader', colSpan: '5', alignment: 'center'},
        {}, {}, {}, {},
      ];
      const header = [
        {text: 'NO', style: 'tableHeader', fillColor: '#dddddd'},
        {text: 'BARANG', style: 'tableHeader', fillColor: '#dddddd'},
        {text: 'CS', style: 'tableHeader', fillColor: '#dddddd'},
        {text: 'HARGA', style: 'tableHeader', fillColor: '#dddddd'},
        {text: 'CEK', style: 'tableHeader', fillColor: '#dddddd'},
      ];
      nota.push(title);
      nota.push(header);
      blokNota.value.forEach((item, i) => {
        const list = [
          {text: i + 1, alignment: 'center'},
          item.barang + ' ' + item.warna,
          {text: item.cs, alignment: 'center'},
              '', '',
        ];
        nota.push(list);
      });
      nota.push([
        {text: 'SUBTOTAL', style: 'tableHeader', colSpan: '3', alignment: 'right', fillColor: '#dddddd'},
        {}, {}, {text: '', colSpan: '2', fillColor: '#dddddd'}, {},
      ]);
      nota.push([
        {text: 'DISKON', style: 'tableHeader', colSpan: '3', alignment: 'right', fillColor: '#dddddd'},
        {}, {}, {text: '', colSpan: '2'}, {},
      ]);
      nota.push([
        {text: 'TOTAL', style: 'tableHeader', colSpan: '3', alignment: 'right', fillColor: '#dddddd'},
        {}, {}, {text: '', colSpan: '2', fillColor: '#dddddd'}, {},
      ]);
    } else {
      nota.push([]);
    }
    return nota;
  }
  // PRINT PDF NOTA

}
