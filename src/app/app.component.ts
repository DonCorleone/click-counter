import {Component, ElementRef, ViewChild} from '@angular/core';
import {EMPTY, fromEvent, Observable, scan, startWith} from "rxjs";
import {windowedCount} from "./windowed-count";
import {ChartData, createChartData} from "./chart-data";

function createClickObservable(target: ElementRef): Observable<MouseEvent> {
  return fromEvent(target.nativeElement, 'click');
}

function count<T>(incoming: Observable<T>): Observable<number>{
  return incoming.pipe(
    scan((acc) => acc + 1,0),
    startWith(0)
  );
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('button', { static: true }) button!: ElementRef ;
  private _buttonClicks$!: Observable<MouseEvent>;
  clickCounter$!: Observable<number>;
  lastSecondCounter$!: Observable<number>;
  lastFiveSecondsCounter$!: Observable<number>;
  lastFifteenSecondsCounter$!: Observable<number>;
  chartData$!: Observable<ChartData>;

  ngOnInit(): void {
    if (this.button){
      this._buttonClicks$ = createClickObservable(this.button);
    }
    this.clickCounter$ = this._buttonClicks$.pipe(count);
    this.lastSecondCounter$ = this._buttonClicks$.pipe(windowedCount(1000));
    this.lastFiveSecondsCounter$ = this._buttonClicks$.pipe(
      windowedCount(5000)
    );
    this.lastFifteenSecondsCounter$ = this._buttonClicks$.pipe(
      windowedCount(15000)
    );
    this.chartData$ = createChartData({
      oneSecondWindow: this.lastSecondCounter$,
      fiveSecondWindow: this.lastFiveSecondsCounter$,
      fifteenSecondWindow: this.lastFifteenSecondsCounter$,
    });
  }
}
