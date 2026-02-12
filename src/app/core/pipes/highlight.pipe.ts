import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightSearch',
  standalone: true,
})
export class HighlightSearchPipe implements PipeTransform {
  constructor(private readonly sanitier: DomSanitizer) {}

  transform(value: string, args: string): SafeHtml {
    if (!args) {
      return value;
    }

    const regex = new RegExp(args, 'gi');
    const match = value.match(regex);

    if (!match) {
      return value;
    }

    const replacedValue = value.replace(
      regex,
      `<span style="background-color: yellow">${match[0]}</span>`,
    );

    return this.sanitier.bypassSecurityTrustHtml(replacedValue);
  }
}
