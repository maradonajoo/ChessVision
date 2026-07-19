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

        if (waitingPromotion) {
            return "snapback";
        }

        const isPromotion =
            (piece === "wP" && target[1] === "8") ||
            (piece === "bP" && target[1] === "1");

        if (isPromotion) {

            waitingPromotion = true;

            promotionMove = {
                from: source,
                to: target,
                color: piece[0]
            };

            showPromotion(piece[0]);

            return;
        }

        const move = game.move({
            from: source,
            to: target
        });

        if (move === null) {
            return "snapback";
        }

    },

    onSnapEnd: function () {
        board.position(game.fen());
    }

});

document.querySelectorAll(".promotion-pieces img").forEach(function (img) {

    img.addEventListener("click", function () {

        const promotion = this.dataset.piece;

        const move = game.move({
            from: promotionMove.from,
            to: promotionMove.to,
            promotion: promotion
        });

        if (move !== null) {
            board.position(game.fen());
        }

        waitingPromotion = false;
        promotionMove = null;

        hidePromotion();

    });

});