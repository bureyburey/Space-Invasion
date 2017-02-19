/*
Explosion effect taken from
http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
and modified by Burey
*/

 

var alienMsg=['YOU WILL PAY FOR YOUR INSOLENCE, HUMAN SCUM!','The Cake is a LIE!!','Stahhpp, we come in peace ;_;','The horror, OH, THE HORROR!!!','Revenge is Coming, Puny Human!','Oh mighty lord Xeno, accept me to your realm!','Please, for the love of Xeno, will someone delete my browser history????'];

var introMsg=("It happend on the 4th of March, 2017...\nWe were attacked with their full force...\nThey rendered our defences useless...\nyou are earth's last and only hope!\nStop the invasion or we are all doomed....\n\nControls:\nTilt the phone left/right to move the spaceship.\nTap 'FIRE' button to shoot the photon cannons.\nTap 'DB' to launch a special Death Blossom strike.\nKeyboard controls:\nA/D or Left/Right arrow for movement.\nSpace: Regular fire.\nEnter: Death Blossom.\nGreen Button: activate Auto Fire mode.\n\nThe game now offers keyboard support.\nIt is recommended to use the phone with the acceleration sensors for the movement.\nthe game is still a work in progress,\nso please reply in the comments if you have any issues or suggestions.\n\n Have fun ^.^\n\n[UPDATE LOG]\n[Added] explosion effects.\n[Added] scoreboard.\n[Added] increasing difficulty.\n[Added] shields (start with 3).\n[Added] Bonuses! pick them for power ups!\n[Added] HUD below the canvas.\n[Added] graphics to the shields.\n[Added] game pause when opening scoreboard.\n[Added] game stats on game over.\n[Added] intro screen.\n[Added] Death Blossoms (Kirk Schafer idea >:p ).\n[Changed] ship design.\n[Upgrade] Death Blossoms now switch to tracking mode when there are more than 5 enemies nearby.\n[Changed] leveling system: each new level requires 150% more points to reach than the previous.\n[Added] Boss encounters on each new level.\n[Added] additional bonus score for claimed prizes.\n[Changed] levels and scoring algorithms.\n[Added] Keyboard support.\m[Added] Vertical Axis movement.\n[Added] slider for angle adjustment of vertical movement.\n")
function init(){


if(window.DeviceMotionEvent){
    window.addEventListener("devicemotion", motion, false);
}else{
  console.log("DeviceMotionEvent is not supported");
}

scoreboard=new Scoreboard(options);

function updateMovement(value,axis){
    if(!gamePaused){
    
        if(axis==='x'){
            xShip-=(value)*1.1;
           if(xShip<shipSize/2)
               xShip=shipSize/2;
           if(xShip>myCanvas.width-shipSize/2)
               xShip=myCanvas.width-shipSize/2;
        }
        if(axis==='y'){
            yShip-=(value)*0.8-(yOffset);
           if(yShip<shipSize/2)
               yShip=shipSize/2;
               
           if(yShip>myCanvas.height-shipSize/2)
               yShip=myCanvas.height-shipSize/2;
        }
    }
}

function motion(event){
    updateMovement(event.accelerationIncludingGravity.x,'x');
    if(yAxisEnabled){
        updateMovement(event.accelerationIncludingGravity.z,'y');
    }
   
  /*console.log("Accelerometer: "
    + event.accelerationIncludingGravity.x + ", "
    + event.accelerationIncludingGravity.y + ", "
    + event.accelerationIncludingGravity.z
  );*/
}

function keysMovementUpdate(){
    if(keys.up){
        yShip-=7;
    }
    if(keys.down){
        yShip+=7;
    }
    if(keys.left){
        xShip-=7;
    }
    if(keys.right){
        xShip+=7;
    }
    
    // borders correction
    if(xShip<shipSize/2)
        xShip=shipSize/2;
    if(xShip>myCanvas.width-shipSize/2)
        xShip=myCanvas.width-shipSize/2;

    if(yShip<shipSize/2)
        yShip=shipSize/2;
               
    if(yShip>myCanvas.height-shipSize/2)
        yShip=myCanvas.height-shipSize/2;
}

function randVal(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randFloat(min,max){
    return (Math.random()*(max-min+1)+min);
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


function createExplosion(x, y, color){
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
       ctx.arc(stars[i].x, stars[i].y, stars[i].size, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
       stars[i].y+=stars[i].speed;
       if(stars[i].y>myCanvas.height){
        stars[i].x=Math.random()*myCanvas.width;
        stars[i].y=0;
      }
    }
}

function drawShip(){
   //https://s-media-cache-ak0.pinimg.com/736x/88/b0/ce/88b0ce07ad7ee33832b1c5c4189d4194.jpg
   
   
    // draw thrusters flames
    if(Math.random() < 0.5){
        ctx.fillStyle = ((Math.random() < 0.5)? 'orange':'yellow');
        bezierCurve(xShip-shotOffset, yShip+shipSize*1.3, 4, 5,'fill');
        bezierCurve(xShip+shotOffset, yShip+shipSize*1.3, 4, 5,'fill');
    }
    else{
        ctx.fillStyle = ((Math.random() < 0.5)? 'orange':'yellow');
        bezierCurve(xShip-shotOffset, yShip+shipSize*1.3, 3, 9,'fill');
        bezierCurve(xShip+shotOffset, yShip+shipSize*1.3, 3, 9,'fill');
    }
   
   
    ctx.lineWidth=2;
    
    // left thruster
    ctx.strokeStyle='red';
    ctx.beginPath();
    ctx.moveTo(xShip-shotOffset,yShip);
    ctx.lineTo(xShip-shotOffset, yShip+shipSize*1.2);
    // right thruster
    ctx.moveTo(xShip+shotOffset,yShip);
    ctx.lineTo(xShip+shotOffset, yShip+shipSize*1.2);
    ctx.closePath();
    ctx.stroke();
 
 
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
    
    // draw ship wing
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(xShip+shipSize, yShip); // top right
    ctx.lineTo(xShip+shipSize*1.1,yShip+shipSize*0.6); // middle right
    ctx.lineTo(xShip+shipSize*1.1,yShip+shipSize*0.65); // bottom right
    ctx.lineTo(xShip-shipSize*1.1,yShip+shipSize*0.65); // bottom left
    ctx.lineTo(xShip-shipSize*1.1,yShip+shipSize*0.6); // middle left
    ctx.lineTo(xShip-shipSize,yShip);
    ctx.closePath();
    ctx.fill();
    
    // draw cool stripes
    ctx.lineWidth=2;
    ctx.strokeStyle='red';
    ctx.beginPath();
    ctx.moveTo(xShip-shipSize*1.05,yShip+shipSize*0.2);
    ctx.lineTo(xShip+shipSize*1.05,yShip+shipSize*0.2);
    ctx.moveTo(xShip-shipSize*1.15,yShip+shipSize*0.5);
    ctx.lineTo(xShip+shipSize*1.15,yShip+shipSize*0.5);
    ctx.closePath();
    ctx.stroke();
    
    
    // main ship body
    ctx.fillStyle='green';
    bezierCurve(xShip, yShip, shipSize*1.4, shipSize*2,'fill');
    ctx.fillStyle='lightblue';
    bezierCurve(xShip, yShip+shipSize*0.12, shipSize*0.6, shipSize*1.3,'fill');
    

    
    
    // draw shields
    if(shields > 0){
        ctx.lineWidth=Math.ceil(shields*0.5);
        ctx.strokeStyle='blue';
        bezierCurve(xShip, yShip+shipSize*0.7, shipSize*4.5, shipSize*6,'stroke');
    }
    
}

function checkHitsOnBoss(){
        for(i=0;i<bosses.length;i++){
            bX=bosses[i].x;
            bY=bosses[i].y;
            bS=bosses[i].size;
        for(j=0;j<shots.length;j++){
        impactRadius=bosses[i].size;
        if(Math.abs(shots[j].y-bosses[i].y) < impactRadius && Math.abs(shots[j].x-bosses[i].x) < impactRadius){
            
            if(bosses[i].shields<=0){
                // boss dead
                createExplosion(bosses[i].x, bosses[i].y, "#525252");
                createExplosion(bosses[i].x, bosses[i].y, "#FFA318");
                createExplosion(bosses[i].x, bosses[i].y, "red");
                createExplosion(bosses[i].x, bosses[i].y, "#yellow");
                createExplosion(bosses[i].x, bosses[i].y, "#green");
                createExplosion(bosses[i].x, bosses[i].y, "#blue");
                
                //console.log("Alien Message Received:\nTHE BOSS HAS FALLEN!!!");
                
                score+=Math.floor(bosses[i].size*level*balanceFactor);
                bosses.splice(i,1);

                // spawn boss drops
                spawnPrizeBonuses(bX,bY,bS);
                
                
                if(bosses.length===0){
                    // update next boss paramaters (increase difficulty)
                
                    bossShotDelay=Math.max(500,bossShotDelay-25);
                    bossReach=Math.min(myCanvas.height/2,bossReach+2.5)
                    bossShotSpeed+=level;
                    bossShields+=5;
                    bossSpeed+=1;
                    bossShotSize+=0.3;
                    bossSize+=3;
                    enemyMaxSpeed=Math.min(enemySpeedCap,enemyMaxSpeed+(1/level));
                    if(bossShotsSpawnerInterval!=null){
                        clearInterval(bossShotsSpawnerInterval);
                        bossShotsSpawnerInterval=null;
                    }
                    bonusSpawnerInterval=setInterval(spawnBonus,bonusSpawnTime); // spawn bonuses after boss defeated
                    enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime); // spawn enemies after boss defeated
                }
            }else{
                bosses[i].shields-=1;
            }
            shots.splice(j,1);
            break;
        }
    }
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
        
        //console.log("Alien Message Received:\n"+alienMsg[randVal(0,alienMsg.length-1)]);
        
        score+=Math.floor(enemies[i].size*enemies[i].speed*level*balanceFactor);

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
    
     for(i=0;i<bossesShots.length;i++){
        ctx.fillStyle = bossesShots[i].color;
       ctx.beginPath();
       ctx.arc(bossesShots[i].x, bossesShots[i].y, bossesShots[i].shotSize, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
       
        bossesShots[i].y+=bossesShots[i].ySpeed;
        bossesShots[i].x+=bossesShots[i].xSpeed;
       
       if(bossesShots[i].y<0 || bossesShots[i].y>myCanvas.height || bossesShots[i].x<0 || bossesShots[i].x>myCanvas.width){
           bossesShots.splice(i,1);
      }
    }
}

function spawnPrizeBonuses(bX,bY,bS){
    //for(i=0;i<Math.ceil(level/2);i++){
        randPowerUp=powerUps[randVal(0,powerUps.length-1)];
        powerUpColor=powerUpsColors[randPowerUp];
        bonuses.push({x:bX-bS+randVal(0,bS),y:bY,speed:bonusSpeed,size:bonusRadius,powerUp:randPowerUp,color:powerUpColor});
    //}
}

function spawnBonus(){
       if(bonuses.length<maxBonuses){
           randPowerUp=powerUps[randVal(0,powerUps.length-1)];
           powerUpColor=powerUpsColors[randPowerUp];
   bonuses.push({x:Math.random()*myCanvas.width,y:0,speed:bonusSpeed,size:bonusRadius,powerUp:randPowerUp,color:powerUpColor});
    }
}

function spawnEnemy(){
   if(enemies.length<maxEnemies){
   enemies.push({x:Math.random()*myCanvas.width,y:0,speed:randVal(enemyMinSpeed,enemyMaxSpeed),size:randVal(enemyMinSize,enemyMaxSize)});
   stats.enemyEncounters++;
   }
}

function generateBossShot(){
    for(i=0;i<bosses.length;i++){
        //calculate required x velocity to hit current position of player
        travelTime=Math.abs(bosses[i].y-yShip)/bossShotSpeed;
        xDist=Math.abs(bosses[i].x-xShip);
        velocityX=xDist/travelTime;
        velocityX*=((bosses[i].x<xShip)?1:-1);
        
        if(Math.random()<0.5){
            // give shot some offset
            velocityX+=(randFloat(1,1));
        }
        
        velocityY=((bosses[i].y<yShip)? 1:-1)*bossShotSpeed;
        
        bossesShots.push({x:bosses[i].x,y:bosses[i].y,xSpeed:velocityX,ySpeed:velocityY,color:'yellow',target:null,shotSize:bossShotSize});
    }
}

function spawnBoss(){
    bosses.push({x:Math.random()*myCanvas.width,y:0,speed:bossSpeed,size:bossSize,shields:bossShields,dir:((Math.random()<0.5)?-1:1),maxReach:bossReach});
    
    if(bossShotsSpawnerInterval===null){
        bossShotsSpawnerInterval=setInterval(generateBossShot,bossShotDelay); // set boss shots generator
    }
    if(enemySpawnerInterval!=null){
        clearInterval(enemySpawnerInterval); // stop spawning enemies
        enemySpawnerInterval=null;
    }
    if(bonusSpawnerInterval!=null){
        clearInterval(bonusSpawnerInterval); // stop spawning bonuses
        bonusSpawnerInterval=null;
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

function drawBoss(boss){
        eX=boss.x;
        eY=boss.y;
        eS=boss.size;
        dir=boss.dir;
             colors=bossColors[randVal(0,bossColors.length-1)]
        ctx.fillStyle=colors[0];
        bezierCurve(eX,eY,eS,eS*0.3,'fill');
        
        ctx.fillStyle=colors[1];
        bezierCurve(eX,eY+eS*0.3,eS*2,eS*0.5,'fill');
        
        if(boss.shields > 0){
            ctx.lineWidth=Math.ceil(boss.shields*0.5);
            ctx.strokeStyle = 'purple';
            bezierCurve(eX, eY+eS*0.3, eS*3, eS*2,'stroke');
        }
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
      if(level>=Math.floor(maxLevel/3)) // add zigzag to enemies
          enemies[i].x+=enemies[i].speed*0.5*((Math.random()<0.5)? 1:-1);
      
      if(enemies[i].y>myCanvas.height){
           enemies.splice(i,1);
      }
   }
  for(i=0;i<bosses.length;i++){
      drawBoss(bosses[i]);
      // left/right movement
       
        bosses[i].x+=bosses[i].speed*bosses[i].dir;
        if(bosses[i].x<0 || bosses[i].x>myCanvas.width){
            bosses[i].dir*=-1;
        }
        if(bosses[i].y<bosses[i].maxReach){
            bosses[i].y+=speed;
        }
  }
}

function drawBonus(bonus){
     ctx.beginPath();
      ctx.arc(bonus.x, bonus.y, bonus.size-10, 0, 2 * Math.PI, false);
      ctx.fillStyle = bonus.color;
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
    // result=powerUps[randVal(0,powerUps.length-1)];
    result=bonus.powerUp;
    score+=bonusPrizePoints;
    stats.pickedBonuses++;
    switch(result){
        case 'extraShot':
           maxShots+=1;
           //console.log('Max shots increased: '+maxShots);
        break;
        case 'extraShield':
            shields+=1;
            //console.log('Shields Increased: '+shields);
        break;
        case 'deathBlossom':
            deathBlossomShots++;
            btnDeathBlossom.disabled=false;
            //console.log('Death Blossom Recharged: '+deathBlossomShots);
        break;
        case 'shotSpeed':
            shotSpeed+=1;
            //console.log('Shot speed increased: '+shotSpeed);
            if(shotSpeed >= maxShotSpeed){
                powerUps.splice(powerUps.indexOf('shotSpeed'),1);
            }
        break;

        case 'autoFireDelay':
            autoFireDelay=Math.max(minAutoFireDelay,autoFireDelay-10);
            //console.log('Auto Fire Delay Reduced: '+autoFireDelay);
            if(autoFireDelay <= minAutoFireDelay){
                powerUps.splice(powerUps.indexOf('autoFireDelay'),1);
            }
            if(autoFire){
                clearInterval(autoFire);
                autoFire=setInterval(fireNormal,autoFireDelay);
            }
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
    // check enemy collisions on player
    for(i=0;i<enemies.length;i++){
    impactRadius=enemies[i].size;
    if(Math.abs(yShip-enemies[i].y) < impactRadius && Math.abs(xShip-enemies[i].x) < impactRadius){
        enemies.splice(i,1);
    if(reduceShield()<0)
        return true;
    }
  }
  // check bosses shots hits on player
    for(i=0;i<bossesShots.length;i++){
    impactRadius=bossesShots[i].shotSize*3;
    if(Math.abs(yShip-bossesShots[i].y) < impactRadius && Math.abs(xShip-bossesShots[i].x) < impactRadius){
        bossesShots.splice(i,1);
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
    //console.log('Alien Message Received:\nNow your ashes may drift in the coldness of space for eternity, filthy human!');
    if(gameInterval!=null){
        clearInterval(gameInterval);
        gameInterval=null;
    }

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
    document.getElementById('autoFireDelayValue').innerHTML=autoFireDelay;
}

function drawScreen() {

drawBackground();
drawStars();
drawShots();
drawEnemies();
drawBonuses();
checkBonuses();
checkHits();
checkHitsOnBoss();
drawExplosions();
drawShip();
keysMovementUpdate();
updateValuesUI();
if(score>level*levelIncrementer){
    increaseLevel();
}
if(checkGameOver()){
    createExplosion(xShip, yShip, "#525252");
    createExplosion(xShip,yShip, "#FFA318");
    createExplosion(xShip,yShip, "red");
    clearInterval(gameInterval);
    if(enemySpawnerInterval){
        clearInterval(enemySpawnerInterval);
        enemySpawnerInterval=null;
    }
    if(bonusSpawnerInterval!=null){
        clearInterval(bonusSpawnerInterval);
        bonusSpawnerInterval=null;
    }
    if(bossShotsSpawnerInterval!=null){
        clearInterval(bossShotsSpawnerInterval);
        bossShotsSpawnerInterval=null;
    }
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
    keysMovementUpdate();
}


function increaseLevel(){
    if(level>=maxLevel)
        return;
    
    level++;
   levelIncrementer*=2;
   //console.log('Next level at: '+(level*levelIncrementer)+' Points!');
   maxEnemies+=5;
   enemySpawnTime=Math.max(minEnemySpawnTime,enemySpawnTime-150);
   for(i=0;i<level-1;i++){
    spawnBoss();
   }
}

function showStats(){
    
    var msg="Game Stats:\n\nTotal Shots: "+(stats.totalShots)+
    "\nTotal Hits: "+(stats.totalHits)+
    "\nHit Ratio: "+(stats.totalHits/stats.totalShots)+
    "\nTotal Encounters: "+(stats.enemyEncounters)+
    "\nEnemies Escaped: "+(stats.enemyEncounters-stats.totalHits)+
    "\nEscape Ratio: "+((stats.enemyEncounters-stats.totalHits)/(stats.enemyEncounters))+
    "\nBonus Prizes Picked: "+stats.pickedBonuses+
    "\nBonus Score from Prizes: "+(stats.pickedBonuses*bonusPrizePoints);
    
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

function pauseGame(){
    try{
    clearInterval(gameInterval);
    clearInterval(enemySpawnerInterval);
    clearInterval(bonusSpawnerInterval);
    if(bossShotsSpawnerInterval!==null){
        clearInterval(bossShotsSpawnerInterval);
        bossShotsSpawnerInterval=null;
    }
    if(autoFire!==null){
       clearInterval(autoFire);
       autoFire=null;
    }
   }catch(err){alert(err);}
   if(!introInterval && gameInterval){
    gamePaused=true;
    showPauseMessage();
   }
}

function resumeGame(){
    // unpause game
        if(bosses.length>0){
            bossShotsSpawnerInterval=setInterval(generateBossShot,bossShotDelay);
        }
        else{
            enemySpawnerInterval=setInterval(spawnEnemy,enemySpawnTime);
            bonusSpawnerInterval=setInterval(spawnBonus,bonusSpawnTime);
        }
        gamePaused=false;
        gameInterval=setInterval(drawScreen, 33);
        if(document.getElementById("autofire").checked){
            autoFire=setInterval(fireNormal,autoFireDelay);
    }else{
        clearInterval(autoFire);
        autoFire=null;
    }
}

function resetGame(){
    
myCanvas.width = window.innerWidth*widthRatio;
myCanvas.height = window.innerHeight*heightRatio;
yShip = myCanvas.height-shipSize-20;

//console.log('Alien Message Received:\nTurn back now, puny human, before you regret it!!!');

    shots=[];
    enemies=[];
    particles=[];
    stars=[];
    bonuses=[];
    powerUps=['extraShot','extraShield','deathBlossom','shotSpeed','autoFireDelay'];
    
    generateStars();
    
    // RESET BOSS VARIABLES
    bosses=[];
    bossesShots=[];
    bossSize=30;
    bossSpeed=5;
    bossShields=3;
    bossReach=20;
    bossShotSize=2;
    bossShotSpeed=3;
    bossShotDelay=1000;
    
    // DISABLE/ENABLE CONTROLS
    btnNewGame.disabled=true;
    btnFire.disabled=false;
    btnDeathBlossom.disabled=false;

   // RESET TO STARTING SETUP
    stats.totalShots=0;
    stats.totalHits=0;
    stats.enemyEncounters=0;
    stats.pickedBonuses=0;
    
    score=0;
    level=1;
    levelIncrementer=1000;
    
    deathBlossomShots=5;
    shields=3;
    maxEnemies=5;
    enemyMaxSpeed=5;
    enemySpawnTime=1000;
    maxShots=5;
    shotSpeed=5;
    autoFireDelay=200;
    
    updateValuesUI();
    gamePaused = false;
}

function generateStars(){
    for(i=0;i<numStars;i++){
        stars.push({x:Math.random()*myCanvas.width,y:Math.random()*myCanvas.height,size:randVal(1,3),speed:randFloat(0.5,1)});
    }
}
function fireNormal(){
    stats.totalShots++;
    shotSide*=(-1);
    if(shots.length<maxShots){
    shots.push({x:xShip+(shotSide*shotOffset),y:yShip,xSpeed:0,ySpeed:shotSpeed,color:'lightgreen',target:null});
    }
    if(gamePaused){
        resumeGame();
    }
}

function fireDeathBlossom(){
    
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

function handleKeyboardUp(key){
    if(key===38 || key===87){
        // move Up
        keys.up=false;
    }
    if(key===40 || key===83){
        // move Down
        keys.down=false;
    }
    if(key===37 || key===65){
        // move Left
        keys.left=false;
    }
    if(key===39 || key===68){
        // move Right
        keys.right=false;
    }
}
function handleKeyboardDown(key){
    /* key codes
    32 - spacebar
    38 - Up Arrow
    40 - Down Arrow
    37 - Left Arrow
    39 - Right Arrow
    87 - W
    83 - S
    65 - A
    68 - D
    13 - Enter
    */

    if(key===32){
        // fire
        fireNormal();
    }
    if(key===13){
        // fire death blossom
        fireDeathBlossom();
    }
    if(key===38 || key===87){
        // move Up
        keys.up=true;
    }
    if(key===40 || key===83){
        // move Down
        keys.down=true;
    }
    if(key===37 || key===65){
        // move Left
        keys.left=true;
    }
    if(key===39 || key===68){
        // move Right
        keys.right=true;
    }
}


var widthRatio=0.85;
var heightRatio=0.65;

var canvasContainer=document.getElementById("canvasContainer");
var myCanvas=document.getElementById("myCanvas");

myCanvas.width = window.innerWidth*widthRatio;
myCanvas.height = window.innerHeight*heightRatio;

ctx = myCanvas.getContext("2d");

var speed = 5;
var shipSize=15;
var shields=3;
var deathBlossomShots=5;
var minTrackingDeathBlossoms=5;
var autoFireDelay=200;
var minAutoFireDelay=20;

var keys={
    up:false,
    left:false,
    down:false,
    right:false
}


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

var bosses=[];
var bossesShots=[];
var bossSize=30;
var bossShotSize=3;
var bossShotSpeed=1;
var bossSpeed=5;
var bossShields=5;
var bossReach=20;
var bossShotDelay=1000;

var enemyColors=[['red','blue'],['yellow','green']];
var bossColors=[['blue','yellow'],['red','white']];

var maxEnemies=5;
var enemySpawnTime=1000;
var minEnemySpawnTime=200;
var enemyMinSpeed=2;
var enemyMaxSpeed=5;
var enemySpeedCap=10;
var enemyMinSize=10;
var enemyMaxSize=20;

var gameInterval=null;
var enemySpawnerInterval=null;
var bossShotsSpawnerInterval=null;
var bonusSpawnerInterval=null;

var score=0;
var balanceFactor=1.5;
var level=1;
var maxLevel=15;
var levelIncrementer=100;

var bonusSpawnTime=5000; // spawn bonus every 5 seconds
var maxBonuses=5;
var bonusRadius=20;
var bonusSpeed=3;
var bonuses=[];
var bonusPrizePoints=250;
var powerUps=['extraShot','extraShield','deathBlossom','shotSpeed','autoFireDelay'];
var powerUpsColors={
    'extraShot':'green',
    'extraShield':'blue',
    'deathBlossom':'red',
    'shotSpeed':'yellow',
    'autoFireDelay':'orange'
}

var stats={
    totalShots:0,
    totalHits:0,
    enemyEncounters:0,
    pickedBonuses:0
};

var btnShowScoreboard=document.getElementById("showScoreboard");

btnShowScoreboard.onclick=function(){
   scoreboard.showScoreBoard();
   pauseGame();
}

btnFire=document.getElementById("fire");
btnDeathBlossom=document.getElementById("death_blossom");
btnFire.disabled=true;
btnDeathBlossom.disabled=true;
btnNewGame=document.getElementById("newGame");

btnFire.onclick=fireNormal;

btnDeathBlossom.onclick=fireDeathBlossom;

alert(introMsg);

var yOffset=parseInt(document.getElementById("yOffset").value);
document.getElementById("yOffset").onchange = function(){
    yOffset=parseInt(document.getElementById("yOffset").value);
    document.getElementById("yOffsetLabel").innerHTML = String(document.getElementById("yOffset").value);
}

var yAxisEnabled=confirm("Enable Vertical Movement?\n\nUse the slider to the right to adjust the offset");
if(yAxisEnabled){
    document.getElementById("yOffsetContainer").style.display='block';
}

var autoFire=null;
document.getElementById("autofire").onclick=function(){
if(gamePaused){
    document.getElementById("autofire").checked=!document.getElementById("autofire").checked;
    return;
    }
   
  if(document.getElementById("autofire").checked){
        autoFire=setInterval(fireNormal,autoFireDelay);
    }
    else{
        clearInterval(autoFire);
        autoFire=null;
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

window.onkeyup = function(evt) {
    // keyboard event handler
    evt = evt || window.event;
    handleKeyboardUp(evt.keyCode);
}

window.onkeydown = function(evt) {
    // keyboard event handler
    evt = evt || window.event;
    handleKeyboardDown(evt.keyCode);
}

generateStars();
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
