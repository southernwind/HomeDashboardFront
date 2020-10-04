import { Component } from "@angular/core";
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  templateUrl: "./electric-power.component.html",
})
export class ElectricPowerComponent extends DashboardParentComponent {
}
