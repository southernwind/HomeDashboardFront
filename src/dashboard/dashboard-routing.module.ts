import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { FinancialComponent } from "./pages/financial/financial.component";
import { AssetComponent } from './pages/financial/asset/asset.component';
import { FinancialTopComponent } from './pages/financial/financial-top/financial-top.component';
import { ExpenseComponent } from './pages/financial/expense/expense.component';
import { IncomeComponent } from './pages/financial/income/income.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NetworkComponent } from './pages/network/network.component';
import { NetworkTopComponent } from './pages/network/network-top/network-top.component';
import { WakeOnLanComponent } from './pages/network/wake-on-lan/wake-on-lan.component';
import { DhcpLeasesComponent } from './pages/network/dhcp-leases/dhcp-leases.component';
import { KitchenComponent } from './pages/kitchen/kitchen.component';
import { KitchenTopComponent } from './pages/kitchen/kitchen-top/kitchen-top.component';
import { AquariumComponent } from './pages/aquarium/aquarium.component';
import { AquariumTopComponent } from './pages/aquarium/aquarium-top/aquarium-top.component';
import { AquariumPastComponent } from './pages/aquarium/aquarium-past/aquarium-past.component';
import { NetworkDiagramComponent } from './pages/network/network-diagram/network-diagram.component';
import { PalmieComponent } from './pages/palmie/palmie.component';
import { PalmieTopComponent } from './pages/palmie/palmie-top/palmie-top.component';
import { PalmieCourseComponent } from './pages/palmie/palmie-course/palmie-course.component';
import { LinksComponent } from './pages/links/links.component';
import { ElectricPowerTopComponent } from './pages/electric-power/electric-power-top/electric-power-top.component';
import { ElectricPowerComponent } from './pages/electric-power/electric-power.component';
import { ElectricPowerPastComponent } from './pages/electric-power/electric-power-past/electric-power-past.component';
import { DashboardTopComponent } from './dashboard-top.component';
import { InvestmentComponent } from './pages/financial/investment/investment.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: DashboardTopComponent
      },
      {
        path: "aquarium",
        component: AquariumComponent,
        children: [
          {
            path: "",
            component: AquariumTopComponent,
          },
          {
            path: "past",
            component: AquariumPastComponent,
          },
        ],
      },
      {
        path: "financial",
        component: FinancialComponent,
        children: [
          {
            path: "",
            component: FinancialTopComponent,
          },
          {
            path: "asset",
            component: AssetComponent,
          },
          {
            path: "expense",
            component: ExpenseComponent
          },
          {
            path: "income",
            component: IncomeComponent
          },
          {
            path: "investment",
            component: InvestmentComponent
          }
        ],
      },
      {
        path: "electric-power",
        component: ElectricPowerComponent,
        children: [
          {
            path: "",
            component: ElectricPowerTopComponent
          },
          {
            path: "past",
            component: ElectricPowerPastComponent
          }
        ]
      },
      {
        path: "kitchen",
        component: KitchenComponent,
        children: [
          {
            path: "",
            component: KitchenTopComponent,
          },
        ],
      },
      {
        path: "palmie",
        component: PalmieComponent,
        children: [
          {
            path: "",
            component: PalmieTopComponent
          },
          {
            path: ":id",
            component: PalmieCourseComponent
          }
        ]
      },
      {
        path: "network",
        component: NetworkComponent,
        children: [
          {
            path: "",
            component: NetworkTopComponent,
          },
          {
            path: "dhcp-leases",
            component: DhcpLeasesComponent
          },
          {
            path: "wake-on-lan",
            component: WakeOnLanComponent,
          },
          {
            path: "diagram",
            component: NetworkDiagramComponent,
          }
        ],
      },
      {
        path: "settings",
        component: SettingsComponent
      },
      {
        path: "links",
        component: LinksComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
