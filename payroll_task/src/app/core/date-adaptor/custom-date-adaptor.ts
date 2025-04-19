import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdaptor extends NativeDateAdapter {
  override format(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }); 
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
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