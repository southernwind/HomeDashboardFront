import { Pipe, PipeTransform } from '@angular/core';
import Enumerable from 'linq';

@Pipe({
  name: 'firstOrDefaultPipe'
})
export class FirstOrDefaultPipe implements PipeTransform {
  transform<T>(array: T[], key: string, value: any): T | undefined {
    return Enumerable.from(array).firstOrDefault(x => (x as any)[key] === value);
  }
}