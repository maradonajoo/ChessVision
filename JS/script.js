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

        const legalMove = game.moves({ verbose: true }).find(move =>
            move.from === source &&
            move.to === target
        );

        if (!legalMove) {
            return "snapback";
        }

        if (legalMove.flags.includes("p")) {

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
            from: source,
            to: target
        });

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

        if (move === null) {
            waitingPromotion = false;
            promotionMove = null;
            hidePromotion();
            return;
        }

        board.position(game.fen());

        waitingPromotion = false;
        promotionMove = null;

        hidePromotion();
    });
});