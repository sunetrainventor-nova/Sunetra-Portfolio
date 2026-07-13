// ================= GAME DATA =================
let score = 0;
let level = 1;
let levelProgress = 0;
let levelTarget = 500;
let boss = null;
let bossActive = false;   // points needed for next level
let coins = 0;
let muzzleFlash = 0;
let screenShake = 0;
let gamePaused = false;

// ================= SOUNDS =================

// ================= SOUNDS =================

const bgMusic = new Audio("sounds/background.mp3");
const bossDeathSound = new Audio("sounds/boss-defeat.mp3");
const coinSound = new Audio("sounds/coin.mp3");
const gameOverSound = new Audio("sounds/game-over.mp3");
const gunSound = new Audio("sounds/gun.mp3");
const jumpSound = new Audio("sounds/jump.mp3");
const levelUpSound = new Audio("sounds/level-up.mp3");
const startSound = new Audio("sounds/start.mp3");
const swordSound = new Audio("sounds/sword.mp3");
const winSound = new Audio("sounds/win.mp3");
const explosionSound = new Audio("sounds/boss-defeat.mp3");

let gameState = "menu";
let menuButton = {
    x: 0,
    y: 0,
    width: 240,
    height: 70
};


let enemySpeedMultiplier = 1;
let gameSpeedMultiplier = 1;

let health = 100;
let maxHealth = 100;

let cameraX = 0;
let groundY = 0;

let worldLength = 999999999;

// ================= PLAYER =================
let player = {

    x: 150,
    y: 0,

    width: 40,
    height: 40,

    vx: 0,
    vy: 0,

    speed: 6,

    jumpPower: 18,

    gravity: 0.8,

    jumping: false,

    direction: 1,

    attacking: false,

    attackTimer: 0

};

// ================= ARRAYS =================
let enemies = [];

let coinsList = [];

let bullets = [];

let trees = [];

let mountains = [];

let clouds = [];

// ================= CANVAS =================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

groundY = canvas.height - 120;

player.y = groundY - player.height;

// ================= CONTROLS =================
let left = false;
let right = false;
let jump = false;
let attack = false;
let shoot = false;

// ================= KEYBOARD =================
window.addEventListener("keydown", (e)=>{

    if(e.key==="Escape"){

    if(gameState==="playing"){

        gamePaused = !gamePaused;

        if(gamePaused){

            bgMusic.pause();

        }else{

            bgMusic.play().catch(()=>{});

        }

    }

}

    if(e.key==="ArrowLeft"){
        left=true;
        player.direction=-1;
    }

    if(e.key==="ArrowRight"){
        right=true;
        player.direction=1;
    }

    if(e.key==="ArrowUp"){
        jump=true;
    }

    if(e.key==="z"){
        attack=true;
    }

    if(e.key==="x"){
        shoot=true;
    }
});

canvas.addEventListener("click", function(e){

    if(gameState !== "menu") return;

    const rect = canvas.getBoundingClientRect();

    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    if(
        mx > menuButton.x &&
        mx < menuButton.x + menuButton.width &&
        my > menuButton.y &&
        my < menuButton.y + menuButton.height
    ){
        gameState = "playing";

        bgMusic.currentTime = 0;
bgMusic.play().catch(()=>{});
    }

});

window.addEventListener("keyup",(e)=>{

    if(e.key==="ArrowLeft"){
        left=false;
    }

    if(e.key==="ArrowRight"){
        right=false;
    }

    if(e.key==="ArrowUp"){
        jump=false;
    }

    if(e.key==="z"){
        attack=false;
    }

    if(e.key==="x"){
        shoot=false;
    }

});
// ================= WORLD GENERATION =================

// Mountains
for (let i = 0; i < 80; i++) {

    mountains.push({
        x: i * 500,
        width: 300 + Math.random() * 120,
        height: 120 + Math.random() * 180
    });

}

// Trees
for (let i = 0; i < 250; i++) {

    trees.push({
        x: 150 + i * 180 + Math.random() * 100,
        height: 60 + Math.random() * 60
    });

}

// Clouds
for (let i = 0; i < 120; i++) {

    clouds.push({
        x: i * 350,
        y: 40 + Math.random() * 180,
        size: 30 + Math.random() * 35
    });

}

