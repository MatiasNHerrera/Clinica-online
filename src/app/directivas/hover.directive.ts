import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {

  @Input() colorBase;
  @Input() colorHover;
  
  constructor(private element : ElementRef)
  { 

  }

  @Input('appHover') highlightColor: string;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(this.colorHover || this.colorBase || 'red');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight(null);
  }

  highlight(color: string) {
    this.element.nativeElement.style.backgroundColor = color;
  }

}
