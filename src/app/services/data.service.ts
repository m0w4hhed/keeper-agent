import { Injectable } from '@angular/core';

import { map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { PopupService } from './popup.service';
import * as firebase from 'firebase';

export interface Closing {
  id: string;
  date: string;
  penerima: string;
  nPenerima: string;
  alamat: string;
  pengirim: string;
  nPengirim: string;
  cs: string;
  ekspedisi: string;
  service: string;
  berat: number;
  ongkir: number;
  diskon: number;
  status: string;
  switch: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  closing$: Observable<any>;
  mutasiFilter$: BehaviorSubject<string|null>;

  constructor(
    public db: AngularFirestore,
    private popup: PopupService,
    ) {
    this.mutasiFilter$ = new BehaviorSubject(null);
    this.closing$ = db.collection('closing').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          const date = moment.unix(parseInt(id.split('-')[0], 10) / 1000).format('YYYY-MM-DD');
          return { id, date, ...data };
        });
      })
    );
  }

  getTime(format: string) {
    return moment(moment().toDate().getTime()).format(format);
  }

  getDatas(stat: string | null) {
    this.mutasiFilter$.next(stat);
    this.closing$ = combineLatest([
      this.mutasiFilter$
      ]).pipe(
      switchMap(([status]) =>
        this.db.collection('closing', ref => {
          let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (status) { query = query.where('tglDikirim', '==', status); }
          return query;
        }).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              const date = moment.unix(parseInt(id.split('-')[0], 10) / 1000).format('YYYY-MM-DD');
              // tslint:disable-next-line: no-string-literal
              const totalOngkir = a.payload.doc.data()['ongkir'] * a.payload.doc.data()['berat'];
              return { id, date, totalOngkir, ...data };
            });
          })
        )
      )
    );
    return this.closing$;
  }

  async analyticValidator() {
    try {
      const tahun = new Date().getFullYear().toString();
      const bulan = ('0' + (new Date().getMonth() + 1)).slice(-2);
      const hari = ('0' + (new Date().getDate())).slice(-2);
      const olahdataAdminRef = this.db.collection('olahdata').doc('barang').collection('per-cs').doc(tahun + '-' + bulan);
      const olahdataKeepAdminRef = olahdataAdminRef.collection('success').doc(hari).ref;
      const olahdataKeepBulanan = await olahdataAdminRef.ref.get();
      const olahdataKeep = await olahdataKeepAdminRef.get();
      if (!olahdataKeepBulanan.exists) {
        olahdataAdminRef.set({ keep: 0, lost: 0, diambil: 0, success: 0}).then(async () => {
          console.log('tambah bulan');
          if (!olahdataKeep.exists) {
            olahdataKeepAdminRef.set({ A: 0, D: 0, F: 0, H: 0, M: 0, N: 0, V: 0, W: 0, total: 0 });
            console.log('tambah hari');
          }
        });
      }
      return { olahdataKeepBulanan, olahdataKeep,  };
    } catch (error) {
      this.popup.showAlert('Error!', error);
    }
  }
  async updateDikirim(id: string, data) {
    try {
      const batch = this.db.firestore.batch();
      const barangRef = this.db.collection('closing').doc(id).ref;
      const barangDoc = await barangRef.get();
      if (barangDoc.exists) {
        if (barangDoc.data().status !== 'Dikirim') {
          const tahun = new Date().getFullYear().toString();
          const bulan = ('0' + (new Date().getMonth() + 1)).slice(-2);
          const hari = ('0' + (new Date().getDate())).slice(-2);
          const kodeCS = barangDoc.data().cs;
          const jum = barangDoc.data().listBarang.length;
          const olahdataAdminRef = this.db.collection('olahdata').doc('barang').collection('per-cs').doc(tahun + '-' + bulan);
          const olahdataKeepAdminRef = olahdataAdminRef.collection('success').doc(hari).ref;
          // Update olahdata Admin
          // this.analyticValidator();
          batch.set(olahdataKeepAdminRef, {
                [kodeCS]: firebase.firestore.FieldValue.increment(jum),
                total: firebase.firestore.FieldValue.increment(jum)
          }, { merge: true });
          batch.set(olahdataAdminRef.ref, {success: firebase.firestore.FieldValue.increment(jum)}, { merge: true });
          batch.update(barangRef, data);
          batch.commit().then(
                (success) => this.popup.showToast(`${barangDoc.data().penerima} Dikirim`, 700),
                (error) => this.popup.showAlert('Error', error)
          );
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
      return await this.db.collection('closing').doc(id).update(data);
    } catch (err) {
      throw err;
    }
  }
}
