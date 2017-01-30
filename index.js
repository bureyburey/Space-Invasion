/*
Explosion effect taken from
http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
and modified by Burey
*/


var alienMsg=['YOU WILL PAY FOR YOUR INSOLENCE, HUMAN SCUM!','The Cake is a LIE!!','Stahhpp, we come in peace ;_;','The horror, OH, THE HORROR!!!','Revenge is Coming, Puny Human!','Oh mighty lord Xeno, accept me to your realm!','Please, for the love of Xeno, will someone delete my browser history????'];

var introMsg=("It happend on the 4th of March, 2017...\nWe were attacked with their full force...\nThey rendered our defences useless...\nyou are earth's last and only hope!\nStop the invasion or we are all doomed....\n\nControls:\nTilt the phone left/right to move the spaceship.\nTap 'FIRE' button to shoot the photon cannons.\n\nThe game is supported ONLY by mobile and uses the phone acceleration sensors for movement.\nthe game is still a work in progress,\nso please reply in the comments if you have any issues or suggestions.\n\n Have fun ^.^\n\n[UPDATE LOG]\nAdded explosion effects.\nAdded scoreboard.\nAdded increasing difficulty.\nAdded shields (start with 3).\nAdded bonuses! pick them for power ups!\nAdded HUD below the canvas.\nAdded graphics to the shields.\nAdded game pause when opening scoreboard.\nAdded game stats on game over.\nAdded intro screen.\nAdded Death Blossoms (Kirk Schafer idea >:p ).\nChanged ship design.\nUpgrade Death Blossoms now switch to tracking mode when there are more than 5 enemies nearby.\nChanged leveling system: each new level requires 150% more points to reach than the previous.")
function init(){
if(window.DeviceMotionEvent){
    window.addEventListener("devicemotion", motion, false);
}else{
  console.log("DeviceMotionEvent is not supported");
}

scoreboard=new Scoreboard(options);

function motion(event){
    
    if(!gamePaused){
    xShip-=(event.accelerationIncludingGravity.x);
   
   if(xShip<shipSize/2)
       xShip=shipSize/2;
    
   if(xShip>myCanvas.width-shipSize/2)
       xShip=myCanvas.width-shipSize/2;
    }
   
  /*console.log("Accelerometer: "
    + event.accelerationIncludingGravity.x + ", "
    + event.accelerationIncludingGravity.y + ", "
    + event.accelerationIncludingGravity.z
  );*/
}

function randVal(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

////// EXPLOSION METHODS START
function Particle (){
/*
 * A single explosion particle
 */
    this.scale = 1.0;
    this.x = 0;
    this.y = 0;
    this.radius = 20;
    this.color = "#000";
    this.velocityX = 0;
    this.velocityY = 0;
    this.scaleSpeed = 0.5;

    this.update = function(ms)
    {
        // shrinking
        this.scale -= this.scaleSpeed * ms / 1000.0;

        if (this.scale <= 0)
        {
            this.scale = 0;
        }
        // moving away from explosion center
        this.x += this.velocityX * ms/1000.0;
        this.y += this.velocityY * ms/1000.0;
    };

    this.draw = function(context2D)
    {
        // translating the 2D context to the particle coordinates
        context2D.save();
        context2D.translate(this.x, this.y);
        context2D.scale(this.scale, this.scale);

        // drawing a filled circle in the particle's local space
        context2D.beginPath();
        context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
        context2D.closePath();

        context2D.fillStyle = this.color;
        context2D.fill();

        context2D.restore();
    };
}


function createExplosion(x, y, color)
{
/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 * 
 * Parameters:
 *     x, y - explosion center
 *     color - particles' color
 */
    var minSize = 10;
    var maxSize = 30;
    var count = 10;
    var minSpeed = 60.0;
    var maxSpeed = 200.0;
    var minScaleSpeed = 1.0;
    var maxScaleSpeed = 4.0;

    for (var angle=0; angle<360; angle += Math.round(360/count))
    {
        var particle = new Particle();

        particle.x = x;
        particle.y = y;

        particle.radius = randVal(minSize, maxSize);

        particle.color = color;

        particle.scaleSpeed = randVal(minScaleSpeed, maxScaleSpeed);

        var speed = randVal(minSpeed, maxSpeed);

        particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

        particles.push(particle);
    }
}

function update(frameDelay)
{
    // update and draw particles
    for (var i=0; i<particles.length; i++){
        var particle = particles[i];

        particle.update(frameDelay);
        particle.draw(ctx);
        if(particle.scale===0){
            particles.splice(i,1);
        }
    }
}
////// EXPLOSION METHODS END


function drawBackground(){
      //Box
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(1,  1, myCanvas.
      width-2, myCanvas.height-2);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, myCanvas.
    width, myCanvas.height);
}
 
function drawStars(){
ctx.fillStyle = "white";
    for(i=0;i<stars.length;i++){
       ctx.beginPath();
       ctx.arc(stars[i].x, stars[i].y, 2, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
       stars[i].y+=1;
       //stars[i].y+=randVal(1,2);
       if(stars[i].y>myCanvas.height){
stars[i].x=Math.random()*myCanvas.width;
stars[i].y=0;
      }
    }
}

function drawShip(){
   //https://s-media-cache-ak0.pinimg.com/736x/88/b0/ce/88b0ce07ad7ee33832b1c5c4189d4194.jpg
   ctx.lineWidth=2;
    
    // left thruster
    ctx.strokeStyle='red';
    ctx.beginPath();
    ctx.moveTo(xShip-shotOffset,yShip);
    ctx.lineTo(xShip-shotOffset, yShip+shipSize*1.1);
    ctx.closePath();
    ctx.stroke();
    
    // right thruster
    ctx.beginPath();
    ctx.moveTo(xShip+shotOffset,yShip);
    ctx.lineTo(xShip+shotOffset, yShip+shipSize*1.2);
    ctx.closePath();
    ctx.stroke();
    
    // draw thrusters flames
    ctx.fillStyle = ((Math.random() < 0.5)? 'orange':'yellow');
    
    ctx.beginPath();
    ctx.arc(xShip-shotOffset, yShip+shipSize*1.25, 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(xShip+shotOffset, yShip+shipSize*1.25, 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    
    // draw ship wing
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    ctx.moveTo(xShip+shipSize, yShip); // top right
    ctx.lineTo(xShip+shipSize*1.1,yShip+shipSize*0.3); // middle right
    ctx.lineTo(xShip+shipSize*1.2,yShip+shipSize*0.7); // bottom right
    ctx.lineTo(xShip-shipSize*1.2,yShip+shipSize*0.7); // bottom left
    ctx.lineTo(xShip-shipSize*1.1,yShip+shipSize*0.3); // middle left
    ctx.lineTo(xShip-shipSize,yShip);
    ctx.closePath();
    ctx.fill();
    
    /*
    ctx.lineWidth=3;
    
    ctx.strokeStyle='lightgreen';
    // left wing
    ctx.beginPath();
    ctx.moveTo(xShip-(shotOffset+6),yShip+8);
    ctx.lineTo(xShip-(shotOffset+4), yShip+shipSize*2);
    ctx.closePath();
    ctx.stroke();
    
    // right wing
    ctx.beginPath();
    ctx.moveTo(xShip+(shotOffset+6),yShip+8);
    ctx.lineTo(xShip+(shotOffset+4), yShip+shipSize*2);
    ctx.closePath();
    ctx.stroke();
    */
     // ship body(triangle)
     /*
    ctx.fillStyle='green';
    ctx.beginPath();
    // top
    ctx.moveTo(xShip,yShip);
    // right side
    ctx.lineTo(xShip+shipSize*0.8, yShip+shipSize*2);
    // left side
    ctx.lineTo(xShip-shipSize*0.8, yShip+shipSize*2);
    ctx.fill();
    */
    
    // main ship body
    ctx.fillStyle='green';
    bezierCurve(xShip, yShip, shipSize*1.5, shipSize*2,'fill');
    ctx.fillStyle='lightblue';
    bezierCurve(xShip, yShip+shipSize*0.12, shipSize*0.6, shipSize*1.3,'fill');
    
    // draw shields
    if(shields > 0){
        ctx.lineWidth=shields;
        ctx.strokeStyle='blue';
        bezierCurve(xShip, yShip+shipSize*0.7, shipSize*4.5, shipSize*6,'stroke');
    }
    
}

function checkHits(){
    for(i=0;i<enemies.length;i++){
        for(j=0;j<shots.length;j++){
        impactRadius=enemies[i].size;
        if(Math.abs(shots[j].y-enemies[i].y) < impactRadius && Math.abs(shots[j].x-enemies[i].x) < impactRadius){
            stats.totalHits++;
        createExplosion(enemies[i].x, enemies[i].
        y, "#525252");
        createExplosion(enemies[i].x, enemies[i].
        y, "#FFA318");
        
       
        console.log("Alien Message Received:\n"+alienMsg[randVal(0,alienMsg.length-1)]);
        
        score+=enemies[i].size*level;
        if(score>level*levelIncrementer){
           increaseLevel();
        }
        enemies.splice(i,1);
        shots.splice(j,1);
        
        break;
        }
      }
    }
}

function drawShots(){
    
    for(i=0;i<shots.length;i++){
        ctx.fillStyle = shots[i].color;
       ctx.beginPath();
       ctx.arc(shots[i].x, shots[i].y, 2, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
       if(shots[i].target!==null){
            // tracking Death Blossoms
           if(enemies.indexOf(shots[i].target)===-1 && enemies.length>0){
               // re-target random enemy
               shots[i].target=enemies[randVal(0,enemies.length-1)];
           }
          else{
            shots[i].y+=((shots[i].target.y > shots[i].y)? shots[i].ySpeed:-shots[i].ySpeed);
            shots[i].x+=((shots[i].target.x > shots[i].x)? shots[i].xSpeed:-shots[i].xSpeed);
          }
       }
       else{
        shots[i].y-=shots[i].ySpeed;
        shots[i].x+=shots[i].xSpeed;
       }
       if(shots[i].y<0 || shots[i].y>myCanvas.height || shots[i].x<0 || shots[i].x>myCanvas.width){
           shots.splice(i,1);
      }
    }
}

function spawnBonus(){
       if(bonuses.length<maxBonuses){
   bonuses.push({x:Math.random()*myCanvas.width,y:0,speed:bonusSpeed,size:bonusRadius});
    }
}

function spawnEnemy(){
   if(enemies.length<maxEnemies){
   enemies.push({x:Math.random()*myCanvas.width,y:0,speed:randVal(enemyMinSpeed,enemyMaxSpeed),size:randVal(enemyMinSize,enemyMaxSize)});
   stats.enemyEncounters++;
   }
}

function bezierCurve(centerX, centerY, width, height,fillType) {
// draws a single ellipse
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height / 2);

    ctx.bezierCurveTo(
        centerX + width / 2, centerY - height / 2,
        centerX + width / 2, centerY + height / 2,
        centerX, centerY + height / 2
    );
    ctx.bezierCurveTo(
        centerX - width / 2, centerY + height / 2,
        centerX - width / 2, centerY - height / 2,
        centerX, centerY - height / 2
    );
    
    ctx.closePath();
    if(fillType==='fill')
        ctx.fill();
    else
        ctx.stroke();
}
function drawEnemy(enemy){
        eX=enemy.x;
        eY=enemy.y;
        eS=enemy.size;
        
        colors=enemyColors[randVal(0,enemyColors.length-1)]
        ctx.fillStyle=colors[0];
        bezierCurve(eX,eY,eS,eS*0.3,'fill');
        
        ctx.fillStyle=colors[1];
        bezierCurve(eX,eY+eS*0.3,eS*2,eS*0.5,'fill');
}

function drawEnemies(){
      for(i=0;i<enemies.length;i++){
      
      drawEnemy(enemies[i]);
      enemies[i].y+=enemies[i].speed;
      if(level===maxLevel)
          enemies[i].x+=enemies[i].speed*0.5*((Math.random()<0.5)? 1:-1);
      
      if(enemies[i].y>myCanvas.height){
           enemies.splice(i,1);
      }
   }
}

function drawBonus(bonus){
     ctx.beginPath();
      ctx.arc(bonus.x, bonus.y, bonus.size-10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'pink';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.font = "15px Arial";
      ctx.fillStyle = 'black';
      ctx.fillText("?",bonus.x-(bonus.size-10)/2,bonus.y+(bonus.size-10)/2);
}


function drawBonuses(){
    for(i=0;i<bonuses.length;i++){
      
      drawBonus(bonuses[i]);
      bonuses[i].y+=bonuses[i].speed;
      
      if(bonuses[i].y>myCanvas.height){
           bonuses.splice(i,1);
      }
   }
}

function claimBonus(bonus){
    // createExplosion(bonus.x,bonus.y, 'blue');
    ctx.lineWidth=4;
    ctx.strokeStyle='lightgreen';
    bezierCurve(xShip, yShip+shipSize*0.7, shipSize*4.5, shipSize*6,'stroke');
    result=powerUps[randVal(0,powerUps.length-1)];

    switch(result){
        case 'extraShot':
           maxShots+=1;
           console.log('Max shots increased: '+maxShots);
        break;
        case 'extraShield':
            shields+=1;
            console.log('Shields Increased: '+shields);
        break;
        case 'shotSpeed':
            shotSpeed+=1;
            console.log('Shot speed increased: '+shotSpeed);
            if(shotSpeed >= maxShotSpeed){
                powerUps.splice(powerUps.indexOf('shotSpeed'),1);
            }
        break;
        case 'deathBlossom':
            deathBlossomShots++;
            btnDeathBlossom.disabled=false;
            console.log('Death Blossom Recharged: '+deathBlossomShots);
        break;
        default:
            console.log("Something went wrong with bonusClaim!");
        break;
    }
    
}

function checkBonuses(){
    for(i=0;i<bonuses.length;i++){
    claimRadius=bonuses[i].size;
    if(Math.abs(yShip-bonuses[i].y) < claimRadius && Math.abs(xShip-bonuses[i].x) < claimRadius){
    claimBonus(bonuses[i]);
    bonuses.splice(i,1);
    }
  }
}

function reduceShield(){
    if(shields > 0){
        //createExplosion(xShip,yShip,'green');
        ctx.lineWidth=4;
        ctx.strokeStyle='red';
        bezierCurve(xShip, yShip+shipSize*0.7, shipSize*4.5, shipSize*6,'stroke');
    }
    shields--;
    //console.log("Shields Remaining : "+ shields);
    return shields;
}

function checkGameOver(){
    for(i=0;i<enemies.length;i++){
    impactRadius=enemies[i].size;
    if(Math.abs(yShip-enemies[i].y) < impactRadius && Math.abs(xShip-enemies[i].x) < impactRadius){
        enemies.splice(i,1);
    if(reduceShield()<0)
        return true;
    }
  }
  return false;
}

function drawExplosions(){
    update(33);
}

function drawDeath(){
   update(33);
    if(particles.length===0){
    // call add new score here
    console.log('Alien Message Received:\nNow your ashes may drift in the coldness of space for eternity, filthy human!');
    clearInterval(gameInterval);
    showGameOverMessage();
    gameInterval=null;
    showStats();
    btnNewGame.disabled=false;
    btnFire.disabled=true;
    btnDeathBlossom.disabled=true;
    scoreboard.submitNewScoreDialog(score);
}
}


function updateValuesUI(){
    document.getElementById('levelValue').innerHTML=level;
    document.getElementById('nextLevelValue').innerHTML=((level<maxLevel)? (Math.floor(level*levelIncrementer)):'MAX');
    document.getElementById('scoreValue').innerHTML=score;
    document.getElementById('shieldsValue').innerHTML=shields;
    document.getElementById('numShotsValue').innerHTML=(Math.max(0,maxShots-shots.length)+'/'+maxShots);
    document.getElementById('speedShotsValue').innerHTML=shotSpeed;
    document.getElementById('deathBlossomsValue').innerHTML=deathBlossomShots;
}

function drawScreen() {

drawBackground();
drawStars();
drawShots();
drawEnemies();
drawBonuses();
checkBonuses();
checkHits();
drawExplosions();
drawShip();
updateValuesUI();
if(checkGameOver()){
    createExplosion(xShip, yShip, "#525252");
    createExplosion(xShip,yShip, "#FFA318");
    clearInterval(gameInterval);
    clearInterval(enemySpawnerInterval);
    clearInterval(bonusSpawnerInterval);
    gameInterval=setInterval(drawDeath,33);
    //alert("GAME OVER PUNY HUMAN!!!\nYour score: "+score)
    return;
    }
}

function drawIntroMessage(){
    ctx.font = "15px 'Press Start 2P'";
    ctx.fillStyle = 'green';
    ctx.fillText("Space Invasion!",myCanvas.width*0.1,myCanvas.height*0.3);
    ctx.font = "10px 'Press Start 2P'";
    ctx.fillStyle = 'red';
    ctx.fillText("Coded by Burey",myCanvas.width*0.12,myCanvas.height*0.4);
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillStyle = 'yellow';
    ctx.fillText("Tap 'New Game' to Start",myCanvas.width*0.1,myCanvas.height*0.6);
}

function showIntro() {
    drawBackground();
    drawStars();
    drawShip();
    drawIntroMessage();
}


function increaseLevel(){
    if(level>=maxLevel)
        return;
    
   level++;
   levelIncrementer*=1.5;
   console.log('Next level at: '+(level*levelIncrementer)+' Points!');
   maxEnemies+=5;
   enemySpawnTime=Math.max(1,enemySpawnTime-100);
   clearInterval(enemySpawnerInterval);
   enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime);
}

function showStats(){
    
    var msg="Game Stats:\n\nTotal Shots: "+(stats.totalShots)+
    "\nTotal Hits: "+(stats.totalHits)+
    "\nHit Ratio: "+(stats.totalHits/stats.totalShots)+
    "\nTotal Encounters: "+(stats.enemyEncounters)+
    "\nEnemies Escaped: "+(stats.enemyEncounters-stats.totalHits)+
    "\nEscape Ratio: "+((stats.enemyEncounters-stats.totalHits)/(stats.enemyEncounters));
    
    alert(msg);
}

function showGameOverMessage(){
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillStyle = 'red';
    ctx.fillText("Game Over!!!",myCanvas.width*0.2,myCanvas.height*0.5);

}

function showPauseMessage(){
    ctx.font = "15px 'Press Start 2P'";
    ctx.fillStyle = 'red';
    ctx.fillText("Game Paused",myCanvas.width*0.2,myCanvas.height*0.5);
    var pauseOrNewGame = ((gameInterval===null)? 'New Game':'FIRE');
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText("Tap '"+pauseOrNewGame+"' to continue",myCanvas.width*0.05,myCanvas.height*0.6);
}

function resumeGame(){
    // unpause game
        gamePaused=false;
        gameInterval=setInterval(drawScreen, 33);
        enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime);
        bonusSpawnerInterval=setInterval(spawnBonus,bonusSpawnTime);
}

function resetGame(){
    
myCanvas.width = window.innerWidth*0.9;
myCanvas.height = window.innerHeight*0.65;
yShip = myCanvas.height-shipSize-20;

console.log('Alien Message Received:\nTurn back now, puny human, before you regret it!!!');

shots=[];
enemies=[];
particles=[];
stars=[];

for(i=0;i<numStars;i++){
    stars.push({x:Math.random()*myCanvas.width,y:Math.random()*myCanvas.height});
}
    
    // DISABLE/ENABLE CONTROLS
    btnNewGame.disabled=true;
    btnFire.disabled=false;
    btnDeathBlossom.disabled=false;

   // RESET TO STARTING SETUP
    
    stats.totalShots=0;
    stats.totalHits=0;
    stats.enemyEncounters=0;
    
    score=0;
    level=1;
    levelIncrementer=100;
    
    deathBlossomShots=1;
    shields=3;
    maxEnemies=5;
    enemySpawnTime=1000;
    maxShots=5;
    shotSpeed=5;
    bonuses=[];
    updateValuesUI();
    gamePaused = false;
}

var canvasContainer=document.getElementById("canvasContainer");
var myCanvas=document.getElementById("myCanvas");


myCanvas.width = window.innerWidth*0.9;
myCanvas.height = window.innerHeight*0.65;

ctx = myCanvas.getContext("2d");

var speed = 5;
var shipSize=15;
var shields=3;
var deathBlossomShots=1;
var minTrackingDeathBlossoms=5;

var gamePaused=false;
var introInterval=null;

var yShip = myCanvas.height-shipSize-20;
var xShip = myCanvas.width/2;
var stars=[];
var numStars=100;
var shots=[];
var shotSide=1;
var shotOffset=4;
var maxShots=5;
var shotSpeed=5;
var maxShotSpeed=15;
var particles=[];
var enemies=[];
var enemyColors=[['red','blue'],['yellow','green']]
var maxEnemies=5;
var enemySpawnTime=1000;
var enemyMinSpeed=2;
var enemyMaxSpeed=6;
var enemyMinSize=10;
var enemyMaxSize=20;

var gameInterval=null;
var enemySpawnerInterval=null;
var score=0;
var level=1;
var maxLevel=10;
var levelIncrementer=100;

var bonusSpawnTime=5000; // spawn bonus every 5 seconds
var bonusSpawnerInterval=null;
var maxBonuses=5;
var bonusRadius=20;
var bonusSpeed=3;
var bonuses=[];
var powerUps=['extraShot','extraShield','shotSpeed','deathBlossom'];

var stats={
    totalShots:0,
    totalHits:0,
    enemyEncounters:0
};

var btnShowScoreboard=document.getElementById("showScoreboard");

btnShowScoreboard.onclick=function(){
   scoreboard.showScoreBoard();
   try{
    clearInterval(gameInterval);
    clearInterval(enemySpawnerInterval);
    clearInterval(bonusSpawnerInterval);
   }catch(err){alert(err);}
   if(!introInterval && gameInterval){
    gamePaused=true;
    showPauseMessage();
   }
}

btnFire=document.getElementById("fire");
btnDeathBlossom=document.getElementById("death_blossom");
btnFire.disabled=true;
btnDeathBlossom.disabled=true;
btnNewGame=document.getElementById("newGame");

btnFire.onclick=function(){
    stats.totalShots++;
    
shotSide*=(-1);
if(shots.length<maxShots){
    shots.push({x:xShip+(shotSide*shotOffset),y:yShip,xSpeed:0,ySpeed:shotSpeed,color:'lightgreen',target:null});
    }
    if(gamePaused){
        resumeGame();
    }
}

btnDeathBlossom.onclick=function(){
    
    // DEATH BLOSSOM!!!! Credits to Kirk Schafer for the inspiration :D
    if(enemies.length < minTrackingDeathBlossoms){
        for(i=-15;i<=15;i+=1){
    shots.push({x:xShip+(shotSide*shotOffset),y:yShip,xSpeed:i,ySpeed:shotSpeed,color:'red',target:null});
    }
    }
    else{
        // Upgraded Death Blossoms with enemy tracking
        for(i=0;i<enemies.length;i+=1){
    shots.push({x:xShip+(shotSide*shotOffset),y:yShip,xSpeed:enemies[i].speed*2,ySpeed:enemies[i].speed*2,color:'red',target:enemies[i]});
    }
    }
    
    deathBlossomShots--;
    if(deathBlossomShots === 0){
        btnDeathBlossom.disabled=true;
    }
    if(gamePaused){
        resumeGame();
    }
}


btnNewGame.onclick=function(){
if(introInterval!=null){
clearInterval(introInterval);
introInterval=null;
}
resetGame();

gameInterval=setInterval(drawScreen, 33);
enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime);
bonusSpawnerInterval=setInterval(spawnBonus,bonusSpawnTime);
}

alert(introMsg);
for(i=0;i<numStars;i++){
    stars.push({x:Math.random()*myCanvas.width,y:Math.random()*myCanvas.height});
}
introInterval=setInterval(showIntro,33);
}

var scoreboard=null;
var options={
  "scoreboardWidth": "90%",
  "scoreboardHeight": "400",
  "submitDialogWidth": "auto",
  "submitDialogHeight": "auto",
  "burey": {
    "font-family": "Times New Roman",
    "font-style": "italic",
    "text-align": "center",
    "box-shadow": "0px 0px 3px #7710ff, inset 0px 0px 5px 1px black",
    "text-shadow": "5px 2px 4px grey",
    "color": "#9910ff",
    "background-color": "white",
    "border-radius": "25px"
  },
  "dialogTitle": {
    "box-shadow": "0px 0px 3px #7710ff, inset 0px 0px 5px 1px white",
    "text-shadow": "0px 0px 1px #e0d0ff",
    "border": "1px solid #7710bb",
    "border-radius": "2%",
    "font-family": "Times New Roman",
    "text-align": "center",
    "background": "black",
    "color": "#9910ff"
  },
  "scoreboardContainer": {
    "border": "1px solid grey",
    "box-shadow": "0px 0px 3px #7710ff, inset 0px 0px 5px 1px white",
    "background-color": "black"
  },
  "tableHeader": {
    "border-radius": "10px",
    "font-family": "Times New Roman",
    "text-align": "center",
    "border": "1px solid #7710bb",
    "box-shadow": "0px 0px 2px #9910ff, inset 0px 0px 3px white",
    "text-shadow": "0px 0px 1px #e0d0ff",
    "color": "#9910ff"
  },
  "scorePosition": {
    "font-family": "Times New Roman",
    "color": "#9910ff"
  },
  "scoreName": {
    "font-family": "Times New Roman",
    "color": "#9910ff",
    "word-wrap": "break-word",
    "max-width": "110px"
  },
  "scoreValue": {
    "font-family": "Times New Roman",
    "font-size": "15px",
    "color": "#9910ff"
  },
  "scoreTime": {
    "font-family": "Times New Roman",
    "font-size": "12px",
    "color": "#9910ff"
  },
  "newScoreContainer": {
    "background-color": "black"
  },
  "scoreYourScoreLabel": {
    "font-family": "Times New Roman",
    "color": "#9910ff"
  },
  "scoreValueLabel": {
    "font-family": "Times New Roman",
    "color": "#9910ff",
    "margin-right": "25px"
  },
  "scoreErrorLabel": {
    "font-family": "Times New Roman",
    "color": "red"
  },
  "scoreboardButtons": {
    "font-family": "Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background": "black",
    "color": "#9910ff",
    "display": "block"
  },
  "newScoreButtons": {
    "font-family": "Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background": "black",
    "color": "#9910ff"
  },
  "dialogButtonPanels": {
    "font-family": "Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background": "black",
    "color": "#9910ff"
  },
  "sortDropDownList": {
    "font-family": "Times New Roman",
    "font-size": "20px",
    "margin-left": "5px"
  },
  "loaderOptions": {
    "border-bottom": "25px solid #888",
    "border-top": "25px solid #888",
    "border-right": "25px solid #9910ff",
    "border-left": "25px solid #9910ff",
    "margin-left": "auto",
    "margin-right": "auto"
  }
}
window.onload=init;

    };

    this.draw = function(context2D)
    {
        // translating the 2D context to the particle coordinates
        context2D.save();
        context2D.translate(this.x, this.y);
        context2D.scale(this.scale, this.scale);

        // drawing a filled circle in the particle's local space
        context2D.beginPath();
        context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
        context2D.closePath();

        context2D.fillStyle = this.color;
        context2D.fill();

        context2D.restore();
    };
}


