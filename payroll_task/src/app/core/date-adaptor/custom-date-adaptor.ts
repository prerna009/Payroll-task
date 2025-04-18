import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdaptor extends NativeDateAdapter {
  override format(date: Date): string {
    const day = this._to2digit(date.getDate());
    const month = date.toLocaleString('default', { month: 'short' }); 
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  private _to2digit(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'dd MMM, yyyy', 
  },
  display: {
    dateInput: 'dd MMM, yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd MMMM yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  }
};