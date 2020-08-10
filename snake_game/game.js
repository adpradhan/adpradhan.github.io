
function init()
{
    canvas = document.getElementById("mycanvas");
    W = canvas.width = 500;
    H = canvas.height = 500;
    pen = canvas.getContext('2d');
    pen.fillStyle = "#06356A";
    cs = 33.33;
    game_over = false;
    food = getRandomFood();
    score = 0;

    food_img = new Image();
    food_img.src = "images/apple.png";

    trophy = new Image();
    trophy.src = "images/trophy.png";

    snake = {
        init_len: 4,
        color:"orange",
        cells:[],
        prev_prev_direction:"right",
        prev_direction:"right",
        direction:"pause",

        createSnake:function(){
            for(let i = this.init_len-1; i >= 0; i--){
                this.cells.push({x:i, y:3});
            }
        },

        drawSnake:function(){
            for(let i = 0; i < this.cells.length; i++)
            {
                pen.fillRect((this.cells[i].x*cs), (this.cells[i].y*cs), cs, cs);
            }
        },

        updateSnake:function(){

            headX = this.cells[0].x;
            headY = this.cells[0].y;

            if(headX == food.x && headY == food.y)
            {
                score+=5;
                food = getRandomFood();
            }

            else
            {
            if(this.direction != "pause")
                this.cells.pop();
            
            if(this.direction == "pause" && this.prev_direction == "pause")
                this.direction = this.prev_prev_direction;
            }

            if(this.direction == "left" && this.prev_direction == "right")
                this.direction = "right";
            else if(this.direction == "right" && this.prev_direction == "left")
                this.direction = "left";
            else if(this.direction == "down" && this.prev_direction == "up")
                this.direction = "up";
            else if(this.direction == "up" && this.prev_direction == "down")
                this.direction = "down";

            if(this.direction == "right")
                this.cells.unshift({x:headX+1, y:headY});
            else if(this.direction == "left")
                this.cells.unshift({x:headX-1, y:headY});
            else if(this.direction == "down")
                this.cells.unshift({x:headX, y:headY+1});
            else if(this.direction == "up")
                this.cells.unshift({x:headX, y:headY-1});


            if(this.cells[0].x < 0 || this.cells[0].y < 0 || this.cells[0].x > (W-cs)/cs || this.cells[0].y > (H-cs)/cs)
                game_over = true;

            for(let i = 1; i < this.cells.length; i++)
            {
                if(food.x == this.cells[i].x && food.y == this.cells[i].y)
                    food = getRandomFood();
                if(this.cells[0].x == this.cells[i].x && this.cells[0].y == this.cells[i].y)
                {
                    game_over = true;
                }
            }
        }

    }

    snake.createSnake();

    function keyPressed(e)
    {
        console.log(e.key);
        snake.prev_prev_direction = snake.prev_direction;
        snake.prev_direction = snake.direction;

        if(e.key == "ArrowRight")
            snake.direction = "right";
        else if(e.key == "ArrowLeft")
            snake.direction = "left";
        else if(e.key == "ArrowDown")
            snake.direction = "down";
        else if(e.key == "ArrowUp")
            snake.direction = "up";
        else if(e.key == " ")
            snake.direction = "pause";
    }

    document.addEventListener('keydown', keyPressed);
    //console.log("working");
}

function draw()
{
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();

    pen.drawImage(food_img,food.x*cs, food.y*cs, cs, cs);

    pen.drawImage(trophy, 10, 10, cs, cs);

    pen.font = "20px bold Roboto";
    pen.fillText(score, 20, 30, 10, 10);
}

function update()
{
    snake.updateSnake();
}

function getRandomFood()
{
    FoodX = Math.round(Math.random()*(W-cs)/cs);
    FoodY = Math.round(Math.random()*(H-cs)/cs);

    var food = {
        x:FoodX,
        y:FoodY,
        color:"red",
    }

    return food;
}

function gameLoop()
{
    if(game_over == true)
    {
        clearInterval(f);
        alert("GAME OVER!");
        location.reload();
    }
    

    console.log("running gameloop");
    draw();
    update();
}

init();
f = setInterval(gameLoop, 200);