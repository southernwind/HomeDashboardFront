import { Component } from "@angular/core";
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { Moment } from 'moment';
import * as moment from 'moment';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { CookieService } from 'ngx-cookie-service';
import { DateRange } from 'src/dashboard/models/date-range.model';

@UntilDestroy()
@Component({
  templateUrl: "./aquarium.component.html",
})
export class AquariumComponent extends DashboardParentComponent {
}
