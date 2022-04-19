import {map, mergeMap, Observable, scan, startWith, take, timer} from "rxjs";

export function windowedCount<T>(windowLength: number) {
  return function (incoming: Observable<T>): Observable<number> {
    return incoming.pipe(
      mergeMap(() =>
        timer(0, windowLength).pipe(
          take(2),
          map((_, i) => (i === 0 ? ('start' as const) : ('stop' as const)))
        )
      ),
      scan((acc, signal) => (signal === 'start' ? acc + 1 : acc - 1), 0),
      startWith(0)
    );
  };
}
