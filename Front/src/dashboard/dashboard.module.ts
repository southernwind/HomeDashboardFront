import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { IconDefinition } from "@ant-design/icons-angular";
import * as AllIcons from "@ant-design/icons-angular/icons";
import { FinancialComponent } from "./pages/financial/financial.component";
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssetTransitionComponent } from './pages/financial/asset/asset-transition/asset-transition.component';
import { UpdateRequestComponent } from './pages/financial/update-request/update-request.component';
import { DateRangeSelectorComponent } from './components/date-range-selector/date-range-selector.component';
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
import { AquariumTopComponent } from './pages/aquarium/aquarium-top/aquarium-top.component';
import { AquariumComponent } from './pages/aquarium/aquarium.component';
import { WaterStatesComponent } from './pages/aquarium/water-states/water-states.component';
import { AquaPeriodSelectorComponent } from './pages/aquarium/aquaPeriodSelector/aqua-period-selector.component';
import { CurrentWaterStatesComponent } from './pages/aquarium/current-water-state/current-water-states.component';
import { AquariumPastComponent } from './pages/aquarium/aquarium-past/aquarium-past.component';
import { NetworkDiagramComponent } from './pages/network/network-diagram/network-diagram.component';
import { PalmieComponent } from './pages/palmie/palmie.component';
import { PalmieTopComponent } from './pages/palmie/palmie-top/palmie-top.component';
import { PalmieCourseComponent } from './pages/palmie/palmie-course/palmie-course.component';
import { LinksComponent } from './pages/links/links.component';
import { ElectricPowerComponent } from './pages/electric-power/electric-power.component';
import { ElectricPowerPastComponent } from './pages/electric-power/electric-power-past/electric-power-past.component';
import { ElectricPowerTopComponent } from './pages/electric-power/electric-power-top/electric-power-top.component';
import { ElectricPowerRealtimeChartComponent } from './pages/electric-power/electric-power-realtime-chart/electric-power-realtime-chart.component';

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
    NetworkDiagramComponent,
    KitchenComponent,
    KitchenTopComponent,
    AquariumComponent,
    AquariumTopComponent,
    AquariumPastComponent,
    AquaPeriodSelectorComponent,
    WaterStatesComponent,
    CurrentWaterStatesComponent,
    PalmieComponent,
    PalmieTopComponent,
    PalmieCourseComponent,
    LinksComponent,
    ElectricPowerComponent,
    ElectricPowerTopComponent,
    ElectricPowerPastComponent,
    ElectricPowerRealtimeChartComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    DashboardRoutingModule,
    NgZorroAntdModule,
    ChartModule,
    NzIconModule.forRoot(icons),
    CommonModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [more, exporting] }
  ]
})
export class DashboardModule { }
