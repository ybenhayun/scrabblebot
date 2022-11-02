const DL = "DL";
const TL = "TL";
const TW = "TW";
const DW = "DW";

const tiles = [ 
    {letter: "A", count: 9, value: 1}, 
    {letter: "B", count: 2, value: 3},
    {letter: "C", count: 2, value: 3},
    {letter: "D", count: 4, value: 2},
    {letter: "E", count: 12, value: 1},
    {letter: "F", count: 2, value: 4},
    {letter: "G", count: 3, value: 2},
    {letter: "H", count: 4, value: 2},
    {letter: "I", count: 9, value: 1},
    {letter: "J", count: 1, value: 8},
    {letter: "K", count: 1, value: 5},
    {letter: "L", count: 4, value: 1},
    {letter: "M", count: 2, value: 3},
    {letter: "N", count: 6, value: 1},
    {letter: "O", count: 8, value: 1},
    {letter: "P", count: 2, value: 3},
    {letter: "Q", count: 1, value: 10},
    {letter: "R", count: 6, value: 1},
    {letter: "S", count: 4, value: 1},
    {letter: "T", count: 6, value: 1},
    {letter: "U", count: 4, value: 1},
    {letter: "V", count: 2, value: 4},
    {letter: "W", count: 2, value: 4},
    {letter: "X", count: 1, value: 8},
    {letter: "Y", count: 2, value: 4},
    {letter: "Z", count: 1, value: 10},
    {letter: " ", count: 2, value: 0}
];

$(document).ready(function(){
    createBoard();
    pickTiles();
});

const SIZE = 15;
const HALF = Math.floor(SIZE/2);
function createBoard() {
    let board = document.getElementById('board');    
    makeSquares(board);
    setUniqueSquares(board);
}

function makeSquares(board) {
    for (let i = 0; i < SIZE; i++) {
        let row = document.createElement('div');
        row.setAttribute('class', 'row');

        if (i == 7) {
            row.classList.add('middle');
        }

        board.append(row);
        for (let j = 0; j < SIZE; j++) {
            let square = document.createElement('div');
            square.setAttribute('class', 'square');

            if (j == 7 && i == 7) {
                square.classList.add(DW);
            }

            row.append(square);
        }
    }
}

function setUniqueSquares(board) {
    let rows = board.getElementsByClassName('row');

    setTripleWords(board, rows);
    setDoubleWords(board, rows);
    setTripleLetters(board, rows);
    setDoubleLetters(board, rows);
}

const DOUBLE_LETTERS = [
    [3, 11],
    [],
    [6, 8],
    [0, 7, 14],
    [],
    [],
    [2, 6, 8, 12],
    [3, 11],
    [2, 6, 8, 12],
    [],
    [],
    [0, 7, 14],
    [6, 8],
    [],
    [3, 11]
]

function setDoubleLetters(board, rows) {
    for (let i = 0; i < SIZE; i++) {
        let square = rows[i].getElementsByClassName('square');

        for (let j = 0; j < DOUBLE_LETTERS[i].length; j++) {
            let index = DOUBLE_LETTERS[i][j];

            square[index].classList.add(DL)
        }
    }
}

function setTripleLetters(board, rows) {
    for (let i = 1; i < SIZE-1; i+=4) {
        let squares = rows[i].getElementsByClassName('square');

        for (let j = 1; j < SIZE-1; j+=4) {
            if ((j != 1 || i != 1) && (j != SIZE-2 || i != SIZE-2)
                && (j != 1 || i != SIZE-2) && (j != SIZE-2 || i != 1)) {
                squares[j].classList.add(TL)
            }
        }
    }
}

function setDoubleWords(board, rows) {
    for (let i = 1; i < SIZE-1; i++) {
        if (i < HALF-2 || i > HALF + 2) {
            let squares = rows[i].getElementsByClassName('square');

            squares[i].classList.add(DW);
            squares[SIZE-1-i].classList.add(DW);
        }
    }
}

