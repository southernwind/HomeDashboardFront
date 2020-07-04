import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';

@Component({
  templateUrl: "./network-diagram.component.html"
})
export class NetworkDiagramComponent extends DashboardParentComponent {
  constructor() {
    super();
  }
}
