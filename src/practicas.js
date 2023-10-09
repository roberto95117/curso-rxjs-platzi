import { Observable, Subject, from, of, asyncScheduler, interval, timer } from "rxjs";

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