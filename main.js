function id(x) { return document.getElementById(x) };

function mod(x, n) {
  return x % n;
}

function floor(x, n, m) {
  return Math.floor(x * 1 / m) * n;
}

function rand(x, cond) {
  if (cond!==undefined) {
    var result = 0;
    for(let i=0;cond;i+=1) {
      result = Math.floor(Math.random()*x);
    }
    return result;
  } else
  return Math.floor(Math.random()*x);
}

function randEl(array) {
  return array[rand(array.length)];
}

const Right = id('right');
const Left = id('left');
const Top = id('top');
const Bottom = id('bottom');

const directions = [Right, Left, Top, Bottom];

for(let i=0;i<directions.length;i+=1)
{
  
  directions[i].onclick = () =>
  {
    var request_pos = directions[i].id.toString();
    if (request_pos!==reverse(snake.Pos)) {
    snake.Pos = request_pos;
    }
  }
}


const canvas = id('canvas');
const ctx = canvas.getContext('2d');
const FPS = 60;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function l(x) {
  ctx.beginPath();
  x();
  ctx.closePath();
}

function sqr(x, y, m, color = 'black') {
  l(() => {
    ctx.strokeStyle = color;
    ctx.rect(x, y, m, m);
    ctx.stroke();

  })
}

function sqrf(x, y, m, color = "black") {
  l(() => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, m, m);
    ctx.stroke();

  })
}

function move(snake, pos, m) {
  if (pos === 'right') snake.x += m;
  else
  if (pos === 'left') snake.x -= m;
  else
  if (pos === 'top') snake.y -= m;
  else
  if (pos === 'bottom') snake.y += m;
}

function pause() { if (game.start) game.start = false;
  else game.start = true };

function reverse(pos) {
  if (pos==='right') return 'left'; else
  if (pos==='left') return 'right'; else
  if (pos==='top') return 'bottom'; else
  if (pos==='bottom') return 'top';
}



class Game
{
  constructor(score = 0, start = false, isEat = true, apple_colors = ["#FF0000", "#00FF1D", "#00FFF3", "#93FF00", "#0100FF", "#FF6E00", "#FF0095", "#00FF9F", "#8B00FF", "#FFFFFF"], sounds = ['Snake Game - Theme Song.mp3','food.mp3','zapsplat_multimedia_game_sound_try_again_tone_classic_arcade_style_86028.mp3'], game_over = false, playing = false) {
    this.score = score;
    this.start = start;
    this.isEat = isEat;
    this.apple_colors = apple_colors;
    this.sounds = sounds;
    this.max_score = 0;
    
    if (localStorage.getItem('score')==null) {
      localStorage.setItem('score',this.max_score);
    }
    
    this.game_over = game_over;
    
    this.main_music = new Howl({
    src: [this.sounds[0]],
    autoplay: true,
    loop: true,
    volume: 1
    })
    
    
    
    
    
  }
}

class Table
{
  constructor(h, m, y) {
    this.h = h;
    this.m = m;
    this.x = canvas.width/2-this.h*this.m/2;
    this.y = y;
  }
  draw()
  {
    for (var i = 0; i < this.h * this.h; i++)
    {
      sqr(this.x + this.m * mod(i, this.h), this.y + floor(i, this.m, this.h), this.m, 'white');
    }
  }
}


class POS
{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Score_Table
{
  constructor(game, x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.game = game;
    this.size = size;
  }
  draw() {
    l(()=>{
      ctx.fillStyle = this.color
      ctx.font = this.size + 'px Arial';
      ctx.fillText(this.game.score, this.x, this.y);
      
      ctx.fillStyle = 'Red';
      ctx.font = this.size + 'px Arial';
      ctx.fillText(localStorage.getItem('score'), this.x, this.y+50);
      
    })
    
  }
}

class Snake
{
  constructor(game, table, length = 3, Pos = 'right', color = 'yellow', speed = 50 * 10 / 1000)
  {
    this.game = game;
    this.table = table;
    this.length = length;
    this.first_length = length;
    this.Pos = Pos; //right left top bottom
    this.color;
    this.speed = speed;
    this.m = this.table.m;
    
    this.x = this.table.x+this.m*(this.length-1);
    this.y = this.table.y;
    
    this.bodys = []
    
    this.apple;
    
    for(let i=0;i<this.length;i+=1)
    {
      this.bodys.push(new POS(this.table.x+this.m*i, this.table.y))
    }
    

    setInterval(() => {
      if (game.start)
      {
        if (this.bodys.length<this.length) {
          this.bodys.push(new POS(this.x, this.y));
        } else
        if (this.bodys.length>this.length) {
          this.bodys.splice(1,this.first_length)
        }
        
        
        move(this,this.Pos,this.m);
        
        
        if (this.x >= this.table.x + this.table.m * this.table.h) {
          this.x = this.table.x;
        
        }
        if (this.x < this.table.x) {
          this.x = this.table.x + this.table.m * this.table.h - this.m;
        }
        if (this.y<this.table.y) {
          this.y = this.table.y + this.table.m * this.table.h - this.m;
        }
        if (this.y>=this.table.y + this.table.m * this.table.h) {
          this.y = this.table.y;
        }
        
        this.bodys.push(new POS(this.x, this.y));
        this.bodys.shift();
        
        for(let j=0;j<this.bodys.length-1;j+=1)
        {
          if(this.x===this.bodys[j].x&&this.y===this.bodys[j].y) {
            
            this.game.score = 0;
            this.length = this.first_length;
            
            new Howl({
            src: [this.game.sounds[2]],
            autoplay: true,
            loop: false,
            volume: 1
})

            
            break;
          }
        }

        
      }
    }, (1 / this.speed) * 50);
    
    

  }
  
  draw() {
    for (let i = 0; i < this.bodys.length; i += 1)
    {
      sqrf(this.bodys[i].x, this.bodys[i].y, this.m,'yellow');
    }
    
    if (this.game.isEat == true) {
      this.apple = new Apple(this.game, this.table);
      this.game.isEat = false;
    } else
    this.apple.draw()
    
    if (this.x == this.apple.x && this.y == this.apple.y) {
      this.game.isEat = true;
      this.game.score += 1;
      this.length += 1;
      
      if (this.game.score > localStorage.getItem('score')) {
        localStorage.setItem('score', this.game.score)
      }
    
      new Howl({
        src: [this.game.sounds[1]],
        autoplay: true,
        loop: false,
        volume: 2
      })
    }

  }
}


class Apple
{
  constructor(game, table) {
    this.game = game;
    this.color = randEl(this.game.apple_colors);
    this.table = table;
    
    this.x = this.table.x + rand(this.table.h)*this.table.m
    this.y = this.table.y + rand(this.table.h)*this.table.m
    
  }
  draw() {
    sqrf(this.x, this.y,this.table.m, this.color)
  }
}

var game = new Game(0);

var table = new Table(15,30,10);
var snake = new Snake(game, table , 5, 'right', 'yellow');

var score_table = new Score_Table(game, canvas.width-50 ,50,'white',30)


function draw() {
  snake.draw();
  table.draw();
  score_table.draw();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function main() {
  clear();
  draw();
}

function loop() {
  setInterval(main, 1000 / FPS);
}

loop();
pause();
