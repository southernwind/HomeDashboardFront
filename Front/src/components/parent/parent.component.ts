import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class ParentComponent implements OnDestroy {
  public compositeSubscription: Subscription = null;

  public add(subscription: Subscription): void {
    if (this.compositeSubscription === null) {
      this.compositeSubscription = new Subscription();
    }
    (this.compositeSubscription).add(subscription);
  }
  public ngOnDestroy(): void {
    this.compositeSubscription.unsubscribe();
  }

}