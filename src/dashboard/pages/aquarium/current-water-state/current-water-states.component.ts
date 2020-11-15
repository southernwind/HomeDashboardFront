import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { AquariumApiService } from '../../../services/aquarium-api.service';
import { CurrentWaterState } from '../../../models/water-state.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: "current-water-states",
  templateUrl: "./current-water-states.component.html"
})
export class CurrentWaterStatesComponent extends DashboardParentComponent {
  public waterState: CurrentWaterState = null;
  public temperatureStrokeColor = { '0%': '#1e90ff', '100%': '#ff4500' };
  public formatFunc = (percent: number) => `${(percent / 5 + 15).toFixed(3)} ℃`;
  public humidityFormatFunc = (percent: number) => `${percent.toFixed(3)} %`;
  constructor(private message: NzMessageService, private aquariumApiService: AquariumApiService, private changeDetector: ChangeDetectorRef) {
    super();
    this.aquariumApiService
      .waterStateAsObservable()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        this.waterState = x
        this.changeDetector.detectChanges();
      });
    this.aquariumApiService
      .getLatestWaterState()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        this.waterState = x;
      }, () => {
        this.message.error("通信失敗");
      });
  }
}
