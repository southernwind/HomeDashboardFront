import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { IconDefinition } from "@ant-design/icons-angular";
import * as AllIcons from "@ant-design/icons-angular/icons";
import { FinancialComponent } from "./pages/financial/financial.component";
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssetTransitionComponent } from './pages/financial/asset/asset-transition/asset-transition.component';
import { UpdateRequestComponent } from './pages/financial/update-request/update-request.component';
import { DateRangeSelectorComponent } from './pages/financial/date-range-selector/date-range-selector.component';
import { AssetRatioComponent } from './pages/financial/asset/asset-ratio/asset-ratio.component';
import { AssetComponent } from './pages/financial/asset/asset.component';
import { FinancialTopComponent } from './pages/financial/financial-top/financial-top.component';
import { ExpenseComponent } from './pages/financial/expense/expense.component';
import { ExpenseTransitionComponent } from './pages/financial/expense/expense-transition/expense-transition.component';
import { ExpenseRatioComponent } from './pages/financial/expense/expense-ratio/expense-ratio.component';
import { ExpenseRawDataViewerComponent } from './pages/financial/expense/expense-raw-data-viewer/expense-raw-data-viewer.component';
import { IncomeComponent } from './pages/financial/income/income.component';
import { IncomeTransitionComponent } from './pages/financial/income/income-transition/income-transition.component';
import { IncomeRatioComponent } from './pages/financial/income/income-ratio/income-ratio.component';
import { IncomeRawDataViewerComponent } from './pages/financial/income/income-raw-data-viewer/income-raw-data-viewer.component';
import { PipesModule } from 'src/pipes/pipes.module';
import { NgZorroAntdModule } from 'src/shared/ng-zorro-antd.module';
import { SettingsComponent } from './pages/settings/settings.component';
import { FinancialSettingsComponent } from './pages/settings/financial-settings/financial-settings.component';
import { WakeOnLanComponent } from './pages/network/wake-on-lan/wake-on-lan.component';
import { NetworkComponent } from './pages/network/network.component';
import { NetworkTopComponent } from './pages/network/network-top/network-top.component';
import { DhcpLeasesComponent } from './pages/network/dhcp-leases/dhcp-leases.component';
import { KitchenTopComponent } from './pages/kitchen/kitchen-top/kitchen-top.component';
import { KitchenComponent } from './pages/kitchen/kitchen.component';

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
    FinancialTopComponent,
    AssetTransitionComponent,
    UpdateRequestComponent,
    AssetRatioComponent,
    AssetComponent,
    ExpenseComponent,
    ExpenseTransitionComponent,
    ExpenseRatioComponent,
    ExpenseRawDataViewerComponent,
    IncomeComponent,
    IncomeTransitionComponent,
    IncomeRatioComponent,
    IncomeRawDataViewerComponent,
    DateRangeSelectorComponent,
    SettingsComponent,
    FinancialSettingsComponent,
    NetworkComponent,
    NetworkTopComponent,
    WakeOnLanComponent,
    DhcpLeasesComponent,
    KitchenComponent,
    KitchenTopComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    DashboardRoutingModule,
    NgZorroAntdModule,
    HighchartsChartModule,
    NzIconModule.forRoot(icons),
    CommonModule
  ]
})
export class DashboardModule { }
