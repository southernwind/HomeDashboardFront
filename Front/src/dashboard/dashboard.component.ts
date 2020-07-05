import { Component, OnInit } from "@angular/core";
import { DashboardParentComponent } from './components/parent/dashboard-parent.component';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard-component.scss"],
  providers: [Title]
})
export class DashboardComponent extends DashboardParentComponent {
  constructor(title: Title) {
    super();
    title.setTitle("Home Dashboard");
  }
}
