import Enumerable from 'linq';
import { Transaction } from './transaction.model';
export interface Condition<T> {
  condition: (value: T) => boolean;
}

export class TransactionCondition implements Condition<Transaction> {
  month?: string = null;
  largeCategory?: string = null;
  middleCategory?: string = null;
  largeCategories: string[] = [];
  condition(value: Transaction) {
    return (
      (this.month === null ? true : value.date.startsWith(this.month)) &&
      (this.largeCategory !== null && this.middleCategory !== null || this.largeCategories.length === 0 ? true : Enumerable.from(this.largeCategories).any(x => x === value.largeCategory)) &&
      (this.largeCategory === null ? true : value.largeCategory == this.largeCategory) &&
      (this.middleCategory === null ? true : value.middleCategory == this.middleCategory));
  }
}