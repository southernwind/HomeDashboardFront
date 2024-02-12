import { ParentComponent } from 'src/components/parent/parent.component';
import { OnInit, OnDestroy, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, SimpleChanges, Directive } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Directive()
export abstract class DashboardParentComponent extends ParentComponent implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  private onInitSubject: Subject<void> | undefined;
  protected get onInit(): Observable<void> {
    if (!this.onInitSubject) {
      this.onInitSubject = new Subject<void>();
    }
    return this.onInitSubject.asObservable();
  }

  private onChangesSubject: Subject<SimpleChanges> | undefined;
  protected get onChanges(): Observable<SimpleChanges> {
    if (!this.onChangesSubject) {
      this.onChangesSubject = new Subject<SimpleChanges>();
    }
    return this.onChangesSubject.asObservable();
  }

  private doCheckSubject: Subject<void> | undefined;
  protected get doCheck(): Observable<void> {
    if (!this.doCheckSubject) {
      this.doCheckSubject = new Subject<void>();
    }
    return this.doCheckSubject.asObservable();
  }

  private afterContentInitSubject: Subject<void> | undefined;
  protected get afterContentInit(): Observable<void> {
    if (!this.afterContentInitSubject) {
      this.afterContentInitSubject = new Subject<void>();
    }
    return this.afterContentInitSubject.asObservable();
  }

  private afterContentCheckedSubject: Subject<void> | undefined;
  protected get afterContentChecked(): Observable<void> {
    if (!this.afterContentCheckedSubject) {
      this.afterContentCheckedSubject = new Subject<void>();
    }
    return this.afterContentCheckedSubject.asObservable();
  }

  private afterViewInitSubject: Subject<void> | undefined;
  protected get afterViewInit(): Observable<void> {
    if (!this.afterViewInitSubject) {
      this.afterViewInitSubject = new Subject<void>();
    }
    return this.afterViewInitSubject.asObservable();
  }

  private afterViewCheckedSubject: Subject<void> | undefined;
  protected get afterViewChecked(): Observable<void> {
    if (!this.afterViewCheckedSubject) {
      this.afterViewCheckedSubject = new Subject<void>();
    }
    return this.afterViewCheckedSubject.asObservable();
  }

  private onDestroySubject: Subject<void> | undefined;
  protected get onDestroy(): Observable<void> {
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