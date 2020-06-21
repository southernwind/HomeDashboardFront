import { Component, OnInit } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NetworkApiService } from 'src/dashboard/services/network-api.service';

@Component({
  templateUrl: "./wake-on-lan.component.html",
})
export class WakeOnLanComponent extends DashboardParentComponent implements OnInit {
  public targetMacAddress: string;
  constructor(
    private networkApiService: NetworkApiService,
    private message: NzMessageService) {
    super();
  }

  public async ngOnInit(): Promise<void> {
  }

  public async sendMagicPacket(): Promise<void> {
    if (await this.networkApiService.SendMagicPacket(this.targetMacAddress).toPromise()) {
      this.message.success("送信成功");
    } else {
      this.message.success("送信失敗");
    }
  }
}
