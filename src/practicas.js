import { Observable, Subject, from, of, asyncScheduler, interval, timer, fromEvent, distinct, distinctUntilChanged, distinctUntilKeyChanged  } from "rxjs";
import { map, reduce, filter, debounceTime, sampleTime, throttleTime, mergeWith, mergeAll, mergeMap, takeUntil, startWith, endWith, catchError, retry } from "rxjs/operators";
import { ajax } from 'rxjs/ajax';
import { fromFetch } from "rxjs/fetch";

//Observable
const observableAlfa$ = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    //linea para que de error
    a+ b;
    //para que se comlete, ya no se escuchan los valores siguientes
    subscriber.complete();
    subscriber.next('valor');
    subscriber.next({'test' : true});    
});


const observador = {
    next: (value) =>{console.log(value)},
    complete: () =>{},
    error: (error) =>{console.log('error recibido',error)}
}

observableAlfa$.subscribe(observador);

const onMouseMouve$ = fromEvent(document, 'mousemove');

onMouseMouve$.subscribe((event) => {
    console.log(event.screenX);
});

//subject
const randomNumber$ = new Subject();

randomNumber$.subscribe(val => {console.log('subs1',val)});
randomNumber$.subscribe(val => {console.log('subs2',val)});

randomNumber$.next(Math.round(Math.random() * 100));

//from - of 
const fruitFrom$ = from(['apple', 'tangerine', 'pear'], asyncScheduler);
const fruitOf$ = of('apple', 'tangerine', 'pear');

fruitFrom$.subscribe(console.log);
fruitOf$.subscribe(console.log);

//interval - timer
const sequenceNumbers$ = interval(1000);
const delayedTimer$ = timer(5000);

sequenceNumbers$.subscribe(console.log);
delayedTimer$.subscribe(console.log);

//map
const numbersMap$ = from([1,2,3,4,5,6,7])
.pipe(
  map(number => number * 2)
);

numbersMap$.subscribe(console.log);

//reduce
const numbersReduce$ = from([1,2,3,4,5,6,7])
.pipe(
  reduce((acc, val) => acc + val , 0)
);

numbersReduce$.subscribe(console.log);

//filter
const numbersFilter$ = from([1,2,3,4,5,6,7])
.pipe(
  filter(number => number > 4)
);

numbersFilter$.subscribe(console.log);


//distinct
const numbersRepitedD$ = of(1,2,3,2,5,6,1,3,7,8).pipe(
  distinct()
);

numbersRepitedD$.subscribe(console.log());

//distinctUntilChanged
const numbersRepitedUc$ = of(1,2,3,2,5,6,1,3,7,8).pipe(
  distinctUntilChanged()
);

numbersRepitedUc$.subscribe(console.log());

//distinctUntilChanged
const numbersRepitedUkc$ = of({'k': 1}, {'k': 1}, {'k': 3}, {'k': 4}, {'k': 4}, {'k': 5}, {'k': 5}).pipe(
  distinctUntilKeyChanged('k')
);

numbersRepitedUkc$.subscribe(console.log());

//operadores de tiempo
const onClick$ = fromEvent(document, 'click').pipe(
  debounceTime(1000),
  sampleTime(1000),
  debounceTime(1000),
  throttleTime(1000)
)

onClick$.subscribe(console.log);

//merge
const onClick1$ = fromEvent(document, "click").pipe(
  map(event => event.type) // "click"
);
const onMouseMove$ = fromEvent(document, "mousemove").pipe(
  map(event => event.type) // "mousemove"
);

const eventMergeWith$ = onMouseMove$.pipe(
  mergeWith(onClick1$)
);

eventMergeWith$.subscribe((value) => {
  console.log("obs: ", value)
});

//mergeAll
const onClick2$ = fromEvent(document, "click");
const ordenSuperior$ = onClick2$.pipe(
    map(() => interval(1000))
);

const primerOrden$ = ordenSuperior$.pipe(
    mergeAll()
);

primerOrden$.subscribe(console.log);

//mergeMap
const letters$ = from(["A", "B", "C"]);
const result$ = letters$.pipe(
    // Anidando el observable letters$ con el observable interval.
    mergeMap(letter => interval(1000).pipe(
        // Anida una letra por cada segundo
        map(
            second => letter + second
        )
    ))
);

result$.subscribe(console.log);

//takeUntil
const onMouseMoveU$ = fromEvent(document, 'mousemove');
const onMouseDownU$ = fromEvent(document, 'mousedown');

const sourceCompleted$ = onMouseMoveU$.pipe(takeUntil(onMouseDownU$));

sourceCompleted$.subscribe(console.log);

//startWith
const lettersStart$ = of('a','b','c','d').pipe(startWith('f'));

lettersStart$.subscribe(console.log);

//endWith
const lettersEndWith$ = of('a','b','c','d').pipe(endWith('f'));

lettersEndWith$.subscribe(console.log);

//catchError & retry
const lettersCatchError$ = of('a','b','c','d').pipe(
  map(item => {
    if(item == 'c'){
      x = 5;
    }
  }),
  retry(3),
  catchError(error => of(error.message))
);

lettersCatchError$.subscribe(console.log);


//ajax
const ditto$ = ajax("https://pokeapi.co/api/v2/pokemon/itto").pipe(
  map((data) => console.log(data.response)),
  catchError((error) => {
    console.log("Error: ", error.message);
    return of(error);
  })
);

ditto$.subscribe(console.log);


const postRequest$ = ajax({
  url: "https://httpbin.org/delay/5",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    message: "¿Dónde está Ditto?",
  },
}).pipe(
  map((response) => {
    console.log(response);
    return response;
  }),
  catchError((error) => {
    console.log("Error: ", error.message);
    return of(error);
  })
);

postRequest$.subscribe(console.log);

//fromFetch
// Petición HTTP con un retraso de 4 segundos.
const url = "https://httpbin.org/delay/4";
const dittoFetch$ = fromFetch(url).pipe(
  mergeMap((response) => {
    return response.json();
  }),
  takeUntil(timer(6000)) // ⬅️ Puedes modificar la cantidad de milisegundos
                         //   para abortar una petición HTTP enviada.
);

dittoFetch$.subscribe(console.log);