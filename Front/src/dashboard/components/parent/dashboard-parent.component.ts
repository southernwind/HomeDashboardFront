import { ParentComponent } from 'src/components/parent/parent.component';
import { OnInit, OnDestroy, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, SimpleChanges, Directive } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Directive()
export abstract class DashboardParentComponent extends ParentComponent implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  private onInitSubject;
  protected get onInit(): Observable<void> {
    if (!this.onInitSubject) {
      this.onInitSubject = new Subject<void>();
    }
    return this.onInitSubject.asObservable();
  }

  private onChangesSubject;
  protected get onChanges(): Observable<SimpleChanges> {
    if (!this.onChangesSubject) {
      this.onChangesSubject = new Subject<void>();
    }
    return this.onChangesSubject.asObservable();
  }

  private doCheckSubject;
  protected get doCheck(): Observable<SimpleChanges> {
    if (!this.doCheckSubject) {
      this.doCheckSubject = new Subject<void>();
    }
    return this.doCheckSubject.asObservable();
  }

  private afterContentInitSubject;
  protected get afterContentInit(): Observable<SimpleChanges> {
    if (!this.afterContentInitSubject) {
      this.afterContentInitSubject = new Subject<void>();
    }
    return this.afterContentInitSubject.asObservable();
  }

  private afterContentCheckedSubject;
  protected get afterContentChecked(): Observable<SimpleChanges> {
    if (!this.afterContentCheckedSubject) {
      this.afterContentCheckedSubject = new Subject<void>();
    }
    return this.afterContentCheckedSubject.asObservable();
  }

  private afterViewInitSubject;
  protected get afterViewInit(): Observable<SimpleChanges> {
    if (!this.afterViewInitSubject) {
      this.afterViewInitSubject = new Subject<void>();
    }
    return this.afterViewInitSubject.asObservable();
  }

  private afterViewCheckedSubject;
  protected get afterViewChecked(): Observable<SimpleChanges> {
    if (!this.afterViewCheckedSubject) {
      this.afterViewCheckedSubject = new Subject<void>();
    }
    return this.afterViewCheckedSubject.asObservable();
  }

  private onDestroySubject;
  protected get onDestroy(): Observable<SimpleChanges> {
    if (!this.onDestroySubject) {
      this.onDestroySubject = new Subject<void>();
    }
    return this.onDestroySubject.asObservable();
  }

  ngOnInit(): void {
    this.onInitSubject?.next();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.onChangesSubject?.next(changes);
  }

  ngDoCheck(): void {
    this.doCheckSubject?.next();
  }

  ngAfterContentInit(): void {
    this.afterContentInitSubject?.next();
  }

  ngAfterContentChecked(): void {
    this.afterContentCheckedSubject?.next();
  }

  ngAfterViewInit(): void {
    this.afterViewInitSubject?.next();
  }

  ngAfterViewChecked(): void {
    this.afterViewCheckedSubject?.next();
  }

  ngOnDestroy(): void {
    this.onDestroySubject?.next();
  }
}