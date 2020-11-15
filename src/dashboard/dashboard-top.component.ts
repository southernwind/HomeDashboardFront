import { Component } from "@angular/core";
import { DashboardParentComponent } from './components/parent/dashboard-parent.component';

@Component({
  templateUrl: "./dashboard-top.component.html"
})
export class DashboardTopComponent extends DashboardParentComponent {
  constructor() {
    super();
  }
}
