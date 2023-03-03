
class game{
    constructor(size_x, size_y, bombNum){
        console.log("new game!");
        this.size_x = size_x;
        this.size_y = size_y;
        this.bombNum = bombNum;
        this.board = this.createBoard(size_x, size_y);
        this._positionBomb();
    }


    _addNum(x, y){
        if(x<0 || x>=this.size_x)   return -1;
        if(y<0 || x>=this.size_y)   return -1;

        if(this.board[x][y] != -1)  this.board[x][y] ++;
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

            if(this.board[posx][posy] == -1){
                continue;
            }else{
                this.board[posx][posy] = -1;
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
                arr[x][y] = 0;
            }
        }
        return arr;
    }



}


function initGame(){
    const curGame = new game(10, 10, 10);
}


function setup() {
    initGame();
    createCanvas(500, 500)
    background('gray')
}

function draw() {


}