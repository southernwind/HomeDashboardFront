import { Component, OnInit } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NetworkApiService } from 'src/dashboard/services/network-api.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { WakeOnLanTarget } from '../../../models/wake-on-lan-target.model';

@Component({
  templateUrl: "./wake-on-lan.component.html"
})
export class WakeOnLanComponent extends DashboardParentComponent implements OnInit {
  public targetMacAddress: string;

  public addTargetModalVisibility: boolean;
  public addTargetForm: FormGroup;
  public targetList: WakeOnLanTarget[];
  constructor(
    private networkApiService: NetworkApiService,
    private message: NzMessageService,
    formBuilder: FormBuilder,) {
    super();
    this.addTargetForm = formBuilder.group({
      macAddress: new FormControl("", Validators.pattern(new RegExp("^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$"))),
      deviceName: new FormControl("", Validators.required)
    });
  }

  public async ngOnInit(): Promise<void> {
    await this.getTargetList();
  }

  public async sendMagicPacket(): Promise<void> {
    if (await this.networkApiService.SendMagicPacket(this.targetMacAddress).toPromise()) {
      this.message.success("送信成功");
    } else {
      this.message.warning("送信失敗");
    }
  }

  public cancelAddTarget(): void {
    this.addTargetForm.setValue({
      macAddress: null,
      deviceName: null
    });
    this.addTargetModalVisibility = false;
  }

  public async addTarget(): Promise<void> {
    try {
      await this.networkApiService.RegisterWakeOnLanTarget({
        macAddress: this.addTargetForm.value.macAddress,
        deviceName: this.addTargetForm.value.deviceName
      }).toPromise();
    } catch{
      this.message.warning("登録失敗");
      return;
    }
    this.message.success("登録成功");
    this.addTargetForm.setValue({
      macAddress: null,
      deviceName: null
    });
    this.addTargetModalVisibility = false;
    await this.getTargetList();
  }

  public async deleteTarget(target: WakeOnLanTarget): Promise<void> {
    await this.networkApiService.DeleteWakeOnLanTarget(target).toPromise();
    await this.getTargetList();
  }

  public async getTargetList(): Promise<void> {
    this.targetList = await this.networkApiService.GetWakeOnLanTarget().toPromise();
  }
}
