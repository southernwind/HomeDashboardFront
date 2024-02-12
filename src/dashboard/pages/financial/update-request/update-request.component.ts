import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FinancialApiService } from "../../../services/financial-api.service";
import { DateRange } from 'src/dashboard/models/date-range.model';
import { interval, timer } from 'rxjs';
import { DashboardParentComponent } from '../../../components/parent/dashboard-parent.component';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: "app-update-request",
  templateUrl: "./update-request.component.html",
})
export class UpdateRequestComponent extends DashboardParentComponent {
  @Input()
  public dateRange: DateRange | undefined = undefined;
  @Output()
  public onUpdated = new EventEmitter();

  public progress: number = 0;
  constructor(private financialApiService: FinancialApiService) { super(); }

  public async UpdateRequest(): Promise<void> {
    if (this.dateRange === undefined) {
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

    if (key === undefined) {
      return;
    }
    const subscription = interval(500)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(async x => {
        // 更新キーを使って進捗率の定期取得
        const result =
          await
            this
              .financialApiService
              .GetUpdateStatus(key)
              .toPromise();
        if (result === undefined) {
          return;
        }
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
  }
}
