import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
  standalone: false
})
export class NumbersOnlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input',['$event']) onInput(){
    const inputVal = this.el.nativeElement.value;
    this.el.nativeElement.value = inputVal.replace(/[^0-9]/g,'');
  }

}
