import * as _ from 'lodash';

export function isTrueProperty(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return val === 'true' || val === 'on' || val === 'yes';
  }
  return !!val;
}

export function isPresent(val: any): boolean {
  return val !== undefined && val !== null;
}

export function flattenObject(obj: any) {
  return _.transform(obj, function (result, value, key) {
    if (_.isObject(value) && !_.isArray(value)) {
      let flatMap = _.mapKeys(flattenObject(value), (_mvalue, mkey) => {
        return `${key}.${mkey}`;
      });
      _.assign(result, flatMap);
    } else {
      result[key] = value;
    }

    return result;
  }, {});
}

export function unFlattenObject(params: any) {
  return _.reduce(params, (result, value, key) => { return _.set(result, key, value); }, {});
}

export function dateFormat(date: Date | number, format: string = 'yyyy-MM-dd'): string {
  const d = _.isNumber(date) ? new Date(date) : date;
  const month = d.getMonth() + 1;
  let time = {
    year: d.getFullYear(),
    tyear: String(d.getFullYear()).substr(2),
    month: month,
    tmonth: month < 10 ? '0' + month : String(month),
    day: d.getDate(),
    tday: d.getDate() < 10 ? '0' + d.getDate() : String(d.getDate()),
    hour24: d.getHours(),
    thour24: d.getHours() < 10 ? '0' + d.getHours() : String(d.getHours()),
    hour: d.getHours() < 13 ? d.getHours() : d.getHours() - 12,
    thour: d.getHours() < 10 ? '0' + d.getHours() : String(d.getHours()),
    minute: d.getMinutes(),
    tminute: d.getMinutes() < 10 ? '0' + d.getMinutes() : String(d.getMinutes()),
    second: d.getSeconds(),
    tsecond: d.getSeconds() < 10 ? '0' + d.getSeconds() : String(d.getSeconds()),
    millisecond: d.getMilliseconds()
  };

  return format.replace(/yyyy/ig, String(time.year))
    .replace(/yyy/ig, String(time.year))
    .replace(/yy/ig, time.tyear)
    .replace(/y/ig, time.tyear)
    .replace(/MM/g, time.tmonth)
    .replace(/M/g, String(time.month))
    .replace(/dd/ig, time.tday)
    .replace(/d/ig, String(time.day))
    .replace(/HH/g, time.thour24)
    .replace(/H/g, String(time.hour24))
    .replace(/hh/g, time.thour)
    .replace(/h/g, String(time.hour))
    .replace(/mm/g, time.tminute)
    .replace(/m/g, String(time.minute))
    .replace(/ss/ig, time.tsecond)
    .replace(/s/ig, String(time.second))
    .replace(/fff/ig, String(time.millisecond));
}

export function numberFormat(num: number | string): string {
  num = num || 0;
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function currencyFormat(num: number, prefix?: string): string {
  prefix = prefix || '￥';
  return prefix + numberFormat(num.toFixed(2));
}

export enum DateType {
  Day = 0,
  Week = 1,
  Month = 3,
  Year = 2
}

export function getFirstDateOfWeek(date: Date) {
  return new Date(new Date(date).setDate(date.getDate() - date.getDay() + 1));
}

export function getLastDateOfWeek(date: Date) {
  return new Date(new Date(date).setDate(date.getDate() - date.getDay() + 7));
}

export function getLastDateOfMonth(date: Date) {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + 1);
  result.setDate(result.getDate() - 1);
  return result;
}

export function addDate(date: Date, offset: number, dateType: DateType) {
  let result = new Date(date);
  switch (dateType) {
    case (DateType.Day):
      result.setDate(result.getDate() + offset);
      break;
    case (DateType.Week):
      result.setDate(result.getDate() + offset * 7);
      break;
    case (DateType.Month):
      result.setMonth(result.getMonth() + offset);
      break;
    case (DateType.Year):
      const year: number = date.getFullYear() - 1;
      const month: number = date.getMonth();
      let day: number = date.getDate();
      if (month === 2 && day === 29 && !leapYear(year)) {
        day = 28;
      }
      result = new Date(year, month, day);
      break;
  }
  return result;
}

export function leapYear(year) {
  return !(year % (year % 100 ? 4 : 400));
}

export function division(dividend: number, divisor: number, toFixed?: number) {
  if (divisor === 0) {
    return 0;
  }
  return Number((dividend / divisor).toFixed(toFixed ? toFixed : 2));
}

export function guid() {
  const d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}