function setTripleWords(board, rows) {
    for (let i = 0; i < SIZE; i+=HALF) {
        let squares  = rows[i].getElementsByClassName('square');

        squares[0].classList.add(TW);
        squares[SIZE-1].classList.add(TW);

        if (i != HALF) {
            squares[HALF].classList.add(TW);
        }

    }
}

const MAX = 102;
function pickTiles() {
    let bag = createBag(tiles.slice());
    if (bag.length == MAX) {
        setFor("idle", bag);
    }
    
    setFor("playing", bag);
}

function setFor(player, bag) {
    let squares = document.getElementsByClassName("letters " + player)[0].getElementsByClassName('square');
    let length = bag.length;

    for (let i = 0; i < 7 && i < length; i++) {
        let current = squares[i];
        if (notEmpty(current)) continue;
        
        let index = Math.floor(Math.random()*(bag.length-1));
        createTile(current, bag[index].letter, bag[index].value);
        bag.splice(index, 1);
    }    
}

function notEmpty(square) {
    return square.getElementsByClassName('tile').length;
}

function createBag(letters) {
    let new_bag = [];

    for (let i = 0; i < letters.length; i++) {
        for (let j = 0; j < letters[i].count; j++) {
            new_bag.push({letter: letters[i].letter, value: letters[i].value});
        }
    }

    let used = document.getElementsByClassName('tile');
    let values = document.getElementsByClassName('value');

    for (let i = 0; i < used.length; i++) {
        let c = used[i].innerHTML; 
        let val = Number(values[i].innerHTML);
        
        if (val == 0) {
            c = " ";
        }

        new_bag = removeFromBag(c, new_bag);
    }

    return new_bag;
}

function removeFromBag(letter, bag) {
    for (let i = 0; i < bag.length; i++) {
        if (bag[i].letter == letter) {
            bag.splice(i, 1);
            return bag;
        }
    }
}

function createTile(square, letter, value) {
    let tile = document.createElement('div');
    tile.setAttribute('class', 'tile');
    tile.innerHTML = letter;

    let val = document.createElement('div');
    val.setAttribute('class', 'value');
    val.innerHTML = value;

    square.append(tile);
    square.append(val);

    if (value == 0) {
        tile.classList.add('blank');
        val.classList.add('blank');
    }
}

function getPossibleWords() {
    let tiles = document.getElementsByClassName('letters playing')[0].getElementsByClassName('tile');
    let letters = [];

    for (let i = 0; i < tiles.length; i++) {
        letters.push(tiles[i].innerHTML);
    }

    let words = filterWords(all_words.slice(), letters);
    words = evaluateWords(words, letters);
    
    place(words[0]);
    updateScore(words[0].value, words[0].word);
    pickTiles();

    switchPlayers();
    console.log(words);
}

function switchPlayers() {
    let playing = document.getElementsByClassName('letters playing')[0];
    let idle = document.getElementsByClassName('letters idle')[0];

    playing.classList.remove('playing');
    playing.classList.add('idle');

    idle.classList.remove('idle');
    idle.classList.add('playing');
}

function updateScore(points, word) {
    let player = document.getElementsByClassName('playing history')[0];
    let opponent = document.getElementsByClassName('idle history')[0];
    let current = player.getElementsByTagName('h3')[0];
    let score = Number(current.getElementsByClassName('current')[0].innerHTML);

    score += points;
    current.getElementsByClassName('current')[0].innerHTML = score;

    let hist = player.getElementsByClassName('past-moves')[0];
    let item = document.createElement('li');
    item.innerHTML = word + ": +" + points;

    player.classList.remove('playing');
    player.classList.add('idle');

    opponent.classList.remove('idle');
    opponent.classList.add('playing');

    hist.append(item);
}

// positions = {word: "BLUSH", dir: down, x: 1, y: 1, value: 20};
function place(word) {
    
    for (let i = 0; i < word.word.length; i++) {
        let row = document.getElementsByClassName('row')[word.x + i*isRight(word.dir)];
        let square = row.getElementsByClassName('square')[word.y + i*isDown(word.dir)];

        let c = word.word.charAt(i);
        if (c == " ") continue;

        let spot = findTile(c);
        spot.getElementsByClassName('tile')[0].innerHTML = c;
        move(spot, square);
    }
}