// ================= BACKGROUND =================

function drawBackground() {

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    clouds.forEach(c => {

        let x = c.x - cameraX * 0.25;

        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.arc(x, c.y, c.size, 0, Math.PI * 2);
        ctx.arc(x + c.size, c.y + 5, c.size - 5, 0, Math.PI * 2);
        ctx.arc(x - c.size, c.y + 5, c.size - 5, 0, Math.PI * 2);
        ctx.fill();

    });

    // Mountains
    mountains.forEach(m => {

        let x = m.x - cameraX * 0.45;

        ctx.fillStyle = "#708090";

        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + m.width / 2, groundY - m.height);
        ctx.lineTo(x + m.width, groundY);
        ctx.closePath();
        ctx.fill();

    });

    // Trees
    trees.forEach(t => {

        let x = t.x - cameraX;

        // Trunk
        ctx.fillStyle = "#7B4A12";
        ctx.fillRect(
            x,
            groundY - t.height,
            14,
            t.height
        );

        // Leaves
        ctx.fillStyle = "#228B22";

        ctx.beginPath();
        ctx.arc(
            x + 7,
            groundY - t.height,
            28,
            0,
            Math.PI * 2
        );
        ctx.fill();

    });

    // Ground
    ctx.fillStyle = "#3CB371";
    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );

}
function drawPlayer() {

    let x = player.x - cameraX;
    let y = player.y;

    // Body
    ctx.fillStyle = "#1E90FF";
    ctx.beginPath();
    ctx.arc(
        x + player.width / 2,
        y + player.height / 2,
        player.width / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Eyes
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x + 14, y + 16, 4, 0, Math.PI * 2);
    ctx.arc(x + 26, y + 16, 4, 0, Math.PI * 2);
    ctx.fill();

    // Eye pupils
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(x + 14, y + 16, 2, 0, Math.PI * 2);
    ctx.arc(x + 26, y + 16, 2, 0, Math.PI * 2);
    ctx.fill();

    // Face Expression
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();

    if (health > 60) {

        // Happy
        ctx.arc(
            x + 20,
            y + 24,
            8,
            0,
            Math.PI
        );

    } else if (health > 25) {

        // Straight
        ctx.moveTo(x + 12, y + 30);
        ctx.lineTo(x + 28, y + 30);

    } else {

        // Sad
        ctx.arc(
            x + 20,
            y + 36,
            8,
            Math.PI,
            Math.PI * 2
        );

    }

    ctx.stroke();

    if(muzzleFlash > 0){

    ctx.fillStyle = "yellow";

    ctx.beginPath();

    ctx.arc(
        player.direction === 1
            ? x + player.width + 10
            : x - 10,
        y + player.height / 2,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();

    muzzleFlash--;

}

}

// ================= HEALTH BAR =================

function drawHealthBar() {

    let x = player.x - cameraX;
    let y = player.y - 18;

    // Background
    ctx.fillStyle = "#444";
    ctx.fillRect(
        x,
        y,
        player.width,
        6
    );

    // Health
    ctx.fillStyle = "lime";

    if (health < 50) {

        ctx.fillStyle = "orange";

    }

    if (health < 25) {

        ctx.fillStyle = "red";

    }

    ctx.fillRect(
        x,
        y,
        (health / maxHealth) * player.width,
        6
    );

}
function spawnEnemy(x){

    enemies.push({

        x: x,
        y: groundY - 40,

        width: 40,
        height: 40,

        speed: (2 + Math.random()) * enemySpeedMultiplier,

        health: 100,

        direction: -1,

        alive: true

    });

}

function spawnBoss(){

    boss = {
        x: player.x + 800,
        y: groundY - 80,

        width: 120,
        height: 120,

        health: 500,
        maxHealth: 500,

        speed: 1.5,
        alive: true,
        hitFlash: 0
    };

    bossActive = true;
}

// First enemies
for(let i=1;i<=8;i++){

    spawnEnemy(600 * i);

}

// ================= DRAW ENEMIES =================

function drawEnemies(){

    enemies.forEach(enemy => {

        if(!enemy.alive) return;

        ctx.fillStyle = enemy.hitFlash > 0 ? "white" : "crimson";

        if(enemy.hitFlash > 0){
            enemy.hitFlash--;
        }

        let x = enemy.x - cameraX;
        let y = enemy.y;
        
        // Enemy Health Bar
ctx.fillStyle = "#271a1a";
ctx.fillRect(
    x,
    y - 12,
    enemy.width,
    5
);

ctx.fillStyle = "lime";
ctx.fillRect(
    x,
    y - 12,
    (enemy.health / 100) * enemy.width,
    5
);

       

        ctx.beginPath();
        ctx.arc(
            x + enemy.width/2,
            y + enemy.height/2,
            enemy.width/2,
            0,
            Math.PI*2
        );
        ctx.fill();

        // Eyes
        ctx.fillStyle="white";

        ctx.beginPath();
        ctx.arc(x+13,y+15,4,0,Math.PI*2);
        ctx.arc(x+27,y+15,4,0,Math.PI*2);
        ctx.fill();

        // Pupils
        ctx.fillStyle="black";

        ctx.beginPath();
        ctx.arc(x+13,y+15,2,0,Math.PI*2);
        ctx.arc(x+27,y+15,2,0,Math.PI*2);
        ctx.fill();

        // Angry Eyebrows
        ctx.strokeStyle="black";
        ctx.lineWidth=2;

        ctx.beginPath();

        ctx.moveTo(x+8,y+9);
        ctx.lineTo(x+16,y+12);

        ctx.moveTo(x+24,y+12);
        ctx.lineTo(x+32,y+9);

        ctx.stroke();

        // Angry Mouth
        ctx.beginPath();

        ctx.moveTo(x+12,y+30);
        ctx.lineTo(x+28,y+26);

        ctx.stroke();

    });

}
function updateEnemies(){
    enemies.forEach(enemy => {

        if(!enemy.alive) return;

        let dx = player.x - enemy.x;

        let detectRange = 500;

        if(Math.abs(dx) < detectRange){

            if(dx > 0){
                enemy.x += enemy.speed;
                enemy.direction = 1;
            } else {
                enemy.x -= enemy.speed;
                enemy.direction = -1;
            }

        } else {
            enemy.x += Math.sin(Date.now() * 0.002 + enemy.x) * 0.5;
        }

        if(
            player.x + player.width > enemy.x &&
            player.x < enemy.x + enemy.width &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + enemy.height
        ){
            health -= 0.4;
            addScreenShake(3);
        }

    });

    let lastEnemy = enemies[enemies.length - 1];

    if(lastEnemy && player.x > lastEnemy.x - 900){
        spawnEnemy(
            lastEnemy.x + 500 + Math.random() * 400
        );
    }
}

function updateBoss(){

    if(!boss || !bossActive) return;

    let dx = player.x - boss.x;

    if(boss.health <= 0){

    bossActive = false;
    boss = null;

    score += 500;
    coins += 50;

    level++;

bgMusic.pause();

bossDeathSound.currentTime = 0;
bossDeathSound.play().catch(()=>{});

setTimeout(() => {

    winSound.currentTime = 0;
    winSound.play().catch(()=>{});

}, 700);

gameState = "win";
return;
}

    if(Math.abs(dx) < 800){

        if(dx > 0){
            boss.x += boss.speed;
        } else {
            boss.x -= boss.speed;
        }

    }

    // collision damage
    if(
        player.x + player.width > boss.x &&
        player.x < boss.x + boss.width &&
        player.y + player.height > boss.y &&
        player.y < boss.y + boss.height
    ){
        health -= 0.8;
        addScreenShake(5);
    }

}

function drawBoss(){

    if(!boss || !bossActive) return;

    let x = boss.x - cameraX;
    let y = boss.y;

    // body
    ctx.fillStyle = "purple";
    ctx.fillRect(x, y, boss.width, boss.height);

   // Boss Health Bar (Top Screen)

ctx.fillStyle = "#333";
ctx.fillRect(
    canvas.width / 2 - 200,
    20,
    400,
    20
);

ctx.fillStyle = "red";
ctx.fillRect(
    canvas.width / 2 - 200,
    20,
    (boss.health / boss.maxHealth) * 400,
    20
);

ctx.strokeStyle = "white";
ctx.lineWidth = 2;
ctx.strokeRect(
    canvas.width / 2 - 200,
    20,
    400,
    20
);

ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText(
    "BOSS",
    canvas.width / 2 - 25,
    15
);
}
// =====================================================

function spawnCoin(x){

    coinsList.push({

        x: x,

        y: groundY - 70 - Math.random() * 120,

        radius: 10,

        collected: false,

        rotate: 0

    });

}

// First Coins

for(let i=1;i<=40;i++){

    spawnCoin(250 * i);

}

// ================= DRAW COINS =================

function drawCoins(){

    coinsList.forEach(c=>{

        if(c.collected) return;

        c.rotate += 0.1;

        let x = c.x - cameraX;

        ctx.save();

        ctx.translate(x,c.y);

        ctx.rotate(c.rotate);

        ctx.fillStyle="gold";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            c.radius,
            c.radius-2,
            0,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.strokeStyle="#B8860B";

        ctx.stroke();

        ctx.restore();

    });

}

// ================= UPDATE COINS =================

function updateCoins(){

    coinsList.forEach(c=>{

        if(c.collected) return;

        if(

            player.x + player.width > c.x - c.radius &&
            player.x < c.x + c.radius &&
            player.y + player.height > c.y - c.radius &&
            player.y < c.y + c.radius

        ){

            c.collected = true;

            coins++;
            coinSound.currentTime = 0;
coinSound.play().catch(()=>{});

            score += 10;

        }

    });

    // Endless Coins

    let lastCoin = coinsList[coinsList.length-1];

    if(lastCoin){

        if(player.x > lastCoin.x - 1200){

            for(let i=1;i<=10;i++){

                spawnCoin(

                    lastCoin.x +
                    i*220 +
                    Math.random()*120

                );

            }

        }

    }

}

function updateLevelSystem(){

    // increase progress
    levelProgress = score;

    // level up check
    if(levelProgress >= levelTarget){

        level++;

        levelProgress = 0;
        levelTarget += 300; // next level harder
       if(level % 3 === 0 && !bossActive){
    spawnBoss();
}

        // 🔥 difficulty scaling
        enemySpeedMultiplier += 0.12;
        gameSpeedMultiplier += 0.05;

        // boost player slightly (reward)
        player.speed += 0.3;

        // small heal reward
        health = Math.min(maxHealth, health + 20);

        console.log("LEVEL UP! Now Level:", level);
        player.speed += 0.2;        // movement boost
ATTACK_DAMAGE += 3;         // stronger hits
    }
}

function updatePlayer(){

    // Left
    if(left){

        player.x -= player.speed;

    }

    // Right
    if(right){

        player.x += player.speed;

    }

    // Jump

    if(jump && !player.jumping){

        player.vy = -player.jumpPower;

        player.jumping = true;

    }

    // Gravity

    player.vy += player.gravity;

    player.y += player.vy;

    // Ground Collision

    if(player.y >= groundY - player.height){

        player.y = groundY - player.height;

        player.vy = 0;

        player.jumping = false;

    }

    // Camera Follow
    if(cameraX < 0){

        cameraX = 0;

    }
    cameraX += (player.x - cameraX - 180) * 0.08;

    // Health Limit

    if(health > maxHealth){

        health = maxHealth;

    }

    if(health < 0){

        health = 0;

    }

}

let walkAnimation = 0;

function updatePlayerAnimation(){

    if(left || right){

        walkAnimation += 0.25;

    }

}

// ================= PLAYER HANDS & LEGS =================

function drawPlayerLimbs(){

    let x = player.x - cameraX;
    let y = player.y;

    let swing = Math.sin(walkAnimation) * 6;

    ctx.strokeStyle = "#202020";
    ctx.lineWidth = 3;

    // Left Hand
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 20);
    ctx.lineTo(x + 2, y + 30 + swing);
    ctx.stroke();

    // Right Hand
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 20);
    ctx.lineTo(x + 38, y + 30 - swing);
    ctx.stroke();

    // Left Leg
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 38);
    ctx.lineTo(x + 10, y + 50 - swing);
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.moveTo(x + 26, y + 38);
    ctx.lineTo(x + 30, y + 50 + swing);
    ctx.stroke();

}
const ATTACK_RANGE = 85;
let ATTACK_DAMAGE = 30;

