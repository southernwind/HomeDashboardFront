import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { PanelComponent } from "./panel.component";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PanelComponent],
  exports: [PanelComponent],
})
export class PanelModule {}
