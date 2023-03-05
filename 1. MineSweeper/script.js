
class Grid{
    constructor(num, isRevealed){
        this.num = num;
        this.isRevealed = isRevealed;
    }
}


class game{
    constructor(size_x, size_y, bombNum){
        console.log("new game!");
        this.size_x = size_x;
        this.size_y = size_y;
        this.bombNum = bombNum;
        this.gameStatus = "nothing";
        this.board = this.createBoard(size_x, size_y);
        this._positionBomb();
    }


    _isoutofGrid(x,y){
        if(x<0 || x>=this.size_x)   return true;
        if(y<0 || y>=this.size_y)   return true;

        return false;
    }


    _addNum(x, y){
        if(!this._isoutofGrid(x,y)){
            if(this.board[x][y].num != -1)  this.board[x][y].num ++;
        }
    }


    _addSurround(x,y){
        this._addNum(x-1,y-1);
        this._addNum(x-1,y);
        this._addNum(x-1,y+1);
        this._addNum(x,y-1);
        this._addNum(x,y+1);
        this._addNum(x+1,y-1);
        this._addNum(x+1,y);
        this._addNum(x+1,y+1);
    }


    _positionBomb(){
        let tempBombNum = this.bombNum;
        let posx, posy;

        while(tempBombNum>0){
            posx = Math.floor(Math.random()*this.size_x);
            posy = Math.floor(Math.random()*this.size_y);

            if(this.board[posx][posy].num == -1){
                continue;
            }else{
                this.board[posx][posy].num = -1;
                tempBombNum--;
                this._addSurround(posx,posy);
            }
        }


    }

    createBoard(sizeX, sizeY){
        var arr = new Array(sizeX);
        
        for(var i=0; i<arr.length;i++){
            arr[i] = new Array(sizeY);
        }
        
        for(let x=0; x<sizeX; x++){
            for(let y=0; y<sizeY; y++){
                arr[x][y] = new Grid(0, false);
            }
        }
        return arr;
    }


    _pressSurroundGrid(x,y){
        this.pressGrid(x-1,y-1);
        this.pressGrid(x-1,y);
        this.pressGrid(x-1,y+1);
        this.pressGrid(x,y-1);
        this.pressGrid(x,y+1);
        this.pressGrid(x+1,y-1);
        this.pressGrid(x+1,y);
        this.pressGrid(x+1,y+1);
    }


    pressGrid(x,y){
        // check if position is out of board
        if(this._isoutofGrid(x,y))                  return;

        // check if position is already revealed
        if(this.board[x][y].isRevealed == true)     return;


        // reveal grid
        this.board[x][y].isRevealed = true;

        // if its bomb -> gameover
        if(this.board[x][y].num == -1){
            // gameover!
            console.log("GameOver!!");
            this.gameStatus = "gameOver";
        }

        // if empty -> reveal adjacent tiles
        if(this.board[x][y].num == 0){
            this._pressSurroundGrid(x,y);
            console.log("empty!");
        }

        // else ( Grid is 1~8 )
        // just return nothing
    }


    drawCell(x,y){
        let xpos = cellMargin + x*(cellSize+cellMargin);
        let ypos = cellMargin + y*(cellSize+cellMargin);

        if(curGame.board[x][y].isRevealed == true){
            stroke('black');
            fill('white');
            square (xpos, ypos, cellSize);
        }
        
        fill('black');
        textAlign(0, 0);
        textSize(cellSize*3/4);

        if(this.board[x][y].num == -1){
            text('B', xpos + cellSize/6, ypos + cellSize/6, cellSize, cellSize);
        }else if(this.board[x][y].num != 0){
            text(this.board[x][y].num, xpos + cellSize/6, ypos + cellSize/6, cellSize, cellSize);
        }
        
        if(curGame.board[x][y].isRevealed == false){
            stroke('black');
            fill('gray');
            square (xpos, ypos, cellSize);
        }
    }


    drawBoard(){
        for(var x=0;x<curGame.size_x; x++){
            for(var y=0;y<curGame.size_y; y++){
                this.drawCell(x,y);
            }
        }
    }

}

let curGame;
let cellSize = 30;
let cellMargin = 5;

function initGame(){
    curGame = new game(10, 10, 10);
}


function setup() {
    menu();
    createCanvas(500, 500);
}

function draw() {
    background('gray');
    if(curGame) curGame.drawBoard();

    noLoop();
}


function mouseClicked(){
    // 게임오버됐거나 게임 오브젝트가 없으면 exit
    if(curGame == null || curGame.gameStatus == "gameOver"){
        return;
    }

    curGame.pressGrid(parseInt(mouseX/(cellSize+cellMargin)), parseInt(mouseY/(cellSize+cellMargin)));
    draw();
}


function menu(){
    let inp_x = createInput("x size", Number);
    let inp_y = createInput("y size", Number);
    let inp_b = createInput("bomb number", Number);
    let but   = createButton("Create Game");
    but.mousePressed(initGame(inp_x.value(), inp_y.value(), inp_b.value()));

    inp_x.position(0,0);
    inp_x.size(100);
    console.log(inp_x.value());
}

/*
2. 게임시작 UI
    -> 게임사이즈(x, y), 폭탄의 개수 입력받고 게임 init

3. 그래픽 폴리싱
    -> Game class 에 각 색상별 프리셋 정하는 함수
    -> 페이지에서의 캔버스 위치
    -> 숫자와 폭탄의 이미지 변경
*/