function updateAttack(){

    if(attack && player.attackTimer <= 0){

        player.attacking = true;
        swordSound.currentTime = 0;
swordSound.play().catch(()=>{});
        player.attackTimer = 18;

        enemies.forEach(enemy=>{

            if(!enemy.alive) return;

            let dx = enemy.x - player.x;

            if(
                Math.abs(dx) <= ATTACK_RANGE &&
                Math.abs(enemy.y - player.y) < 50
            ){

                // Check facing direction
                if(
                    (player.direction === 1 && dx > 0) ||
                    (player.direction === -1 && dx < 0)
                ){

                   let direction = player.direction;
                   if(enemy.hitFlash > 0) return;
dealDamage(enemy, ATTACK_DAMAGE, direction);

                    if(enemy.health <= 0){

                        enemy.alive = false;

                        createExplosion(
    enemy.x + enemy.width / 2,
    enemy.y + enemy.height / 2
);

if(bossActive && boss){

    if(
        player.x + player.width > boss.x &&
        player.x < boss.x + boss.width &&
        player.y + player.height > boss.y &&
        player.y < boss.y + boss.height
    ){
        boss.health -= ATTACK_DAMAGE;
    }

}

if(Math.random() < 0.4){

    spawnHealthPack(enemy.x);

}

                        
                    }

                }

            }

        });

    }

    if(player.attackTimer > 0){

        player.attackTimer--;

    }else{

        player.attacking = false;

    }

}

