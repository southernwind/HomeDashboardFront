import { NgModule } from '@angular/core';
import { DatetimeFormatPipe } from './datetime-format.pipe';
import { FirstOrDefaultPipe } from './first-or-default.pipe';
@NgModule({
  declarations: [DatetimeFormatPipe, FirstOrDefaultPipe],
  imports: [],
  exports: [DatetimeFormatPipe, FirstOrDefaultPipe]
})
export class PipesModule { }