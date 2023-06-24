var jogadores = [];
let participants = [];
let drawnNumbers = [];
let winner = null;
let drawInterval;

function gerarNumerosAleatorios(quantidade, min, max) {
    if (quantidade > (max - min)) {
        console.log("Intervalo insuficiente ...");
        return;
    }

    var numeros = [];

    while (numeros.length < quantidade) {
        var aleatorio = Math.floor(Math.random() * (max - min) + min);

        if (!numeros.includes(aleatorio)) {
            numeros.push(aleatorio);
        }
    }

    return numeros;
}

function gerarCartela() {
    var nomeJogador = prompt('Digite o nome do Jogador');

    var cartela = [
        gerarNumerosAleatorios(5, 1, 15),
        gerarNumerosAleatorios(5, 16, 30),
        gerarNumerosAleatorios(5, 31, 45),
        gerarNumerosAleatorios(5, 46, 60),
        gerarNumerosAleatorios(5, 61, 75)
    ];

    jogadores.push({
        nomeJogador: nomeJogador,
        cartela: cartela
    });

    desenharCartela(nomeJogador, cartela);
}

function resetarJogo() {
    jogadores = [];
    participants = [];
    drawnNumbers = [];
    winner = null;
    clearInterval(drawInterval);
    document.getElementById("winnerName").textContent = "";
    document.getElementById("numeros_sorteados").textContent = "";
    var cartelas = document.getElementsByClassName("cartela");
    for (var i = 0; i < cartelas.length; i++) {
        cartelas[i].classList.remove("winner");
        cartelas[i].classList.remove("drawn");
    }
}

function desenharCartela(nome, cartela) {
    var div = document.getElementById('cartelas');

    var cartelaDiv = document.createElement('div');
    cartelaDiv.classList.add('cartela');

    var h4 = document.createElement('h4');
    h4.innerText = nome;

    cartelaDiv.appendChild(h4);

    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    var thB = document.createElement('th');
    thB.innerText = "B";
    var thI = document.createElement('th');
    thI.innerText = "I";
    var thN = document.createElement('th');
    thN.innerText = "N";
    var thG = document.createElement('th');
    thG.innerText = "G";
    var thO = document.createElement('th');
    thO.innerText = "O";

    thead.appendChild(thB);
    thead.appendChild(thI);
    thead.appendChild(thN);
    thead.appendChild(thG);
    thead.appendChild(thO);

    for (var i = 0; i < 5; i++) {
        var tr = document.createElement('tr');

        for (var j = 0; j < 5; j++) {
            var td = document.createElement('td');

            if (i === 2 && j === 2) {
                td.innerText = "X";
                td.classList.add("free");
            } else {
                td.innerText = cartela[j][i];
            }

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    cartelaDiv.appendChild(table);

    div.appendChild(cartelaDiv);
}

function startGame() {
    participants = [];
    for (var i = 0; i < jogadores.length; i++) {
        participants.push(jogadores[i].nomeJogador);
    }

    var startButton = document.querySelector("#header_jogo button");
    startButton.disabled = true;

    drawInterval = setInterval(sortearNumero, 2000);
}

function sortearNumero() {
    var number = gerarNumerosAleatorios(1, 1, 75)[0];

    while (drawnNumbers.includes(number)) {
        number = gerarNumerosAleatorios(1, 1, 75)[0];
    }

    drawnNumbers.push(number);
    document.getElementById("numeros_sorteados").textContent = drawnNumbers.join(", ");

    marcarNumeroCartela(number);

    verificarVencedor();
}

function marcarNumeroCartela(number) {
    var cartelas = document.getElementsByClassName("cartela");

    for (var i = 0; i < cartelas.length; i++) {
        var cartela = cartelas[i];
        var tds = cartela.getElementsByTagName("td");

        for (var j = 0; j < tds.length; j++) {
            var td = tds[j];

            if (!td.classList.contains("free") && td.innerText == number) {
                td.classList.add("drawn");
            }
        }
    }
}

function verificarVencedor() {
    for (var i = 0; i < jogadores.length; i++) {
        var cartela = jogadores[i].cartela;
        var cartelaDiv = document.getElementsByClassName("cartela")[i];
        var tds = cartelaDiv.getElementsByTagName("td");
        var linhaCompleta = true;
        var cartelaCompleta = true;
        var diagonalCompleta1 = true;
        var diagonalCompleta2 = true;

        for (var j = 0; j < tds.length; j++) {
            var td = tds[j];

            if (!td.classList.contains("free") && !td.classList.contains("drawn")) {
                linhaCompleta = false;
                cartelaCompleta = false;
                diagonalCompleta1 = false;
                diagonalCompleta2 = false;
                break;
            }

            if (!td.classList.contains("free") && !td.classList.contains("drawn") && (j == 0 || j == 5 || j == 10 || j == 15 || j == 20)) {
                linhaCompleta = false;
            }

            if (!td.classList.contains("free") && td.classList.contains("drawn") && (j == 4 || j == 9 || j == 14 || j == 19 || j == 24)) {
                linhaCompleta = true;
                break;
            }

            if (!td.classList.contains("free") && !td.classList.contains("drawn") && (j == 0 || j == 6 || j == 12 || j == 18 || j == 24)) {
                diagonalCompleta1 = false;
            }

            if (!td.classList.contains("free") && td.classList.contains("drawn") && (j == 4 || j == 8 || j == 12 || j == 16 || j == 20)) {
                diagonalCompleta1 = true;
            }

            if (!td.classList.contains("free") && !td.classList.contains("drawn") && (j == 20 || j == 16 || j == 12 || j == 8 || j == 4)) {
                diagonalCompleta2 = false;
            }

            if (!td.classList.contains("free") && td.classList.contains("drawn") && (j == 0 || j == 6 || j == 12 || j == 18 || j == 24)) {
                diagonalCompleta2 = true;
            }
        }

        if (linhaCompleta || cartelaCompleta || diagonalCompleta1 || diagonalCompleta2) {
            cartelaDiv.classList.add("winner");
            winner = jogadores[i].nomeJogador;
            document.getElementById("winnerName").textContent = winner;
            clearInterval(drawInterval);
        }
    }
}
