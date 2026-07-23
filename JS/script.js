const game = new Chess();

let promotionMove = null;
let waitingPromotion = false;

const popup = document.getElementById("promotion-popup");
const queen = document.getElementById("queen");
const rook = document.getElementById("rook");
const bishop = document.getElementById("bishop");
const knight = document.getElementById("knight");

function showPromotion(color) {

    queen.src = `../assets/pieces/${color}Q.png`;
    rook.src = `../assets/pieces/${color}R.png`;
    bishop.src = `../assets/pieces/${color}B.png`;
    knight.src = `../assets/pieces/${color}N.png`;

    popup.classList.remove("hidden");
}

function hidePromotion() {
    popup.classList.add("hidden");
}

const board = Chessboard("board", {

    position: "start",
    draggable: true,

    pieceTheme: "../assets/pieces/{piece}.png",

    onDrop: function (source, target, piece) {

        if(waitingPromotion){
            return "snapback";
        }

        const legalMove = game.moves({verbose:true}).find(move =>
            move.from === source &&
            move.to === target
        );

        if(!legalMove){
            return "snapback";
        }

        if(legalMove.flags.includes("p")){

            waitingPromotion = true;

            promotionMove = {
                from: source,
                to: target,
                color: piece[0]
            };

            showPromotion(piece[0]);

            return;
        }

        game.move({
            from:source,
            to:target

        });

    },

    onSnapEnd:function(){

        board.position(game.fen());
    }

});

const settings = document.querySelector(".settings");
const startBtn = document.getElementById("start-game");
const boardElement = document.getElementById("board");
const whiteName = document.getElementById("white-username");
const blackName = document.getElementById("black-username");
const whiteMinutes = document.getElementById("white-minutes");
const blackMinutes = document.getElementById("black-minutes");
const whiteInc = document.getElementById("white-inc");
const blackInc = document.getElementById("black-inc");

let gameSettings = {};

whiteMinutes.addEventListener("input",function(){

    if(this.value < 0)
        this.value = 0;

    if(this.value > 90)
        this.value = 90;
});

blackMinutes.addEventListener("input",function(){

    if(this.value < 0)
        this.value = 0;

    if(this.value > 90)
        this.value = 90;
});

whiteInc.addEventListener("input",function(){

    if(this.value < 0)
        this.value = 0;

    if(this.value > 60)
        this.value = 60;
});

blackInc.addEventListener("input",function(){

    if(this.value < 0)
        this.value = 0;

    if(this.value > 60)
        this.value = 60;

});

function startGame(event){

    event.preventDefault();

    if(
        whiteName.value.trim()==="" ||

        blackName.value.trim()==="" ||

        whiteMinutes.value==="" ||

        blackMinutes.value==="" ||

        whiteInc.value==="" ||

        blackInc.value===""
    ){
        alert("Please fill in all fields.");
        return;
    }

    gameSettings = {

        white:{

            name:whiteName.value,

            minutes:Number(whiteMinutes.value),

            increment:Number(whiteInc.value)

        },

        black:{

            name:blackName.value,

            minutes:Number(blackMinutes.value),

            increment:Number(blackInc.value)

        }

    };

    console.log(gameSettings);

    settings.classList.add("hide");

    document.querySelector(".loading").classList.remove("hide");

    setTimeout(function(){document.querySelector(".loading").classList.add("hide");},10000);

    setTimeout(function(){boardElement.classList.remove("hide");},10000);

    setTimeout(function(){document.querySelector(".name-time").classList.remove("hide");},10000);

    function formatTime(minutes){
        return `${minutes}:00`;
    }

    document.getElementById("white-player-name").textContent = gameSettings.white.name;
    document.getElementById("black-player-name").textContent = gameSettings.black.name;
    document.getElementById("white-player-time").textContent = formatTime(gameSettings.white.minutes);
    document.getElementById("black-player-time").textContent = formatTime(gameSettings.black.minutes);
}

startBtn.addEventListener("click",startGame);

document.querySelectorAll(".promotion-pieces img").forEach(function(img){

    img.addEventListener("click",function(){

        const promotion = this.dataset.piece;

        const move = game.move({

            from:promotionMove.from,

            to:promotionMove.to,

            promotion:promotion
        });

        if(move === null){

            waitingPromotion=false;

            promotionMove=null;

            hidePromotion();

            return;

        }

        board.position(game.fen());

        waitingPromotion=false;

        promotionMove=null;

        hidePromotion();

    });

});