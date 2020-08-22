import { Component } from "@angular/core";
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  templateUrl: "./palmie.component.html",
})
export class PalmieComponent extends DashboardParentComponent {
}