// ================= ATTACK ANIMATION =================

function drawAttackEffect(){

    if(!player.attacking) return;

    let px = player.x - cameraX;
    let py = player.y + 20;

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;

    ctx.beginPath();

    if(player.direction === 1){

        ctx.arc(
            px + 40,
            py,
            22,
            -0.8,
            0.8
        );

    }else{

        ctx.arc(
            px,
            py,
            22,
            2.3,
            3.9
        );

    }

    ctx.stroke();

}
let shootCooldown = 0;

function shootBullet(){

    if(shootCooldown > 0) return;

    bullets.push({

        x: player.direction === 1 ? player.x + player.width : player.x,

        y: player.y + player.height / 2,

        vx: player.direction * 10,

        radius: 5,

        alive: true

    });

    shootCooldown = 20;
    gunSound.currentTime = 0;
gunSound.play().catch(()=>{});
    muzzleFlash = 4;

}

function updateBullets(){

    if(shootCooldown > 0){

        shootCooldown--;

    }

    if(shoot){

        shootBullet();

    }

    

    bullets.forEach(bullet=>{

        if(!bullet.alive) return;

        bullet.x += bullet.vx;

        if(bossActive && boss){

    if(
        bullet.x > boss.x &&
        bullet.x < boss.x + boss.width &&
        bullet.y > boss.y &&
        bullet.y < boss.y + boss.height
    ){
        boss.health -= 40;
        bullet.alive = false;
    }

}

        enemies.forEach(enemy=>{

            if(!enemy.alive) return;

            if(

                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemy.height

            ){

                bullet.alive = false;

                let direction = player.direction;
dealDamage(enemy, 40, direction);

                if(enemy.health <= 0){

                    enemy.alive = false;

                    
                }

            }

        });
         

    });
    

}

