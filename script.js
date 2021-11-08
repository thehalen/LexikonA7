const player = {
  x: 0, 
  y: 0,
  steps: 1,
  moves: 0,
  playerOffset : function(x,y)
  { //takes a look at blocks at <steps> number of tiles from the player, for reusability
    return document.getElementById("x" + (x*this.steps + player.x) + "y" + (y*this.steps + player.y));
  },
      
  move : function(x,y)
  {
      if (this.moveAble(x,y)){
        while (this.steps > 1) //if moving one or more blocks
        {            
          this.playerOffset(x,y).src = "B_.png";
          this.steps--;
        }
        this.playerOffset(x,y).src = "P_.png"; //move the char
        this.playerOffset(0,0).src=" _.png";
        if (this.playerOffset(0,0).getAttribute('alt')=="G") {this.playerOffset(0,0).src="G_.png";} //reset goal areas
        this.x += x; //update coords
        this.y += y;
        this.moves++;
      };
      this.steps = 1;
      this.winning(); 
  },

  moveAble : function(x,y) {
    let elem = this.playerOffset(x,y);
    switch (elem.getAttribute('src')) {
      case " _.png": //floor tiles
      case "G_.png":
        return true;
        break;
      case "W_.png": //wall, don't move
        return false;
        break;
      case "B_.png":
        this.steps++;
        return this.moveAble(x,y); //block to be moved, check if there's more in a line
        break;
      default:
    }
  },

  winning : function()
  {
    let match1 = document.querySelectorAll("img[alt='G'],img[src='B_.png']"); //number of moveables AND goal tiles, this will decrease with each finished block
    let match2 = document.querySelectorAll("img[alt='G']"); //number of goal tiles
    if (match1.length == match2.length) {alert("Congrats!\nYou just won in " + this.moves + " number of moves!"); }
  }

};
  function render() {
    let rows = tileMap01.mapGrid.length;
    let cols = tileMap01.mapGrid[0].length;

    document.body.style.width = 36*cols+"px"; //setAttribute refused..
    document.body.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    document.body.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    var htm = "";
    for (let r = 0; r < rows; r++) { //we want standard coord behaviour, so we're going to use (rows-r) for the y-axis
      for (let c = 0; c < cols; c++) { //alt is required for proper html, going to use this to keep track of goal tiles
        htm += "<img src=\"" + tileMap01.mapGrid[r][c] + "_.png\" alt=\"" + tileMap01.mapGrid[r][c] + "\"  id=\"" + "x" + c + "y" + (rows-r) + "\" >";
        if (tileMap01.mapGrid[r][c]=="P") //player coords found
        {
          player.x = c;
          player.y = (rows-r);
        }
      }
    }
    document.body.innerHTML = htm;
  }

document.addEventListener('keydown', event => {  
  
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
    event.preventDefault();} //suppress scrolling behaviour

    switch (event.key) {
      case "ArrowUp":
      case "w":
        player.move(0,1);
        break;
      case "ArrowRight":
      case "d":
        player.move(1,0);
        break;
      case "ArrowDown":
      case "s":
        player.move(0,-1);
        break;
      case "ArrowLeft":
      case "a":
        player.move(-1,0);
        break;
      default:
    }
  }, false);
