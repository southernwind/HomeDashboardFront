import { Component, OnInit } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Settings } from '../../../models/settings.model';
import { SettingsApiService } from '../../../services/settings-api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: "financial-settings",
  templateUrl: "./financial-settings.component.html",
  styles: [
    `
      form {
        max-width: 600px;
      }
    `
  ]
})
export class FinancialSettingsComponent extends DashboardParentComponent implements OnInit {
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private settingsApiService: SettingsApiService,
    private message: NzMessageService) {
    super();
    this.form = formBuilder.group({
      mail: new FormControl(),
      password: new FormControl(),
    });
  }

  public async ngOnInit(): Promise<void> {
    const settings = await this.settingsApiService.GetSettings().toPromise();
    if (settings === undefined) {
      return;
    }
    this.form.patchValue({
      mail: settings.moneyForwardId,
      password: null
    });
  }

  public async onSubmit(): Promise<void> {
    const settings: Settings = {};
    if (this.form.controls.mail.dirty) {
      settings.moneyForwardId = this.form.value.mail;
    }
    if (this.form.controls.password.dirty) {
      settings.moneyForwardPassword = this.form.value.password;
    }
    try {
      await this.settingsApiService.UpdateSettings(settings).toPromise().catch(_ => {
        this.message.create("warning", "更新失敗");
        throw new Error();
      });
    } catch {
      return;
    }
    this.message.create("success", "更新成功");
  }
}
