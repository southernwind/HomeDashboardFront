import { Component, EventEmitter, OnInit, Input, Output } from "@angular/core";
import { FinancialApiService } from "../../../services/financial-api.service";
import { DateRange } from 'src/dashboard/models/date-range.model';
import { interval, timer } from 'rxjs';
import { DashboardParentComponent } from '../../../components/parent/dashboard-parent.component';
import { map } from 'rxjs/operators';

@Component({
  selector: "app-update-request",
  templateUrl: "./update-request.component.html",
})
export class UpdateRequestComponent extends DashboardParentComponent {
  @Input()
  public dateRange: DateRange;
  @Output()
  public onUpdated = new EventEmitter();

  public progress: number = 0;
  constructor(private financialApiService: FinancialApiService) { super(); }

  public async UpdateRequest(): Promise<void> {
    if (this.dateRange === null) {
      return;
    }
    // 更新リクエスト・更新キーの取得
    const key =
      await
        this
          .financialApiService
          .PostUpdateRequest(
            this.dateRange.startDate,
            this.dateRange.endDate
          ).pipe(
            map(x => x.key)
          ).toPromise();

    const subscription = interval(500).subscribe(async x => {
      // 更新キーを使って進捗率の定期取得
      const result =
        await
          this
            .financialApiService
            .GetUpdateStatus(key)
            .toPromise();
      this.progress = result.progress;
      if (this.progress === 100) {
        this.onUpdated.emit();
        subscription.unsubscribe();
        // 完了後3秒経過でリセット
        timer(3000).subscribe(x => {
          this.progress = 0;
        });
        return;
      }
    });
    this.add(subscription);
  }
}