function move(old_parent, new_parent) {
    while (old_parent.childNodes.length > 0) {
        new_parent.appendChild(old_parent.childNodes[0]);
    }
}

function findTile(letter) {
    let letters = document.getElementsByClassName('letters playing')[0].getElementsByClassName('square');

    for (let i = 0; i < 7; i++) {
        let tile = letters[i].getElementsByClassName('tile')[0];
        if (!tile) continue;

        if (tile.innerHTML == letter) {
            return letters[i];
        }
    }

    for (let i = 0; i < 7; i++) {
        let tile = letters[i].getElementsByClassName('tile')[0];
        if (!tile) continue;
        
        if (tile.innerHTML == " ") {
            return letters[i];
        }
    }
}

function filterWords(words, letters, mandatory) {    
    if (!mandatory) {
        mandatory = "";
    }
    
    let new_list = [];
    let blanks = letters.filter(a => a == " ").length;
    
    outer:
    for (let i = 0; i < words.length; i++) {
        let w = words[i];

        if (letters.includes(w) || !w.includes(mandatory)) {
            continue;
        }

        for (let j = 0; j < letters.length; j++) {
            if (letters[j] == " ") continue;
            w = w.replace(letters[j], '');
        
            if (w.length <= blanks) {
                if (mandatory) {
                    words[i] = removeSection(words[i], mandatory);
                }

                new_list.push(words[i]);
                continue outer;
            }
        }
    }

    return new_list;
}

function removeSection(word, str) {
    return word.replace(str, " ".repeat(str.length));
}

function evaluateWords(words, letters) {
    words = addBoardModifiers(words, letters); 
    return words.sort((a, b) => a.value < b.value ? 1 : -1);
}

function addBoardModifiers(words, letters) {
    let board = document.getElementById('board');
    let game = boardToArray(board);
    let connections = getConnectingSquares(game);
    let final_results = [];

    for (let i = 0; i < words.length; i++) {
        final_results.push(testConnections(words[i], letters, game, connections));
    }

    let cross_words = checkCrossWords(letters, game);  
    for (let i = 0; i < cross_words.length; i++) {
        let offset = calcOffset(cross_words[i].word, cross_words[i].substring);
        let start = {x: cross_words[i].pos.x - offset*isRight(cross_words[i].dir), 
                    y: cross_words[i].pos.y - offset*isDown(cross_words[i].dir)};

        let score = evaluateAt(cross_words[i].word, start, cross_words[i].dir, letters.slice(), game);
        final_results.push({word: cross_words[i].word, 
                            dir: cross_words[i].dir, 
                            x: start.x, 
                            y: start.y, 
                            value: score});
    }

    return final_results;
}

// A  LE --> PP
function calcOffset(word, string) {
    let index = word.indexOf(" ");
    return index;
}

function checkCrossWords(letters, board) {
    let cross_arr = [];
    let list = [];

    for (let i = 0; i < board.length; i++) {
        let cross_strings = getCrossStrings(board, i);
        let right = cross_strings.right;
        let down = cross_strings.down;

        cross_strings = right.concat(down);
        cross_arr = cross_arr.concat(cross_strings);
    }

    for (let i = 0; i < cross_arr.length; i++) {
        let temp_letters = letters.slice()
        temp_letters.unshift(cross_arr[i].string);

        let add_list = filterWords(all_words.slice(), temp_letters, temp_letters[0]);
        add_list = add_list.map(a => Object.assign ({}, {word: a, 
                                                        substring: temp_letters[0], 
                                                        pos: cross_arr[i].pos, 
                                                        dir: cross_arr[i].dir}));

        list = list.concat(add_list);
    }

    list = [...new Set(list)];
    // for (let i = 0; i < list.length; i++) {
    //     seeIfPlaceable(board, list[i]);
    // }

    return list;
}

