import { Component, Input } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { AquariumApiService } from '../../../services/aquarium-api.service';
import { CurrentWaterState } from '../../../models/water-state.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@UntilDestroy()
@Component({
  selector: "current-water-states",
  templateUrl: "./current-water-states.component.html"
})
export class CurrentWaterStatesComponent extends DashboardParentComponent {
  public waterState: CurrentWaterState = null;
  public temperatureStrokeColor = { '0%': '#1e90ff', '100%': '#ff4500' };
  public formatFunc = (percent: number) => `${(percent / 2).toFixed(3)} ℃`;
  public humidityFormatFunc = (percent: number) => `${percent.toFixed(3)} %`;
  constructor(private message: NzMessageService, private aquariumApiService: AquariumApiService) {
    super();
    this.aquariumApiService
      .waterStateAsObservable()
      .pipe(untilDestroyed(this))
      .subscribe(x => this.waterState = x);
    this.aquariumApiService
      .requestSendLastWaterState().catch(() => {
        this.message.error("通信失敗");
      });
  }
}
