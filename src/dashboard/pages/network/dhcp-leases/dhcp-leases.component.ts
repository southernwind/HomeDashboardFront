import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { NetworkApiService } from 'src/dashboard/services/network-api.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { DhcpLease } from '../../../models/dhcp-lease.model';
import Enumerable from 'linq';

@UntilDestroy()
@Component({
  templateUrl: "./dhcp-leases.component.html",
})
export class DhcpLeasesComponent extends DashboardParentComponent {
  public dhcpLeases: DhcpLease[];
  constructor(
    private networkApiService: NetworkApiService) {
    super();
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this
          .networkApiService
          .GetDhcpLeases()
          .pipe(untilDestroyed(this))
          .subscribe(x => {
            this.dhcpLeases = Enumerable.from(x).orderBy(x => {
              // IPv4だけ対象とする
              if (x.ipAddress.indexOf(":") !== -1) {
                return x.ipAddress;
              }
              return Enumerable.from(x.ipAddress.split(".")).select(x => `00${x}`.slice(-3)).toArray().join(".");
            }).toArray();
          })
      });
  }
}
