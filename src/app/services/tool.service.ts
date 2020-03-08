import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    private appVersion: AppVersion
  ) { }

  getRangeTime(unixStartDate: number, unixEndDate?: number) {
    const startTime = moment(moment(unixStartDate * 1000).set({hour: 0, minute: 0, second: 0, millisecond: 0})).unix();
    let endTime = moment(moment(unixStartDate * 1000).set({hour: 23, minute: 59, second: 59, millisecond: 999})).unix();
    if (unixEndDate) {
      endTime = moment(moment(unixEndDate * 1000).set({hour: 23, minute: 59, second: 59, millisecond: 999})).unix();
    }
    // console.log(startTime, endTime);
    return {startTime, endTime};
  }
  getTime(format?: string) {
    if (format) {
      return +moment().format(format);
    } else {
      return +moment().unix();
    }
  }
  formatTime(date, format?: string) {
    return (format ? moment(date).format(format) : moment(date).unix());
  }

  titleCase(str) {
    if (str) {
      return str.toLowerCase().split(' ').map((word) => {
        if (word[0]) {
          return word.replace(word[0], word[0].toUpperCase());
        } else {
          return '';
        }
      }).join(' ');
    } else {
      return '';
    }
  }

  formatNama(teks: string) {
    const nama = teks.split(' ');
    let jeneng = teks;
    if (nama.length > 2) {
      jeneng = nama[0];
      nama.forEach((item, i) => {
        if (i !== 0 && i !== (nama.length - 1)) {
          jeneng += ` ${nama[i][0]}.`;
        }
      });
      jeneng += ` ${nama[nama.length - 1]}`;
    }
    return jeneng;
  }

  async getAppVersion() { return await this.appVersion.getVersionNumber(); }
}
