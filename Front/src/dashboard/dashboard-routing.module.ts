import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { FinancialComponent } from "./pages/financial/financial.component";
import { AssetComponent } from './pages/financial/asset/asset.component';
import { FinancialTopComponent } from './pages/financial/financial-top/financial-top.component';
import { ExpenseComponent } from './pages/financial/expense/expense.component';
import { IncomeComponent } from './pages/financial/income/income.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
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
          }
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
