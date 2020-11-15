import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { DateRange } from 'src/dashboard/models/date-range.model';
import { CookieService } from 'ngx-cookie-service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { PalmieApiService } from '../../../services/palmie-api.service';
import { PalmieDailyLesson, PalmiePrimeLesson, PalmieCourses } from '../../../models/palmie-course.model';
import { first, throttle, filter } from 'rxjs/operators';
import * as Enumerable from 'linq';
import { interval, Subject } from 'rxjs';

@UntilDestroy()
@Component({
  templateUrl: "./palmie-top.component.html",
  styleUrls: ["./palmie-top.component.scss"]
})
export class PalmieTopComponent extends DashboardParentComponent {
  public dailyLessons: PalmieDailyLesson[];
  public primeLessons: PalmiePrimeLesson[];
  public searchWord: string;
  public searchWordUpdated = new Subject<string>();
  constructor(private palmieApiService: PalmieApiService) {
    super();
    this.onInit
      .pipe(first(), untilDestroyed(this))
      .subscribe(async () => this.search(''));
    this.searchWordUpdated
      .pipe(
        untilDestroyed(this))
      .subscribe(async x => this.search(x));
  }

  public searchWordUpdate(word: string) {
    this.searchWordUpdated.next(word);
  }

  private async search(word: string): Promise<void> {
    const palmieCourses
      = word.length === 0 ?
        await this.palmieApiService.GetCourses().toPromise() :
        await this.palmieApiService.GetSearchResult(word).toPromise();
    this.dailyLessons = palmieCourses.courses.filter(x => (x as PalmieDailyLesson)?.dailyLessons).map(x => x as PalmieDailyLesson);
    this.primeLessons = Enumerable.from(palmieCourses.courses).where(x => (x as PalmiePrimeLesson)?.primeLessons !== undefined).distinct(x => x.course.id).select(x => x as PalmiePrimeLesson).toArray();
  }
}