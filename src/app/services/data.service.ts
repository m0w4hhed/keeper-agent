import { Injectable } from '@angular/core';

import { map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest, of, forkJoin } from 'rxjs';
import { PopupService } from './popup.service';
import * as firebase from 'firebase';
import { Invoice, Pesanan, UserConfig, DataToko } from './interfaces';
import { WhereFilterOp } from '@firebase/firestore-types';

/**
 * @param field nama field dari document
 * @param comp comparator string firestore
 * @param value value dari field
 */
export interface Filter {
  field: string;
  comp: WhereFilterOp;
  value: string|number|boolean;
}
export interface OlahData {
  tanggal: number;
  'barang-ambilan': 0;
  'barang-masuk': 0;
  'barang-loss': 0;
  'barang-keluar': 0;
  'A-masuk': 0; 'A-keluar': 0;
  'D-masuk': 0; 'D-keluar': 0;
  'F-masuk': 0; 'F-keluar': 0;
  'H-masuk': 0; 'H-keluar': 0;
  'M-masuk': 0; 'M-keluar': 0;
  'N-masuk': 0; 'N-keluar': 0;
  'V-masuk': 0; 'V-keluar': 0;
  'W-masuk': 0; 'W-keluar': 0;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public afs: AngularFirestore,
    private popup: PopupService,
    ) {
  }

  getDataToko(
    filter: Filter[],
    options?: {
      searchMode?: {field: string, searchText: string}|null,
      rangeDate?: {from: number, to: number, orderBy: string}|null,
      limit?: number|null
    }|null
  ): Observable<DataToko[]> {
    return this.afs.collection('configs').doc('user_config').collection<DataToko>('data_toko', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (options) {
        if (options.searchMode) {
          console.log(`[FTR] Search value ${options.searchMode.searchText}`);
          const start = options.searchMode.searchText.toString().toLowerCase();
          const end = start + '\uf8ff';
          query = query.limit(10).orderBy(options.searchMode.field).startAt(start).endAt(end);
        } else {
          if (options.rangeDate) {
            query = query.orderBy(options.rangeDate.orderBy).startAt(options.rangeDate.from).endAt(options.rangeDate.to);
          }
        }
        if (options.limit) {
          query = query.limit(options.limit);
        }
      }
      filter.forEach(f => {
        query = query.where(f.field, f.comp, f.value);
      });
      return query;
    }).valueChanges();
  }
  async createDataToko(toko: DataToko) {
    try {
      const config = this.afs.collection('configs').doc('user_config');
      const docRef = config.collection('data_toko').doc(toko.kode).ref;
      const batch = this.afs.firestore.batch();
      const doc = await docRef.get();
      if (!doc.exists) {
        toko.nama = toko.nama.toLowerCase();
        toko.blok = toko.blok.toUpperCase();
        batch.set(docRef, toko);
        batch.update(config.ref, { data_toko: firebase.firestore.FieldValue.arrayUnion(toko.kode) });
        return batch.commit().then(() => { return true; });
      } else {
        return Promise.resolve(false);
      }
    } catch (err) { throw err; }
  }
  updateDataToko(toko: DataToko, deleteData?: boolean|null) {
    const dataTokoRef = this.afs.collection('configs').doc('user_config').collection('data_toko');
    if (deleteData) {
      const batch = this.afs.firestore.batch();
      const tokoRef = dataTokoRef.doc(toko.kode).ref;
      const userConfigRef = this.afs.collection('configs').doc('user_config').ref;
      batch.delete(tokoRef);
      batch.update(userConfigRef, {data_toko: firebase.firestore.FieldValue.arrayRemove(toko.kode)});
      return batch.commit();
    } else {
      return dataTokoRef.doc(toko.kode).update(toko);
    }
  }

  getTime(format?: string) {
    if (format) {
      return +moment().format(format);
    } else {
      return moment().unix();
    }
  }

  olahdataExist(tanggal: string, olahType: string) {
    return this.afs.collection('olahdata').doc('barang').collection('per-hari').doc<OlahData>(tanggal).valueChanges().pipe(
      switchMap(olahdata => {
        if (olahdata) {
          if (olahType === 'keluar') { return of(olahdata['barang-keluar'] !== 0); }
          if (olahType === 'masuk') { return of(olahdata['barang-masuk'] !== 0); }
        } else { return of(false); }
      })
    );
  }
  async olahData(data: Pesanan[]|Invoice[], olahType: string, tanggal: string) {
    try {
      const olahdataBarangRef = this.afs.collection('olahdata').doc('barang').collection('per-hari').doc<OlahData>(tanggal).ref;
      const olahdataDoc = await olahdataBarangRef.get();
      let olahdata = {
        tanggal: +(tanggal),
        'barang-ambilan': 0,
        'barang-masuk': 0,
        'barang-loss': 0,
        'barang-keluar': 0,
        'A-masuk': 0, 'A-keluar': 0,
        'D-masuk': 0, 'D-keluar': 0,
        'F-masuk': 0, 'F-keluar': 0,
        'H-masuk': 0, 'H-keluar': 0,
        'M-masuk': 0, 'M-keluar': 0,
        'N-masuk': 0, 'N-keluar': 0,
        'V-masuk': 0, 'V-keluar': 0,
        'W-masuk': 0, 'W-keluar': 0,
      };
      if (!olahdataDoc.exists) {
        let parsedData = [];
        (olahType === 'masuk') ?
          parsedData = data as Pesanan[] :
          parsedData = [].concat.apply([], (data as Invoice[]).map(inv => inv.pesanan.map(x => ({barcode: x, cs: inv.cs})))) as Pesanan[];
        parsedData.forEach(brg => {
          (olahType === 'masuk') ? olahdata['barang-ambilan']++ : olahdata['barang-keluar']++;
          if (brg.statusKeep === 'diambil') { olahdata['barang-masuk']++; olahdata[`${brg.cs}-masuk`]++; }
          if (brg.statusKeep === 'kosong') { olahdata['barang-loss']++; }
          if (olahType === 'keluar') { olahdata[`${brg.cs}-keluar`]++; }
        });
        return olahdataBarangRef.set(olahdata);
      } else {
        olahdata = olahdataDoc.data() as OlahData;
        console.log(olahdata);
        let parsedData = [];
        (olahType === 'masuk') ?
          parsedData = data as Pesanan[] :
          parsedData = [].concat.apply([], (data as Invoice[]).map(inv => inv.pesanan.map(x => ({barcode: x, cs: inv.cs})))) as Pesanan[];
        console.log(olahType, parsedData);
        parsedData.forEach(brg => {
          (olahType === 'masuk') ? olahdata['barang-ambilan']++ : olahdata['barang-keluar']++;
          if (brg.statusKeep === 'diambil') { olahdata['barang-masuk']++; olahdata[`${brg.cs}-masuk`]++; }
          if (brg.statusKeep === 'kosong') { olahdata['barang-loss']++; }
          if (olahType === 'keluar') { olahdata[`${brg.cs}-keluar`]++; }
        });
        return olahdataBarangRef.update(olahdata);
      }
    } catch (error) {
      this.popup.showAlert('Error!', error);
    }
  }
  async updateInvoice(id: string, data: any) {
    try {
      const invoiceRef = this.afs.collection('keep').doc(id).ref;
      const invoiceDoc = await invoiceRef.get();
      if (invoiceDoc.exists) {
        if (invoiceDoc.data().status !== 'dikirim') {
          invoiceRef.update(data);
        } else {
          this.popup.showAlert('Sudah Discan!', 'Invoice Sudah Discan Dikirim ya!');
        }
      } else {
        this.popup.showAlert('Tidak Ketemu!', 'Invoice tidak ditemukan di database bro!');
      }
    } catch (error) {
      this.popup.showAlert('Error!', error);
    }
  }
  async updateResi(id: string, data: any) {
    try {
      return await this.afs.collection('keep').doc(id).update(data);
    } catch (err) {
      throw err;
    }
  }

  getDatas<T>(dbName: string, filter: Filter[], searchMode?: {field: string, searchText: string}|null, rangeDate?: {from: number, to: number, orderBy: string}|null): Observable<T[]> {
    return this.afs.collection<T>(dbName, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (searchMode) {
        console.log(`[FTR] Search value ${searchMode.searchText}`);
        const start = searchMode.searchText.toString().toLowerCase();
        const end = start + '\uf8ff';
        query = query.limit(10).orderBy(searchMode.field).startAt(start).endAt(end);
      } else {
        if (rangeDate) {
          query = query.orderBy(rangeDate.orderBy).startAt(rangeDate.from).endAt(rangeDate.to);
        }
        filter.forEach(f => {
          query = query.where(f.field, f.comp, f.value);
        });
      }
      return query;
    }).valueChanges();
  }
  updateAllAmbilan(ambilan: Pesanan[], data: any) {
    const batch = this.afs.firestore.batch();
    // if (ambilan.length >= 500) {
    //   const splitAmbilan = this.splitArray(ambilan, 500);
    //   const commits = [];
    //   splitAmbilan.forEach((amb) => {
    //     const batchs = this.afs.firestore.batch();
    //     amb.forEach(barang => {
    //       const docRef = this.afs.doc(`ambilan/${barang.barcode}`).ref;
    //       batchs.update(docRef, data);
    //     });
    //     commits.push(batch.commit());
    //   });
    //   return Promise.all(commits);
    // } else {
    ambilan.forEach(barang => {
      const docRef = this.afs.doc(`ambilan/${barang.barcode}`).ref;
      batch.update(docRef, data);
    });
    return batch.commit();
    // }
  }
  async updateAmbilan(id: string, data: any) {
    try {
      return this.afs.collection('ambilan').doc(id).update(data);
    } catch (err) { throw err; }
  }
  // splitArray(data: any[], length: number) {
  //   const result = [];
  //   const copyData = [].concat(data);
  //   while (copyData.length) {
  //     result.push(copyData.splice(0, length));
  //   }
  //   return result;
  // }
}
