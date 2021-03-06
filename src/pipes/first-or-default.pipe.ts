import { Pipe, PipeTransform } from '@angular/core';
import * as Enumerable from 'linq';

@Pipe({
  name: 'firstOrDefaultPipe'
})
export class FirstOrDefaultPipe implements PipeTransform {
  transform<T>(array: T[], key: string, value: any): T {
    return Enumerable.from(array).firstOrDefault(x => x[key] === value);
  }
}