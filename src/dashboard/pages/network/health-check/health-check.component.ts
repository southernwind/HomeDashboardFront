import { Component, OnInit } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { NetworkApiService } from 'src/dashboard/services/network-api.service';
import { HealthCheckResult } from 'src/dashboard/models/health-check-result.model';
import { firstValueFrom } from 'rxjs';

@Component({
  templateUrl: "./health-check.component.html",
  styleUrls: ["./health-check.component.scss"]
})
export class HealthCheckComponent extends DashboardParentComponent implements OnInit {
  public results: HealthCheckResult[] = [];
  constructor(
    private networkApiService: NetworkApiService) {
    super();
  }

  public async ngOnInit(): Promise<void> {
    await this.getLatestResult();
  }

  public async getLatestResult(): Promise<void> {
    this.results = await firstValueFrom(this.networkApiService.GetLatestResult());
  }
}