function testConnections(word, pieces, board, connections) {
    let positions = [];
    
    for (let i = 0; i < connections.length; i++) {
        positions = positions.concat(testStartingSpot(word, R, pieces, board, connections[i]));
        positions = positions.concat(testStartingSpot(word, D, pieces, board, connections[i]));
    }
    let max = Math.max(...positions.map(a => a.value));
    return positions.filter(a => a.value == max)[0];
}

const R = "right";
const D = "down";
function testStartingSpot(word, dir, pieces, board, connection) {
    let results = [];
    
    for (let i = 0; i < word.length; i++) {
        let start = {x: connection.x - i*isRight(dir), y: connection.y - i*isDown(dir)};
        
        if (cantPlaceHere(board, start.x, start.y)) {
            return results;
        }

        let score = evaluateAt(word, start, dir, pieces.slice(), board);

        results.push({word: word, dir: dir, x: start.x, y: start.y, value: score});
    }

    return results
}

function cantPlaceHere(board, x, y) {
    if (x >= SIZE || y >= SIZE  || x < 0 || y < 0) {
        return true;
    }
    return isFilled(board[x][y]);
}

function evaluateAt(word, start, dir, pieces, board) {
    let temp_board = JSON.parse(JSON.stringify(board));

    for (let i = 0; i < word.length; i++) {
        let c = word.charAt(i);

        if (c == " ") continue;

        let x = start.x + i*isRight(dir); 
        let y = start.y + i*isDown(dir);
        
        if (cantPlaceHere(board, x, y)) {
            return -1;
        }
        
        let val = tiles.filter(a => a.letter == c)[0].value;
        if (!pieces.includes(c)) {
            pieces.splice(pieces.indexOf(" "), 1);
            val = 0;
        } else {
            pieces.splice(pieces.indexOf(c), 1);
        }

        temp_board[x][y] = {letter: c, value: val};
    }

    if (!boardIsValid(temp_board)) {
        return -1;
    }

    let score = countWord(temp_board, board, start, dir);

    // if (isBingo(word)) {
    if (!pieces.length) {
        score += 50;
    }
    return score;
}

function countWord(temp, board, start, dir, extras) {
    let score = 0;
    let extra = 0;
    let word_multiplier = 1;

    start = findStart(start.x, start.y, board, dir);
    for (let i = 0; start.x + i < SIZE && start.y + i < SIZE; i++) {
        let x = start.x + i*isRight(dir);
        let y = start.y + i*isDown(dir);
        
        if (!isFilled(temp[x][y])) {
            break;
        }

        let c = temp[x][y].letter;
        let val = temp[x][y].value*getLetterMultiplier(board[x][y]);

        word_multiplier *= getWordMultiplier(board[x][y]);
        score += val;

        if (hasNeighbor(board, x, y, dir) && !isFilled(board[x][y]) && !extras) {
                let new_start = findStart(x, y, temp, oppDir(dir));
                extra += countWord(temp, board, new_start, oppDir(dir), true);
        }
    }

    return score*word_multiplier + extra;
}

function hasNeighbor(board, x, y, dir) {
    if ((x < SIZE-1 || !isDown(dir)) && (y < SIZE-1 || !isRight(dir))) {
        if (isFilled(board[x+isDown(dir)][y+isRight(dir)])) {
            return true;
        }
    }

    if ((x > 0 || !isDown(dir)) && (y > 0 || !isRight(dir))) {
        if (isFilled(board[x-isDown(dir)][y-isRight(dir)])) {
            return true;
        }
    }

    return false;
}

function findStart(x, y, board, dir) {
    let curr = {x: x, y: y};
    
    while (x >= 0 && y >= 0) {
        if (isFilled(board[x][y])) {
            curr = {x: x, y: y};
            x -= isRight(dir);
            y -= isDown(dir);
        } else break;
    }

    return curr;
}

function oppDir(dir) {
    if (dir == R) return D;
    return R;
}

