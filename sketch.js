var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided, mario_win;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;

var win, winImg;
var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  mario_win = loadAnimation("mariowin.png")
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  winImg = loadImage("youWin.png");
}

function setup() {
  createCanvas(800, 400);
  mario = createSprite(50,380,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("win",mario_win);
  mario.scale = 0.5; 
  
  ground = createSprite(0,390,1400,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(400,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(400,240);
  restart.addImage(restartImg);
  
  win = createSprite(400, 180);
  win.addImage(winImg);
  
  gameOver.scale = 0.7;
  restart.scale = 0.7;
  win.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
  win.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("blue");
  textSize(20);
  fill(255);
  text("Score: "+ score, 700,40); 
//text("life: "+ life , 500,60);
  drawSprites();
  if (gameState===PLAY){
   score = score + Math.round(getFrameRate()/60);
   win.visible = false;
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && mario.y >= 340) {
      mario.velocityY = -12;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   if(score ===1000){
     gameState = END
     win.visible = true;
     gameOver.visible = false;
     mario.changeAnimation("win",mario_win);
   }
    mario.collide(ground);
    
    spawnCoin();
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(mario)){
        gameState = END;
        mario.addAnimation("collided", mario_collided);
    } 
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(800,320,40,10);
    coin.y = Math.round(random(250,320));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 250;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(800,365,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 500;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}