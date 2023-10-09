import { fromEvent, Subject } from "rxjs";
import WORD__LIST from './wordList.json';

const onKeyDown$ = fromEvent(document, 'keydown');
const getRandomWord = () => WORD__LIST[Math.round(Math.random() * WORD__LIST.length)];
const userWinOrLoose = new Subject();
const messageText = document.getElementById("message-text");

let letterIndex = 0;
let letterRowIndex = 0;
let letterRows = document.getElementsByClassName('letter-row');
let userAnswer = [];
let answer = getRandomWord();
console.log('answer', answer);


const insertLetter = {
    next: (event) => {        
        const pressedKey = event.key;
        if(pressedKey.length === 1 && pressedKey.match(/[a-z]/i)){
            let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
            letterBox.textContent = pressedKey;
            letterBox.classList.add('filled-letter');
            letterIndex++;
            userAnswer.push(pressedKey);
        }
    }
}

const checkWord = {
    next: (event) => {
        if(event.key === 'Enter'){            
            const rightWordArray = Array.from(answer);
            for(let i = 0; i < 5; i++){
                let letterColor = "";
                let letterBox = Array.from(letterRows)[letterRowIndex].children[i];
                let letterPosition = rightWordArray.indexOf(userAnswer[i]);
    
                if(letterPosition === -1){
                    letterColor = 'letter-grey';
                }else if(rightWordArray[i] === userAnswer[i]){
                    letterColor = 'letter-green';
                }else{
                    letterColor = 'letter-yellow';
                }
                letterBox.classList.add(letterColor);
            }    

            if(userAnswer.length == 5){
                letterIndex = 0;
                userAnswer = [];
                letterRowIndex++;
            }else{
                messageText.textContent = 'faltan algunas letras';
            }
            if(userAnswer.join("") === answer){
                userWinOrLoose.next('val');
            }
        }
    }
}

const deleteLetter = {
    next: (event) => {
        const pressedKey = event.key;
        if(pressedKey === 'Backspace' && letterIndex !== 0){
            let currentRow = letterRows[letterRowIndex];
            let letterBox = currentRow.children[letterIndex -1];
            letterBox.textContent = "";
            letterBox.classList.remove('filled-letter');
            letterIndex--;
            userAnswer.pop();
        }

    }
}

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
onKeyDown$.subscribe(deleteLetter);

userWinOrLoose.subscribe(val => {
    let letterRowsWinned= Array.from(letterRows)[letterRowIndex];
    for(let i =0; i < 5; i++){
        letterRowsWinned.children[i].classList.add('letter-green');
    }
});
