import { Component, Input } from "@angular/core";
import { DashboardParentComponent } from '../../../components/parent/dashboard-parent.component';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: "app-price-display",
  templateUrl: "./price-display.component.html",
  styleUrls: ["./price-display.component.scss"]
})
export class PriceDisplayComponent extends DashboardParentComponent {
  @Input()
  public price: number;
}
