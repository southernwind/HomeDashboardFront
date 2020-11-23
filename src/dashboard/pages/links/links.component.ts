import { Component } from "@angular/core";
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';

@Component({
  templateUrl: "./links.component.html",
})
export class LinksComponent extends DashboardParentComponent {
  public links: { label: string, url: string }[] = [
    { label: "jenkins", url: "//jenkins.home-server.localnet/" },
    { label: "ZABBIX", url: "//zabbix.home-server.localnet/" }
  ];
}
