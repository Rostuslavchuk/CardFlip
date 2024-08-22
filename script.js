document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault(); 
    getUserForStart();
});

const CONSTANTS = {
    userInGame: document.getElementById('header__user_in-play'),
    counter_1: document.getElementById("counter__1"),
    counter_2: document.getElementById("counter__2"),
    cardsArea: document.getElementById("body__game"),
    colorUserInGame: '',
    text: "",
    firstClick: false, 
    secondClick: false,
    firstCardToCompareValue: null,
    secondCardToCompareValue: null
}
async function getUserForStart(){
    const num = Math.random() - 0.5;

    CONSTANTS.colorUserInGame = num < 0 ? "blue" : 'red';
    CONSTANTS.text = num < 0 ? "User 1" : 'User 2';

    if(CONSTANTS.colorUserInGame){
        CONSTANTS.userInGame.style.color = CONSTANTS.colorUserInGame;
        CONSTANTS.userInGame.textContent = CONSTANTS.text;
    }

    let cards = await getCards();

    let sortedCards = await randomSort(cards); 

    for (const element of sortedCards) {
        CONSTANTS.cardsArea.insertAdjacentHTML("beforeend", element.card);
    }

}
async function getCards(){
    try {   
        const response = await fetch("./cards.json").then(response => response.json());
        if(response){
            return response.cards;
        }
    } catch (error) {
        throw new Error(error);
    }
}
async function randomSort(arr){
    for (let i = 0; i < arr.length; i++) {
        let j =  Math.ceil(Math.random() * (arr.length - 1));      
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const handleCardClick = (e) => {
    e.preventDefault();

    const target = e.target;
    const card = target.parentNode;

    if (!card.classList.contains('card') || 
        card.classList.contains('firstClick') || 
        card.classList.contains('secondClick')) {
        return;
    }

    if (!CONSTANTS.firstClick) {
        card.classList.add("clicked", 'firstClick');
        CONSTANTS.firstCardToCompareValue = card;
        CONSTANTS.firstClick = true;
    } 
    else if (!CONSTANTS.secondClick) {
        card.classList.add("clicked", 'secondClick');
        CONSTANTS.secondCardToCompareValue = card;
        CONSTANTS.secondClick = true;

        if (CONSTANTS.firstCardToCompareValue.dataset.value === CONSTANTS.secondCardToCompareValue.dataset.value) {
    
            setTimeout(() => {

                const userHeader = document.getElementById('header__user_in-play');
                if (userHeader.style.color === 'blue') {
                    CONSTANTS.counter_1.textContent = parseInt(CONSTANTS.counter_1.textContent) + 1;
                } else {
                    CONSTANTS.counter_2.textContent = parseInt(CONSTANTS.counter_2.textContent) + 1;
                }

                CONSTANTS.firstClick = false;
                CONSTANTS.secondClick = false;

                let counter = 0;
                CONSTANTS.cardsArea.querySelectorAll('.card').forEach(card => {
                    if(card.classList.contains('clicked')){
                        counter++;
                    }
                })

                if(counter === CONSTANTS.cardsArea.querySelectorAll('.card').length){

                    let message = '';
                    if(CONSTANTS.counter_1 > CONSTANTS.counter_2){
                        message += "Blue user wins!";
                    }
                    else{
                        message += "Red user wins!";
                    }
                    alert(message);

                    CONSTANTS.cardsArea.innerHTML = "";

                    getUserForStart();
                }

            }, 1000);
        } else {
            setTimeout(() => {
                CONSTANTS.firstCardToCompareValue.classList.remove('clicked', 'firstClick');
                CONSTANTS.secondCardToCompareValue.classList.remove('clicked', 'secondClick');
                CONSTANTS.firstClick = false;
                CONSTANTS.secondClick = false;

                const userHeader = document.getElementById('header__user_in-play');
                if (userHeader.style.color === 'blue') {
                    userHeader.style.color = "red";
                    userHeader.textContent = "User 2";
                } else {
                    userHeader.style.color = "blue";
                    userHeader.textContent = "User 1";
                }

                CONSTANTS.firstClick = false;
                CONSTANTS.secondClick = false;

            }, 1000);
        }
    }
}

CONSTANTS.cardsArea.addEventListener('click', handleCardClick);
