import { Component, ViewChild, ElementRef } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { PalmieApiService } from '../../../services/palmie-api.service';
import { PalmieDailyLesson, PalmiePrimeLesson } from '../../../models/palmie-course.model';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import Enumerable from 'linq';
import { environment } from "../../../../environments/environment";

@UntilDestroy()
@Component({
  templateUrl: "./palmie-course.component.html",
  styleUrls: ["./palmie-course.component.scss"]
})
export class PalmieCourseComponent extends DashboardParentComponent {
  public lesson: PalmieDailyLesson | PalmiePrimeLesson | undefined = undefined;
  public dailyLesson: PalmieDailyLesson | undefined = undefined;
  public primeLesson: PalmiePrimeLesson | undefined = undefined;
  public primeLessons: PalmiePrimeLesson[] = [];
  public videoUrl: string | undefined = undefined;

  @ViewChild("video")
  public video: ElementRef | undefined;
  public playbackRate: number = 1;
  public get documentsUrl(): string {
    return environment.palmieDocumentsUrl;
  }
  constructor(route: ActivatedRoute, private palmieApiService: PalmieApiService) {
    super();
    var courseId = Number(route.snapshot.params["id"]);
    this.onInit
      .pipe(first(), untilDestroyed(this))
      .subscribe(async () => {
        var palmieCourses = await this.palmieApiService.GetSearchResult(`${courseId},`).toPromise();
        if (palmieCourses === undefined) {
          return;
        }
        this.lesson = Enumerable.from(palmieCourses.courses).where(x => x.course.id === courseId).firstOrDefault();
        if ((this.lesson as PalmieDailyLesson)?.dailyLessons) {
          this.dailyLesson = this.lesson as PalmieDailyLesson;
          this.setVideo(this.dailyLesson.chapter.videoId);
        }
        if ((this.lesson as PalmiePrimeLesson)?.primeLessons) {
          this.primeLesson = this.lesson as PalmiePrimeLesson;
          this.primeLessons = palmieCourses.courses.filter(x => x.course.id === courseId).map(x => x as PalmiePrimeLesson);
          this.setVideo(this.primeLesson.video.vimeoVideoId);
        }
      });
  }

  public setVideo(videoId: string | undefined): void {
    if (videoId === undefined) {
      return;
    }
    this.videoUrl = `${environment.palmieVideoUrl}${videoId}.mp4`;
  }

  public setVideoFromPrimeLessonId(primeLessonId: number): void {
    this.setVideo(Enumerable.from(this.primeLessons).firstOrDefault(x => x.video.id === primeLessonId)?.video.vimeoVideoId);
  }
  public playbackRateChange(playbackRate: string): void {
    try {
      if (this.video === undefined) {
        return;
      }
      this.video.nativeElement.playbackRate = Number(playbackRate);
    } catch (e) {
      console.log(e);
    }
  }
}