// ================= DRAW BULLETS =================

function drawBullets(){

    bullets.forEach(bullet=>{

        if(!bullet.alive) return;

        ctx.fillStyle = "orange";

        ctx.beginPath();

        ctx.arc(

            bullet.x - cameraX,
            bullet.y,
            bullet.radius,
            0,
            Math.PI * 2

        );

        ctx.fill();

    });

}

let effects = [];

// ================= CREATE EXPLOSION =================

function createExplosion(x,y){

    effects.push({

        x:x,
        y:y,

        radius:5,

        alpha:1,

        grow:2,

        alive:true

    });

}

// ================= HEALTH PICKUP =================

function spawnHealthPack(x){

    effects.push({

        type:"health",

        x:x,

        y:groundY-30,

        size:20,

        alive:true

    });

}

// ================= UPDATE EFFECTS =================

function updateEffects(){

    effects.forEach(effect=>{

        if(effect.type==="health"){

            if(

                player.x+player.width>effect.x &&
                player.x<effect.x+effect.size &&
                player.y+player.height>effect.y &&
                player.y<effect.y+effect.size

            ){

                health+=25;

                if(health>maxHealth){

                    health=maxHealth;

                }

                effect.alive=false;

            }

            return;

        }

        if(!effect.alive) return;

        effect.radius+=effect.grow;

        effect.alpha-=0.04;

        if(effect.alpha<=0){

            effect.alive=false;

        }

    });

}

