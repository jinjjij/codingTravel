
class Grid{
    constructor(){
        this.num = 0;
        this.isRevealed = false;
        this.isFlaged = false;
    }
}


class game{
    constructor(size_x, size_y, bombNum){
        this.size_x = parseInt(size_x);
        this.size_y = parseInt(size_y);
        this.bombNum = parseInt(bombNum);
        this.board = this.createBoard(this.size_x, this.size_y);
        this._positionBomb();

        // design
        this.cellMargin = 2;
        this.cellSize = 30;
            // colors
        this.backgroundColor = 'black';
        this.boardColor1 = 'gray';
        this.boardColor2 = 'black';
        this.revealedColor = 'white';
        // text colors : 1 blue · 2 green · 3 red · 4 dark blue · 
        //               5 brown · 6 Cyan · 7 Black · 8 Grey.
        this.textColor = ['#0000ff', '#008100', '#ff1300', '#000083', 
                          '#810500', '#2a9494', '#000000', '#808080'];
        
        this.clickProtection = true;
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
        for(let i=0; i<arr.length;i++){
            arr[i] = new Array(sizeY);
        }
        
        for(let x=0; x<sizeX; x++){
            for(let y=0; y < sizeY; y++){
                arr[x][y] = new Grid();
            }
        }
        return arr;
    }


    _pressSurroundGrid(x,y){
        this.pressGrid(x-1, y-1, false);
        this.pressGrid(x-1, y  , false);
        this.pressGrid(x-1, y+1, false);
        this.pressGrid(x  , y-1, false);
        this.pressGrid(x  , y+1, false);
        this.pressGrid(x+1, y-1, false);
        this.pressGrid(x+1, y  , false);
        this.pressGrid(x+1, y+1, false);
    }


    pressGrid(x,y,bymouse){
        // check if position is out of board
        if(this._isoutofGrid(x,y)){
            //console.log("early return in pressGrid : outofGrid");
            return;
        }

        // if position is Flagged?
        if(this.board[x][y].isFlaged == true){
            return;
        }

        // check if position is already revealed
        // -> if there is equal amount of flags around
        // -> reveal adjacent grids
        if(bymouse && this.board[x][y].isRevealed == true && this.board[x][y].num != 0){
            console.log("revealed cell");
            let adjacentFlagCount = 0;
            for(let i=-1;i<2;i++)
                for(let j=-1;j<2;j++)
                    if(!(this._isoutofGrid(x+i,y+j)) && this.board[x+i][y+j].isFlaged)   adjacentFlagCount++;
            
            if(this.board[x][y].num == adjacentFlagCount){
                this._pressSurroundGrid(x,y);
            }

            return;
        }

        if(this.board[x][y].isRevealed == false){
            // reveal grid
            this.board[x][y].isRevealed = true;

            // if its bomb -> gameover
            if(this.board[x][y].num == -1){
                // gameover!
                console.log("GameOver!!");
                gameOver();
            }

            // if empty -> reveal adjacent tiles
            if(this.board[x][y].num == 0){
                this._pressSurroundGrid(x,y);
                console.log("empty!");
            }
        }
        

        // else ( Grid is 1~8 )
        // just return nothing
    }


    flagGrid(x,y){
        // check if position is out of board
        if(this._isoutofGrid(x,y))  return;

        // check if position is already revealed
        if(this.board[x][y].isRevealed) return;

        // if position is already flaged
        // -> unflag
        // else
        // -> flag
        if(this.board[x][y].isFlaged == true){
            this.board[x][y].isFlaged = false;
        }else{
            this.board[x][y].isFlaged = true;
        }
    }


    drawCell(x,y){
        let cM = this.cellMargin;
        let cS = this.cellSize;

        let xpos = cM + x*(cS + cM);
        let ypos = cM + y*(cS + cM);
        let thisNum = this.board[x][y].num;

        stroke('black');
        fill('gray');
        square (xpos, ypos, cS);

        if(curGame.board[x][y].isRevealed == true){
            stroke('black');
            fill('white');
            square (xpos, ypos, cS);
        }
        
        

        fill('black');
        textAlign(0, 0);
        textSize(cS*3/4);

        if(thisNum == -1){
            text('B', xpos + cS/6, ypos + cS/6, cS, cS);
        }else if(thisNum != 0){
            stroke(this.textColor[thisNum - 1])
            text(thisNum, xpos + cS/6, ypos + cS/6, cS, cS);
        }
        
        
        if(curGame.board[x][y].isRevealed == false){
            stroke('black');
            fill('gray');
            square (xpos, ypos, cS);
        }
        

        if(curGame.board[x][y].isFlaged){
            stroke('black');
            fill('black');
            text('F', xpos + cS/6, ypos + cS/6, cS, cS);
        }
    }


    drawBoard(){
        background(this.backgroundColor);
        for(var x=0;x<curGame.size_x; x++){
            for(var y=0;y<curGame.size_y; y++){
                this.drawCell(x,y);
            }
        }
    }


    createCV(){
        let hor = this.size_x * (this.cellMargin + this.cellSize) + this.cellMargin;
        let ver = this.size_y * (this.cellMargin + this.cellSize) + this.cellMargin;

        createCanvas(hor, ver);
        background(this.backgroundColor);
    }


    mouseHandle(mX, mY, mB){
        if(this.clickProtection){
            this.clickProtection = false;
            return;
        }
        let x = parseInt(mX/(this.cellSize + this.cellMargin));
        let y = parseInt(mY/(this.cellSize + this.cellMargin));
        
        if(this._isoutofGrid(x,y)){
            return;
        }

        if(mB == 'left'){
            this.pressGrid(x, y, true);
        }else if(mB == 'right'){
            this.flagGrid(x,y);    
        }
        
        draw();
    }

}

let curGame = null;
let gameStatus;

function initGame(x,y,b){
    gameStatus = "game";
    console.log("initGame!" + '('+x+','+y+','+b+')');
    curGame = new game(x,y,b);
    curGame.createCV();
    draw();
}


function setup() {
    console.log("Page Loaded");
    gameStatus = "menu";
    menu();
}

function draw() {
    clear();
    if(gameStatus == "game" && curGame){
        curGame.drawBoard();
    }else if(gameStatus == 'gameover'){
        console.log("gameover in draw");
        stroke('black');
        fill('black');
        textSize(100);
        text("GAME OVER!",20,20,480,280);
    }else{
    }
    noLoop();
}


function mouseReleased(){
    // 게임오버됐거나 게임 오브젝트가 없으면 exit
    if(curGame && gameStatus == "game"){
        curGame.mouseHandle(mouseX, mouseY, mouseButton);
    }
}


function menu(){
    clear();
    let inp_x = createInput("10", Number);
    let inp_y = createInput("10", Number);
    let inp_b = createInput("10", Number);
    let but   = createButton("Create Game");
    but.mousePressed(func => {
        inp_x.remove();
        inp_y.remove();
        inp_b.remove();
        but.remove();
        initGame(inp_x.value(), inp_y.value(), inp_b.value());
    });
}


function gameOver(){
    gameStatus = "gameover";
    draw();
    let but = createButton("OK");
    but.mousePressed(func => {
        but.remove();
        menu();
    });
}


/*
2. 게임시작 UI
    -> 게임사이즈(x, y), 폭탄의 개수 입력받고 게임 init

3. 그래픽 폴리싱
    -> Game class 에 각 색상별 프리셋 정하는 함수
    -> 페이지에서의 캔버스 위치
    -> 숫자와 폭탄의 이미지 변경
*/