function createExplosion(x, y, color)
{
/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 * 
 * Parameters:
 *     x, y - explosion center
 *     color - particles' color
 */
    var minSize = 10;
    var maxSize = 30;
    var count = 10;
    var minSpeed = 60.0;
    var maxSpeed = 200.0;
    var minScaleSpeed = 1.0;
    var maxScaleSpeed = 4.0;

    for (var angle=0; angle<360; angle += Math.round(360/count))
    {
        var particle = new Particle();

        particle.x = x;
        particle.y = y;

        particle.radius = randVal(minSize, maxSize);

        particle.color = color;

        particle.scaleSpeed = randVal(minScaleSpeed, maxScaleSpeed);

        var speed = randVal(minSpeed, maxSpeed);

        particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

        particles.push(particle);
    }
}

function update(frameDelay)
{
    // update and draw particles
    for (var i=0; i<particles.length; i++){
        var particle = particles[i];

        particle.update(frameDelay);
        particle.draw(ctx);
        if(particle.scale===0){
            particles.splice(i,1);
        }
    }
}
////// EXPLOSION METHODS END


function drawBackground(){
      //Box
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(1,  1, myCanvas.
      width-2, myCanvas.height-2);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, myCanvas.
    width, myCanvas.height);
}
 
function drawStars(){
ctx.fillStyle = "white";
    for(i=0;i<stars.length;i++){
       ctx.beginPath();
       ctx.arc(stars[i].x, stars[i].y, 2, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
       stars[i].y+=1;
       //stars[i].y+=randVal(1,2);
       if(stars[i].y>myCanvas.height){
stars[i].x=Math.random()*myCanvas.width;
stars[i].y=0;
      }
    }
}

function drawShip(){
   //https://s-media-cache-ak0.pinimg.com/736x/88/b0/ce/88b0ce07ad7ee33832b1c5c4189d4194.jpg
   ctx.lineWidth=2;
    
    // left thruster
    ctx.strokeStyle='red';
    ctx.beginPath();
    ctx.moveTo(xShip-shotOffset,yShip);
    ctx.lineTo(xShip-shotOffset, yShip+shipSize*1.1);
    ctx.closePath();
    ctx.stroke();
    
    // right thruster
    ctx.beginPath();
    ctx.moveTo(xShip+shotOffset,yShip);
    ctx.lineTo(xShip+shotOffset, yShip+shipSize*1.2);
    ctx.closePath();
    ctx.stroke();
    
    // draw thrusters flames
    ctx.fillStyle = ((Math.random() < 0.5)? 'orange':'yellow');
    
    ctx.beginPath();
    ctx.arc(xShip-shotOffset, yShip+shipSize*1.25, 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(xShip+shotOffset, yShip+shipSize*1.25, 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    
    // draw ship wing
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    ctx.moveTo(xShip+shipSize, yShip); // top right
    ctx.lineTo(xShip+shipSize*1.1,yShip+shipSize*0.3); // middle right
    ctx.lineTo(xShip+shipSize*1.2,yShip+shipSize*0.7); // bottom right
    ctx.lineTo(xShip-shipSize*1.2,yShip+shipSize*0.7); // bottom left
    ctx.lineTo(xShip-shipSize*1.1,yShip+shipSize*0.3); // middle left
    ctx.lineTo(xShip-shipSize,yShip);
    ctx.closePath();
    ctx.fill();
    
    /*
    ctx.lineWidth=3;
    
    ctx.strokeStyle='lightgreen';
    // left wing
    ctx.beginPath();
    ctx.moveTo(xShip-(shotOffset+6),yShip+8);
    ctx.lineTo(xShip-(shotOffset+4), yShip+shipSize*2);
    ctx.closePath();
    ctx.stroke();
    
    // right wing
    ctx.beginPath();
    ctx.moveTo(xShip+(shotOffset+6),yShip+8);
    ctx.lineTo(xShip+(shotOffset+4), yShip+shipSize*2);
    ctx.closePath();
    ctx.stroke();
    */
     // ship body(triangle)
     /*
    ctx.fillStyle='green';
    ctx.beginPath();
    // top
    ctx.moveTo(xShip,yShip);
    // right side
    ctx.lineTo(xShip+shipSize*0.8, yShip+shipSize*2);
    // left side
    ctx.lineTo(xShip-shipSize*0.8, yShip+shipSize*2);
    ctx.fill();
    */
    
    // main ship body
    ctx.fillStyle='green';
    bezierCurve(xShip, yShip, shipSize*1.5, shipSize*2,'fill');
    ctx.fillStyle='lightblue';
    bezierCurve(xShip, yShip+shipSize*0.12, shipSize*0.6, shipSize*1.3,'fill');
    
    // draw shields
    if(shields > 0){
        ctx.lineWidth=shields;
        ctx.strokeStyle='blue';
        bezierCurve(xShip, yShip+shipSize*0.7, shipSize*4.5, shipSize*6,'stroke');
    }
    
}

function checkHits(){
    for(i=0;i<enemies.length;i++){
        for(j=0;j<shots.length;j++){
        impactRadius=enemies[i].size;
        if(Math.abs(shots[j].y-enemies[i].y) < impactRadius && Math.abs(shots[j].x-enemies[i].x) < impactRadius){
            stats.totalHits++;
        createExplosion(enemies[i].x, enemies[i].
        y, "#525252");
        createExplosion(enemies[i].x, enemies[i].
        y, "#FFA318");
        
       
        console.log("Alien Message Received:\n"+alienMsg[randVal(0,alienMsg.length-1)]);
        
        score+=enemies[i].size*level;
        if(score>level*levelIncrementer){
           increaseLevel();
        }
        enemies.splice(i,1);
        shots.splice(j,1);
        
        break;
        }
      }
    }
}

function drawShots(){
    
    for(i=0;i<shots.length;i++){
        ctx.fillStyle = shots[i].color;
       ctx.beginPath();
       ctx.arc(shots[i].x, shots[i].y, 2, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
       if(shots[i].target!==null){
            // tracking Death Blossoms
           if(enemies.indexOf(shots[i].target)===-1 && enemies.length>0){
               // re-target random enemy
               shots[i].target=enemies[randVal(0,enemies.length-1)];
           }
          else{
            shots[i].y+=((shots[i].target.y > shots[i].y)? shots[i].ySpeed:-shots[i].ySpeed);
            shots[i].x+=((shots[i].target.x > shots[i].x)? shots[i].xSpeed:-shots[i].xSpeed);
          }
       }
       else{
        shots[i].y-=shots[i].ySpeed;
        shots[i].x+=shots[i].xSpeed;
       }
       if(shots[i].y<0 || shots[i].y>myCanvas.height || shots[i].x<0 || shots[i].x>myCanvas.width){
           shots.splice(i,1);
      }
    }
}

function spawnBonus(){
       if(bonuses.length<maxBonuses){
   bonuses.push({x:Math.random()*myCanvas.width,y:0,speed:bonusSpeed,size:bonusRadius});
    }
}

function spawnEnemy(){
   if(enemies.length<maxEnemies){
   enemies.push({x:Math.random()*myCanvas.width,y:0,speed:randVal(enemyMinSpeed,enemyMaxSpeed),size:randVal(enemyMinSize,enemyMaxSize)});
   stats.enemyEncounters++;
   }
}

function bezierCurve(centerX, centerY, width, height,fillType) {
// draws a single ellipse
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height / 2);

    ctx.bezierCurveTo(
        centerX + width / 2, centerY - height / 2,
        centerX + width / 2, centerY + height / 2,
        centerX, centerY + height / 2
    );
    ctx.bezierCurveTo(
        centerX - width / 2, centerY + height / 2,
        centerX - width / 2, centerY - height / 2,
        centerX, centerY - height / 2
    );
    
    ctx.closePath();
    if(fillType==='fill')
        ctx.fill();
    else
        ctx.stroke();
}
function drawEnemy(enemy){
        eX=enemy.x;
        eY=enemy.y;
        eS=enemy.size;
        
        colors=enemyColors[randVal(0,enemyColors.length-1)]
        ctx.fillStyle=colors[0];
        bezierCurve(eX,eY,eS,eS*0.3,'fill');
        
        ctx.fillStyle=colors[1];
        bezierCurve(eX,eY+eS*0.3,eS*2,eS*0.5,'fill');
}

function drawEnemies(){
      for(i=0;i<enemies.length;i++){
      
      drawEnemy(enemies[i]);
      enemies[i].y+=enemies[i].speed;
      if(level===maxLevel)
          enemies[i].x+=enemies[i].speed*0.5*((Math.random()<0.5)? 1:-1);
      
      if(enemies[i].y>myCanvas.height){
           enemies.splice(i,1);
      }
   }
}

function drawBonus(bonus){
     ctx.beginPath();
      ctx.arc(bonus.x, bonus.y, bonus.size-10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'pink';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.font = "15px Arial";
      ctx.fillStyle = 'black';
      ctx.fillText("?",bonus.x-(bonus.size-10)/2,bonus.y+(bonus.size-10)/2);
}


function drawBonuses(){
    for(i=0;i<bonuses.length;i++){
      
      drawBonus(bonuses[i]);
      bonuses[i].y+=bonuses[i].speed;
      
      if(bonuses[i].y>myCanvas.height){
           bonuses.splice(i,1);
      }
   }
}

function claimBonus(bonus){
    // createExplosion(bonus.x,bonus.y, 'blue');
    ctx.lineWidth=4;
    ctx.strokeStyle='lightgreen';
    bezierCurve(xShip, yShip+shipSize*0.7, shipSize*4.5, shipSize*6,'stroke');
    result=powerUps[randVal(0,powerUps.length-1)];

    switch(result){
        case 'extraShot':
           maxShots+=1;
           console.log('Max shots increased: '+maxShots);
        break;
        case 'extraShield':
            shields+=1;
            console.log('Shields Increased: '+shields);
        break;
        case 'shotSpeed':
            shotSpeed+=1;
            console.log('Shot speed increased: '+shotSpeed);
            if(shotSpeed >= maxShotSpeed){
                powerUps.splice(powerUps.indexOf('shotSpeed'),1);
            }
        break;
        case 'deathBlossom':
            deathBlossomShots++;
            btnDeathBlossom.disabled=false;
            console.log('Death Blossom Recharged: '+deathBlossomShots);
        break;
        default:
            console.log("Something went wrong with bonusClaim!");
        break;
    }
    
}

function checkBonuses(){
    for(i=0;i<bonuses.length;i++){
    claimRadius=bonuses[i].size;
    if(Math.abs(yShip-bonuses[i].y) < claimRadius && Math.abs(xShip-bonuses[i].x) < claimRadius){
    claimBonus(bonuses[i]);
    bonuses.splice(i,1);
    }
  }
}

function reduceShield(){
    if(shields > 0){
        //createExplosion(xShip,yShip,'green');
        ctx.lineWidth=4;
        ctx.strokeStyle='red';
        bezierCurve(xShip, yShip+shipSize*0.7, shipSize*4.5, shipSize*6,'stroke');
    }
    shields--;
    //console.log("Shields Remaining : "+ shields);
    return shields;
}

function checkGameOver(){
    for(i=0;i<enemies.length;i++){
    impactRadius=enemies[i].size;
    if(Math.abs(yShip-enemies[i].y) < impactRadius && Math.abs(xShip-enemies[i].x) < impactRadius){
        enemies.splice(i,1);
    if(reduceShield()<0)
        return true;
    }
  }
  return false;
}

function drawExplosions(){
    update(33);
}

function drawDeath(){
   update(33);
    if(particles.length===0){
    // call add new score here
    console.log('Alien Message Received:\nNow your ashes may drift in the coldness of space for eternity, filthy human!');
    clearInterval(gameInterval);
    showGameOverMessage();
    gameInterval=null;
    showStats();
    btnNewGame.disabled=false;
    btnFire.disabled=true;
    btnDeathBlossom.disabled=true;
    scoreboard.submitNewScoreDialog(score);
}
}


function updateValuesUI(){
    document.getElementById('levelValue').innerHTML=level;
    document.getElementById('nextLevelValue').innerHTML=((level<maxLevel)? (Math.floor(level*levelIncrementer)):'MAX');
    document.getElementById('scoreValue').innerHTML=score;
    document.getElementById('shieldsValue').innerHTML=shields;
    document.getElementById('numShotsValue').innerHTML=(Math.max(0,maxShots-shots.length)+'/'+maxShots);
    document.getElementById('speedShotsValue').innerHTML=shotSpeed;
    document.getElementById('deathBlossomsValue').innerHTML=deathBlossomShots;
}

function drawScreen() {

drawBackground();
drawStars();
drawShots();
drawEnemies();
drawBonuses();
checkBonuses();
checkHits();
drawExplosions();
drawShip();
updateValuesUI();
if(checkGameOver()){
    createExplosion(xShip, yShip, "#525252");
    createExplosion(xShip,yShip, "#FFA318");
    clearInterval(gameInterval);
    clearInterval(enemySpawnerInterval);
    clearInterval(bonusSpawnerInterval);
    gameInterval=setInterval(drawDeath,33);
    //alert("GAME OVER PUNY HUMAN!!!\nYour score: "+score)
    return;
    }
}

function drawIntroMessage(){
    ctx.font = "15px 'Press Start 2P'";
    ctx.fillStyle = 'green';
    ctx.fillText("Space Invasion!",myCanvas.width*0.1,myCanvas.height*0.3);
    ctx.font = "10px 'Press Start 2P'";
    ctx.fillStyle = 'red';
    ctx.fillText("Coded by Burey",myCanvas.width*0.12,myCanvas.height*0.4);
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillStyle = 'yellow';
    ctx.fillText("Tap 'New Game' to Start",myCanvas.width*0.1,myCanvas.height*0.6);
}

function showIntro() {
    drawBackground();
    drawStars();
    drawShip();
    drawIntroMessage();
}


function increaseLevel(){
    if(level>=maxLevel)
        return;
    
   level++;
   levelIncrementer*=1.5;
   console.log('Next level at: '+(level*levelIncrementer)+' Points!');
   maxEnemies+=5;
   enemySpawnTime=Math.max(1,enemySpawnTime-100);
   clearInterval(enemySpawnerInterval);
   enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime);
}

function showStats(){
    
    var msg="Game Stats:\n\nTotal Shots: "+(stats.totalShots)+
    "\nTotal Hits: "+(stats.totalHits)+
    "\nHit Ratio: "+(stats.totalHits/stats.totalShots)+
    "\nTotal Encounters: "+(stats.enemyEncounters)+
    "\nEnemies Escaped: "+(stats.enemyEncounters-stats.totalHits)+
    "\nEscape Ratio: "+((stats.enemyEncounters-stats.totalHits)/(stats.enemyEncounters));
    
    alert(msg);
}

function showGameOverMessage(){
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillStyle = 'red';
    ctx.fillText("Game Over!!!",myCanvas.width*0.2,myCanvas.height*0.5);

}

function showPauseMessage(){
    ctx.font = "15px 'Press Start 2P'";
    ctx.fillStyle = 'red';
    ctx.fillText("Game Paused",myCanvas.width*0.2,myCanvas.height*0.5);
    var pauseOrNewGame = ((gameInterval===null)? 'New Game':'FIRE');
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText("Tap '"+pauseOrNewGame+"' to continue",myCanvas.width*0.05,myCanvas.height*0.6);
}

function resumeGame(){
    // unpause game
        gamePaused=false;
        gameInterval=setInterval(drawScreen, 33);
        enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime);
        bonusSpawnerInterval=setInterval(spawnBonus,bonusSpawnTime);
}

function resetGame(){
    
myCanvas.width = window.innerWidth*0.9;
myCanvas.height = window.innerHeight*0.65;
yShip = myCanvas.height-shipSize-20;

console.log('Alien Message Received:\nTurn back now, puny human, before you regret it!!!');

shots=[];
enemies=[];
particles=[];
stars=[];

for(i=0;i<numStars;i++){
    stars.push({x:Math.random()*myCanvas.width,y:Math.random()*myCanvas.height});
}
    
    // DISABLE/ENABLE CONTROLS
    btnNewGame.disabled=true;
    btnFire.disabled=false;
    btnDeathBlossom.disabled=false;

   // RESET TO STARTING SETUP
    
    stats.totalShots=0;
    stats.totalHits=0;
    stats.enemyEncounters=0;
    
    score=0;
    level=1;
    levelIncrementer=100;
    
    deathBlossomShots=1;
    shields=3;
    maxEnemies=5;
    enemySpawnTime=1000;
    maxShots=5;
    shotSpeed=5;
    bonuses=[];
    updateValuesUI();
    gamePaused = false;
}

var canvasContainer=document.getElementById("canvasContainer");
var myCanvas=document.getElementById("myCanvas");


myCanvas.width = window.innerWidth*0.9;
myCanvas.height = window.innerHeight*0.65;

ctx = myCanvas.getContext("2d");

var speed = 5;
var shipSize=15;
var shields=3;
var deathBlossomShots=1;
var minTrackingDeathBlossoms=5;

var gamePaused=false;
var introInterval=null;

var yShip = myCanvas.height-shipSize-20;
var xShip = myCanvas.width/2;
var stars=[];
var numStars=100;
var shots=[];
var shotSide=1;
var shotOffset=4;
var maxShots=5;
var shotSpeed=5;
var maxShotSpeed=15;
var particles=[];
var enemies=[];
var enemyColors=[['red','blue'],['yellow','green']]
var maxEnemies=5;
var enemySpawnTime=1000;
var enemyMinSpeed=2;
var enemyMaxSpeed=6;
var enemyMinSize=10;
var enemyMaxSize=20;

var gameInterval=null;
var enemySpawnerInterval=null;
var score=0;
var level=1;
var maxLevel=10;
var levelIncrementer=100;

var bonusSpawnTime=5000; // spawn bonus every 5 seconds
var bonusSpawnerInterval=null;
var maxBonuses=5;
var bonusRadius=20;
var bonusSpeed=3;
var bonuses=[];
var powerUps=['extraShot','extraShield','shotSpeed','deathBlossom'];

var stats={
    totalShots:0,
    totalHits:0,
    enemyEncounters:0
};

var btnShowScoreboard=document.getElementById("showScoreboard");

btnShowScoreboard.onclick=function(){
   scoreboard.showScoreBoard();
   try{
    clearInterval(gameInterval);
    clearInterval(enemySpawnerInterval);
    clearInterval(bonusSpawnerInterval);
   }catch(err){alert(err);}
   if(!introInterval && gameInterval){
    gamePaused=true;
    showPauseMessage();
   }
}

btnFire=document.getElementById("fire");
btnDeathBlossom=document.getElementById("death_blossom");
btnFire.disabled=true;
btnDeathBlossom.disabled=true;
btnNewGame=document.getElementById("newGame");

btnFire.onclick=function(){
    stats.totalShots++;
    
shotSide*=(-1);
if(shots.length<maxShots){
    shots.push({x:xShip+(shotSide*shotOffset),y:yShip,xSpeed:0,ySpeed:shotSpeed,color:'lightgreen',target:null});
    }
    if(gamePaused){
        resumeGame();
    }
}

btnDeathBlossom.onclick=function(){
    
    // DEATH BLOSSOM!!!! Credits to Kirk Schafer for the inspiration :D
    if(enemies.length < minTrackingDeathBlossoms){
        for(i=-15;i<=15;i+=1){
    shots.push({x:xShip+(shotSide*shotOffset),y:yShip,xSpeed:i,ySpeed:shotSpeed,color:'red',target:null});
    }
    }
    else{
        // Upgraded Death Blossoms with enemy tracking
        for(i=0;i<enemies.length;i+=1){
    shots.push({x:xShip+(shotSide*shotOffset),y:yShip,xSpeed:enemies[i].speed*2,ySpeed:enemies[i].speed*2,color:'red',target:enemies[i]});
    }
    }
    
    deathBlossomShots--;
    if(deathBlossomShots === 0){
        btnDeathBlossom.disabled=true;
    }
    if(gamePaused){
        resumeGame();
    }
}


btnNewGame.onclick=function(){
if(introInterval!=null){
clearInterval(introInterval);
introInterval=null;
}
resetGame();

gameInterval=setInterval(drawScreen, 33);
enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime);
bonusSpawnerInterval=setInterval(spawnBonus,bonusSpawnTime);
}

alert(introMsg);
for(i=0;i<numStars;i++){
    stars.push({x:Math.random()*myCanvas.width,y:Math.random()*myCanvas.height});
}
introInterval=setInterval(showIntro,33);
}

