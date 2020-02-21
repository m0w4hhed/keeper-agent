import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor() { }

  getRangeTime(date: moment.Moment|number, endDate?: moment.Moment|number) {
    const startTime = moment(moment(date).set({hour: 0, minute: 0, second: 0, millisecond: 0})).unix();
    let endTime = moment(moment(date).set({hour: 23, minute: 59, second: 59, millisecond: 999})).unix();
    if (endDate) {
      endTime = moment(moment(endDate).set({hour: 23, minute: 59, second: 59, millisecond: 999})).unix();
    }
    // console.log(startTime, endTime);
    return {startTime, endTime};
  }
  getTime(format?: string) {
    if (format) {
      return +moment().format(format);
    } else {
      return moment().unix();
    }
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
}
