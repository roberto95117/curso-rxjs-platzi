import { Observable } from "rxjs";

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