var scoreboard=null;
var options={
  "scoreboardWidth": "90%",
  "scoreboardHeight": "400",
  "submitDialogWidth": "auto",
  "submitDialogHeight": "auto",
  "burey": {
    "font-family": "Times New Roman",
    "font-style": "italic",
    "text-align": "center",
    "box-shadow": "0px 0px 3px #7710ff, inset 0px 0px 5px 1px black",
    "text-shadow": "5px 2px 4px grey",
    "color": "#9910ff",
    "background-color": "white",
    "border-radius": "25px"
  },
  "dialogTitle": {
    "box-shadow": "0px 0px 3px #7710ff, inset 0px 0px 5px 1px white",
    "text-shadow": "0px 0px 1px #e0d0ff",
    "border": "1px solid #7710bb",
    "border-radius": "2%",
    "font-family": "Times New Roman",
    "text-align": "center",
    "background": "black",
    "color": "#9910ff"
  },
  "scoreboardContainer": {
    "border": "1px solid grey",
    "box-shadow": "0px 0px 3px #7710ff, inset 0px 0px 5px 1px white",
    "background-color": "black"
  },
  "tableHeader": {
    "border-radius": "10px",
    "font-family": "Times New Roman",
    "text-align": "center",
    "border": "1px solid #7710bb",
    "box-shadow": "0px 0px 2px #9910ff, inset 0px 0px 3px white",
    "text-shadow": "0px 0px 1px #e0d0ff",
    "color": "#9910ff"
  },
  "scorePosition": {
    "font-family": "Times New Roman",
    "color": "#9910ff"
  },
  "scoreName": {
    "font-family": "Times New Roman",
    "color": "#9910ff",
    "word-wrap": "break-word",
    "max-width": "110px"
  },
  "scoreValue": {
    "font-family": "Times New Roman",
    "font-size": "15px",
    "color": "#9910ff"
  },
  "scoreTime": {
    "font-family": "Times New Roman",
    "font-size": "12px",
    "color": "#9910ff"
  },
  "newScoreContainer": {
    "background-color": "black"
  },
  "scoreYourScoreLabel": {
    "font-family": "Times New Roman",
    "color": "#9910ff"
  },
  "scoreValueLabel": {
    "font-family": "Times New Roman",
    "color": "#9910ff",
    "margin-right": "25px"
  },
  "scoreErrorLabel": {
    "font-family": "Times New Roman",
    "color": "red"
  },
  "scoreboardButtons": {
    "font-family": "Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background": "black",
    "color": "#9910ff",
    "display": "block"
  },
  "newScoreButtons": {
    "font-family": "Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background": "black",
    "color": "#9910ff"
  },
  "dialogButtonPanels": {
    "font-family": "Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background": "black",
    "color": "#9910ff"
  },
  "sortDropDownList": {
    "font-family": "Times New Roman",
    "font-size": "20px",
    "margin-left": "5px"
  },
  "loaderOptions": {
    "border-bottom": "25px solid #888",
    "border-top": "25px solid #888",
    "border-right": "25px solid #9910ff",
    "border-left": "25px solid #9910ff",
    "margin-left": "auto",
    "margin-right": "auto"
  }
}
window.onload=init;
