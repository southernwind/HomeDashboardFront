import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NZ_ICONS, NzIconModule } from "ng-zorro-antd/icon";
import { IconDefinition } from "@ant-design/icons-angular";
import * as AllIcons from "@ant-design/icons-angular/icons";
import { FinancialComponent } from "./pages/financial/financial.component";
import { ChartsModule } from "ng2-charts";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './pages/financial/assets/assets.component';
import { UpdateRequestComponent } from './pages/financial/update-request/update-request.component';
import { DateRangeSelectorComponent } from './pages/financial/date-range-selector/date-range-selector.component';
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

@NgModule({
  declarations: [
    DashboardComponent,
    FinancialComponent,
    AssetsComponent,
    UpdateRequestComponent,
    DateRangeSelectorComponent
  ],
  imports: [
    FormsModule,
    DashboardRoutingModule,
    NgZorroAntdModule,
    ChartsModule,
    NzIconModule.forRoot(icons),
    CommonModule
  ]
})
export class DashboardModule { }