// ================= DRAW EFFECTS =================

function drawEffects(){

    effects.forEach(effect=>{

        if(!effect.alive) return;

        if(effect.type==="health"){

            ctx.fillStyle="lime";

            ctx.fillRect(
                effect.x-cameraX,
                effect.y,
                effect.size,
                effect.size
            );

            ctx.fillStyle="white";

            ctx.fillRect(
                effect.x-cameraX+7,
                effect.y+3,
                6,
                14
            );

            ctx.fillRect(
                effect.x-cameraX+3,
                effect.y+7,
                14,
                6
            );

            return;

        }

        ctx.globalAlpha=effect.alpha;

        ctx.strokeStyle="orange";

        ctx.lineWidth=4;

        ctx.beginPath();

        ctx.arc(

            effect.x-cameraX,

            effect.y,

            effect.radius,

            0,

            Math.PI*2

        );

        ctx.stroke();

        ctx.globalAlpha=1;

    });

}
function cleanEnemies(){

    enemies = enemies.filter(enemy => enemy.alive);

}

// ================= BULLET CLEANUP =================

function cleanBullets(){

    bullets = bullets.filter(bullet => bullet.alive);

}

// ================= EFFECT CLEANUP =================

function cleanEffects(){

    effects = effects.filter(effect => effect.alive);

}

// ================= WORLD CLEANUP =================

function cleanWorld(){

    cleanEnemies();

    cleanBullets();

    cleanEffects();

}
function drawGame(){

    if(screenShake > 0){

    ctx.save();

    ctx.translate(
        (Math.random()-0.5)*screenShake,
        (Math.random()-0.5)*screenShake
    );

    screenShake *= 0.8;

    if(screenShake < 0.5){
        screenShake = 0;
    }
}

// drawing...

if(screenShake > 0){
    ctx.restore();
}


    // Background
    drawBackground();

    // Coins
    drawCoins();

    // Enemies
    drawEnemies();

    // Bullets
    drawBullets();

    // Effects
    drawEffects();

    // Player
    drawPlayer();

    // Health Bar
    drawHealthBar();

    // Attack Effect
    drawAttackEffect();

    // HUD
    drawHUD();

    // Mini Map
    drawMiniMap();

    drawBoss();

}
function gameLoop(){

    updateGame();
    drawGame();

    requestAnimationFrame(gameLoop);

}

// ================= RESTART GAME =================

function restartGame(){

    gameState = "playing";
    bgMusic.currentTime = 0;
bgMusic.play().catch(()=>{});

    walkAnimation = 0;

    score = 0;
    coins = 0;
    health = maxHealth;

    cameraX = 0;

    player.x = 150;
    player.y = groundY - player.height;
    player.vx = 0;
    player.vy = 0;

    enemies = [];
    coinsList = [];
    bullets = [];
    effects = [];

    // Re-generate world
    for (let i = 1; i <= 8; i++) {
        spawnEnemy(600 * i);
    }

    for (let i = 1; i <= 40; i++) {
        spawnCoin(250 * i);
    }

}

// ================= GAME OVER CHECK (SAFE HOOK) =================

function checkGameState(){

    if(gameState === "gameover") return;

   if(health <= 0){

    bgMusic.pause();

    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(()=>{});

    gameState = "gameover";
}

}

// ================= MAIN START =================

// Start the game loop
gameLoop();
function isGameActive(){

    return gameState === "playing";

}

// ================= SAFE UPDATE WRAPPER =================

function updateGame(){

    if(gameState==="menu") return;

    if(gamePaused){
    return;
}

    if(!isGameActive()) return;

    // Player
    updatePlayer();
    updatePlayerAnimation();

    // Combat
    updateAttack();
    updateBullets();

    // World
    updateEnemies();
    updateCoins();
    updateEffects();
    updateLevelSystem();
    updateBoss();

    // Cleanup
    cleanWorld();

    // State check
    checkGameState();

// Death check
if(health <= 0){
    gameState = "gameover";
}

}

