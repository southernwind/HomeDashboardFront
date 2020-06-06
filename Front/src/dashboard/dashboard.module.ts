import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { NgZorroAntdModule } from "ng-zorro-antd";

import { NZ_ICONS, NzIconModule } from "ng-zorro-antd/icon";
import { NZ_I18N, en_US } from "ng-zorro-antd/i18n";
import { IconDefinition } from "@ant-design/icons-angular";
import * as AllIcons from "@ant-design/icons-angular/icons";

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    DashboardRoutingModule,
    NgZorroAntdModule,
    NzIconModule.forRoot(icons),
  ],
})
export class DashboardModule {}
