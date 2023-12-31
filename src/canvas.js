import { fromEvent, merge } from "rxjs";
import { map, mergeAll, takeUntil } from "rxjs/operators";

const canvas = document.getElementById("reactive-canvas");
const restartButton2 = document.getElementById("restart-button-2");

const cursorPosition = { x: 0, y: 0 };

const updateCursorPosition = (event) => {
  cursorPosition.x = event.clientX - canvas.offsetLeft;
  cursorPosition.y = event.clientY - canvas.offsetTop;
};

const onMouseDown$ = fromEvent(canvas, "mousedown");
onMouseDown$.subscribe(updateCursorPosition);
const onMouseUp$ = fromEvent(canvas, "mouseup");
const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(takeUntil(onMouseUp$));


onMouseDown$.subscribe();

const canvasContext = canvas.getContext("2d");
canvasContext.lineWidth = 8;
canvasContext.lineJoin = 'round';
canvasContext.lineCap = 'round';
canvasContext.strokeStyle = "white";

// El método paintStroke nos permitirá dibujar una línea obteniendo las posiciones del cursor (cursorPosition).
// ✍️ A la vez, mientras el usuario/a mueve el cursor actualizamos esa posición (ver línea 34)
const paintStroke = (event) => {
  canvasContext.beginPath();
  canvasContext.moveTo(cursorPosition.x, cursorPosition.y);
  updateCursorPosition(event);
  canvasContext.lineTo(cursorPosition.x, cursorPosition.y);
  canvasContext.stroke();
  canvasContext.closePath();
};

// 🔀 A través de mergeAll() empezamos a enviar los eventos de onMouseMove$ mapeados en la línea 43,
// para luego enviarlos en un observable de salida al observador paintStroke (ver línea 47 y 31)
const startPaint$ = onMouseDown$.pipe(
  map(() => onMouseMove$),
  mergeAll()
);



let startPaintSubs =  startPaint$.subscribe(paintStroke);

const onLoadWindow$ = fromEvent(window, 'load');
const onRestartCanvas$ = fromEvent(restartButton2, 'click');

const restartCanvas$ = merge(onLoadWindow$, onRestartCanvas$);

restartCanvas$.subscribe( () => {
  startPaintSubs.unsubscribe();
  canvasContext.clearRect(0,0, canvas.width, canvas.height);
  startPaintSubs = startPaint$.subscribe(paintStroke);
});