// ================= GAME OVER DRAW HOOK =================

function drawHUD(){

    if(gameState==="menu"){

    ctx.fillStyle="#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="white";
    ctx.font="70px Arial";
    ctx.fillText("ENDLESS ADVENTURE",canvas.width/2-330,170);

    menuButton.width=240;
    menuButton.height=70;
    menuButton.x=canvas.width/2-120;
    menuButton.y=300;

    ctx.fillStyle="#1abc9c";
    ctx.fillRect(
        menuButton.x,
        menuButton.y,
        menuButton.width,
        menuButton.height
    );

    ctx.fillStyle="white";
    ctx.font="35px Arial";
    ctx.fillText(
        "PLAY",
        menuButton.x+70,
        menuButton.y+45
    );

    return;
}

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";

    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Coins: " + coins, 20, 60);

    ctx.fillText("Level: " + level, 20, 90);
ctx.fillText("Progress: " + levelProgress + "/" + levelTarget, 20, 120);

    if(gameState === "gameover"){

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "60px Arial";
        ctx.fillText("GAME OVER", canvas.width/2 - 180, canvas.height/2);

        ctx.font = "25px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Press R to Restart", canvas.width/2 - 120, canvas.height/2 + 50);

    }

    if(gameState === "win"){

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "gold";
    ctx.font = "60px Arial";
    ctx.fillText("YOU WIN!", canvas.width/2 - 140, canvas.height/2);

    ctx.font = "28px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(
        "Congratulations!",
        canvas.width/2 - 110,
        canvas.height/2 + 50
    );

}

if(gamePaused){

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(
        "PAUSED",
        canvas.width / 2 - 100,
        canvas.height / 2
    );

    ctx.font = "22px Arial";
    ctx.fillText(
        "Press ESC to Resume",
        canvas.width / 2 - 110,
        canvas.height / 2 + 40
    );

}

}

// ================= RESTART KEY =================

window.addEventListener("keydown", (e)=>{

    if(e.key === "r" || e.key === "R"){

        if(gameState === "gameover"){
            restartGame();
        }

    }

});
function drawMiniMap(){

    const mapWidth = 200;
    const mapHeight = 100;

    const mapX = canvas.width - mapWidth - 20;
    const mapY = 20;

    // Background
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(mapX, mapY, mapWidth, mapHeight);

    // Player dot
    let px = mapX + (player.x / worldLength) * mapWidth;

    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(px, mapY + 50, 4, 0, Math.PI * 2);
    ctx.fill();

    // Enemy dots
    enemies.forEach(e => {

        if(!e.alive) return;

        let ex = mapX + (e.x / worldLength) * mapWidth;

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ex, mapY + 50, 3, 0, Math.PI * 2);
        ctx.fill();

    });

    // Coins dots
    coinsList.forEach(c => {

        if(c.collected) return;

        let cx = mapX + (c.x / worldLength) * mapWidth;

        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(cx, mapY + 70, 2, 0, Math.PI * 2);
        ctx.fill();

    });

}

// ================= WORLD FEEDBACK BOOST =================

function addScreenShake(intensity){

    screenShake = intensity;

}
function dealDamage(enemy, damage, direction){
    enemy.hitFlash = 8;
enemy.speed *= 0.9;

    health += 0; // (optional placeholder)

    enemy.health -= damage;

    // ================= KNOCKBACK =================
    enemy.x += direction * 30;

    // ================= HIT FLASH EFFECT =================
    enemy.hitFlash = 10;

    // ================= DEATH CHECK =================
    if(enemy.health <= 0 && enemy.alive){

        enemy.alive = false;
        explosionSound.currentTime = 0;
explosionSound.play().catch(()=>{});
enemy.speed = 0;
enemy.hitFlash = 0;

        createExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2
        );

        if(Math.random() < 0.25){
            spawnHealthPack(enemy.x);
        }

        score += 100;
        coins += 5;
        addScreenShake(5);
        createExplosion(
    enemy.x + enemy.width / 2,
    enemy.y + enemy.height / 2
);

addScreenShake(6);

    }

}