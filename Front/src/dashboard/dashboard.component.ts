import { Component, OnInit } from "@angular/core";
import { DashboardParentComponent } from './components/parent/dashboard-parent.component';

@Component({
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard-component.scss"],
})
export class DashboardComponent extends DashboardParentComponent implements OnInit {
  ngOnInit(): void { }
}