function boardIsValid(board) {
    for (let i = 0; i < board.length; i++) {
        let strings = getCrossStrings(board, i);
        let right = strings.right.map(a => a.string);
        let down = strings.down.map(a => a.string);

        if (!allWords(right) || !(allWords(down))) {
            return false;
        }
    }
    
    return true;
}

function getCrossStrings(board, i) {
    let r_string = "";
    let d_string = "";

    let r_starts = [];
    let d_starts = [];

    for (let j = 0; j < board[i].length; j++) {
        let right = " ";
        let down = " ";
        
        if (isFilled(board[i][j])) {
            down = board[i][j].letter;

            if (j == 0 || d_string[d_string.length-1] == " ") {
                d_starts.push({x: i, y:j});
            }
        }
    
        if (isFilled(board[j][i])) {
            right = board[j][i].letter;

            if (j == 0 || r_string[r_string.length-1] == " ") {
                r_starts.push({x: j, y:i});
            }
        }
    
        r_string += right;
        d_string += down;
    }
    
    r_string = r_string.match(/\b(\w+)\b/g);
    d_string = d_string.match(/\b(\w+)\b/g);

    if (!r_string) r_string = [];
    if (!d_string) d_string = [];

    r_string = pairStringsToStarts(r_string, r_starts, R);
    d_string = pairStringsToStarts(d_string, d_starts, D);

    return({right: r_string, down: d_string});
}

function pairStringsToStarts(strings, starts, dir) {
    let pairs = [];

    for (let i = 0; i < strings.length; i++) {
        pairs.push({string: strings[i], pos:starts[i], dir: dir});
    }

    return pairs;
}

function allWords(strings) {
    if (!strings) return true;
    
    for (let i = 0; i < strings.length; i++) {
        if (strings[i].length <= 1) continue;
        
        if (!all_words.includes(strings[i])) {
            return false;
        }
    }
    
    return true;
}

function isRight(dir) {
    return dir == R;
}

function isDown(dir) {
    return dir == D;
}

function getWordMultiplier(square) {
    if (square == TW) return 3;
    if (square == DW) return 2;
    return 1; 
}

function getLetterMultiplier(square) {
    if (square == TL) return 3;
    if (square == DL) return 2;
    return 1; 
}

function getConnectingSquares(board) {
    let connections = [];
    
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (isFilled(board[i][j])) {
                // connections.push({x: i, y: j});
                connections = connections.concat(freeNeighbors(board, i, j));
            }
        }
    }

    if (!connections.length) {
        connections.push({x: 7, y: 7});
    }

    connections = [... new Set(connections)];
    return connections;
}

function freeNeighbors(board, x, y) {
    let neighbors = [];
    
    if (x > 0) {
        if (!isFilled(board[x-1][y])) {
            neighbors.push({x: x-1, y: y});
        }
    }

    if (x < SIZE-1) {
        if (!isFilled(board[x+1][y])) {
            neighbors.push({x: x+1, y: y});
        }
    }
    
    if (y > 0) {
        if (!isFilled(board[x][y-1])) {
            neighbors.push({x: x, y: y-1});
        }
    }
    
    if (y < SIZE-1) {
        if (!isFilled(board[x][y+1])) {
            neighbors.push({x: x, y: y+1});
        }
    }

    return neighbors;
}

function isFilled(tile) {
    if (!tile) return false;
    return typeof tile === 'object';
}

function boardToArray(board) {
    let rows = board.getElementsByClassName('row');
    let new_board = [];

    for (let i = 0; i < rows.length; i++) {
        new_board[i] = [];
        let squares = rows[i].getElementsByClassName('square');

        for (let j = 0; j < squares.length; j++) {
            let letter = squares[j].getElementsByClassName('tile');
            let val = squares[j].getElementsByClassName('value');

            if (letter.length) {
                new_board[i][j] = {letter: letter[0].innerHTML, value: Number(val[0].innerHTML)};
            } else {
                new_board[i][j] = [...squares[j].classList].filter(a => a != 'square')[0];
            }

            if (!new_board[i][j]) new_board[i][j] = "";
        }
    }

    return new_board; 
}

function isBingo(word) {
    return word.length == 7;
}
