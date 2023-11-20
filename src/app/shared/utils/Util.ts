import { FormBuilder, Validators } from "@angular/forms";
import { Observable, timer } from "rxjs";
import { map, take, takeWhile } from "rxjs/operators";

export function getValue<T = any>(value: T | ((args: any) => T), args: any) {
  if (value instanceof Function)
    return value(args);
  else
    return value;
}

export interface EnumValue {
  key: string | number;
  value: string | number;
}

export function getEnumValues(anEnum: any): EnumValue[] {
  return Object.keys(anEnum).map(key => ({ key: anEnum[key], value: key }))
}

export function formatPhoneNumber(phoneNumber: any) {
  phoneNumber = phoneNumber?.phoneControl;
  if (phoneNumber.includes(" 0")) {
    phoneNumber = phoneNumber.replace(" 0", "")
  }

  phoneNumber = (phoneNumber.replace(/[()-]/gi, "")).replace(/ /g, '');

  return phoneNumber
}

export const AddressDetailsForm = (fb: FormBuilder, isOptional: boolean) => {
  if (isOptional) {
    return fb.group({
      addressLine1: [null, [Validators.maxLength(250)]],
      addressCity: [null, [Validators.maxLength(250)]],
      addressState: [null, [Validators.maxLength(250)]],
      addressPostalCode: [null, [Validators.maxLength(250)]],
      country: [null, [Validators.maxLength(250)]]
    });
  } else {
    return fb.group({
      addressLine1: [null, [Validators.required, Validators.maxLength(250)]],
      addressCity: [null, [Validators.required, Validators.maxLength(250)]],
      addressState: [null, [Validators.required, Validators.maxLength(250)]],
      addressPostalCode: [null, [Validators.required, Validators.maxLength(250)]],
      country: [null, [Validators.maxLength(250)]]
    });
  }
}

export const RegionAddressDetailsForm = (fb: FormBuilder, isOptional: boolean) => {
  if (isOptional) {
    return fb.group({
      addressSuburb: [null, [Validators.maxLength(250)]],
      addressCity: [null, [Validators.maxLength(250)]],
      addressState: [null, [Validators.maxLength(250)]],
      country: [null, [Validators.maxLength(250)]]
    });
  } else {
    return fb.group({
      addressSuburb: [null, [Validators.maxLength(250)]],
      addressCity: [null, [Validators.required, Validators.maxLength(250)]],
      addressState: [null, [Validators.required, Validators.maxLength(250)]],
      country: [null, [Validators.maxLength(250)]]
    });
  }
}


/**
 * Converts number for hours to complete to string
 * @param hoursToComplete number
 * @returns returns string for a number
 */
export const HoursToCompleteString = (hoursToComplete: number) => {
  switch (hoursToComplete) {
    case 1:
      return 'OnePlus';
    case 2:
      return 'TwoPlus';
    case 3:
      return 'ThreePlus';
    default:
      return 'FourPlus';
  }
}

/**
 * Sorts list in ascending order based on sequence
 * @param list array of objects
 * @returns sorted list in ascending order
 */
export const SortInAscendingOrder = (list: any[], attr: string) => {
  return list.sort((a, b) => a[attr] - b[attr]);
}

/**
 * Used to remove th object's all properties whose value is empty string, null or undefined.
 * @param obj target object
 */
export const removePropertyOfEmpty = (obj: any) => {
  let newObj = Object.assign({}, obj);
  Object.keys(newObj).forEach((item: any) => {
    if (newObj[item] === '' || newObj[item] === null || newObj[item] === undefined) delete newObj[item];
  });
  return newObj;
};

export const countdown = (minutes: number, delay: number = 0) => {
  return new Observable<{ display: string; minutes: number; seconds: number, finished: boolean }>(
    subscriber => {
      timer(delay, 1000)
        .pipe(take(minutes * 60))
        .pipe(map(v => minutes * 60 - 1 - v))
        .pipe(takeWhile(x => x >= 0 && !subscriber.closed))
        .subscribe(count => { // countdown => seconds
          const m = Math.floor(count / 60);
          const s = count - m * 60;

          subscriber.next({
            display: `${('0' + m.toString()).slice(-2)}:${('0' + s.toString()).slice(-2)}`,
            minutes: m,
            seconds: s,
            finished: m === 0 && s === 0
          });

          if (s <= 0 && minutes <= 0) {
            subscriber.complete();
          }
        });
    }
  );
}
