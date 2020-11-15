import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardModule } from "../dashboard/dashboard.module";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadChildren: () => DashboardModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
