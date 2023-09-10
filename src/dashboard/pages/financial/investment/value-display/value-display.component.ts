import { Component, Input } from "@angular/core";
import { DashboardParentComponent } from '../../../../components/parent/dashboard-parent.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { InvestmentCurrencyUnit } from "src/dashboard/models/investment-currency-unit.model";
import { jpyCurrencyId } from '../../../../../constants/constants';

@UntilDestroy()
@Component({
  selector: "app-value-display",
  templateUrl: "./value-display.component.html",
  styleUrls: ["./value-display.component.scss"]
})
export class ValueDisplayComponent extends DashboardParentComponent {
  @Input()
  public value: number;

  @Input()
  public investmentCurrencyUnit: InvestmentCurrencyUnit;

  @Input()
  public type: 'price' | 'static-price' | 'percent' | 'static-price-with-yen' | 'amount' = 'price';

  @Input()
  public adjustNumberOfDecimalPoint: number = 0;

  public get jpyCurrencyId(): number {
    return jpyCurrencyId;
  }

  get digitsInfo(): string {
    let numberOfDecimalPoint: number;
    if (this.type === 'percent') {
      numberOfDecimalPoint = 3 + this.adjustNumberOfDecimalPoint;
    } else if (this.type === 'amount') {
      numberOfDecimalPoint = this.adjustNumberOfDecimalPoint;
    } else {
      numberOfDecimalPoint = this.investmentCurrencyUnit?.numberOfDecimalPoint + this.adjustNumberOfDecimalPoint;
    }
    return `1.${numberOfDecimalPoint}-${numberOfDecimalPoint}`;
  }
}
