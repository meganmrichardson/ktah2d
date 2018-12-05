let playerHealth = 100;
let backgroundImage;
let time = 0;

function drawHealthBar() {
  fill("grey");
  rect(640, 10, 150, 10);
  if (playerHealth > 0) {
    fill(playerHealth > 25 ? "green" : "red");
    rect(640, 10, 1.5 * playerHealth, 10);
  }
  else if (playerHealth <= 0) {
    fill("rgba(100, 100, 100, 0.5)");
    rect(0, 0, width, height);
    textFont("Avenir");
    textAlign(CENTER);
    textSize(40);
    textStyle(BOLD);
    fill(0);
    text("GAME OVER", width/2 -20, height/2 - 20);
    text(`${Math.round(time)} seconds`, width/2 -20, height/2 + 20);
    player.speed = 0;
    enemy.speed = 0;
  }
}

class mainCharacter {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 1.8);
    triangle(this.x, this.y, this.x + 15, this.y - 10, this.x + 15, this.y +10);
    fill("black");
    ellipse(this.x - 3, this.y - 3, this.radius / 3, this.radius / 3);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

class enemyCharacter {
  constructor(x, y, radius, speed) {
    Object.assign(this, { x, y, radius, speed });
  }
  draw() {
    fill("rgb(160, 200, 255)");
    ellipse(this.x, this.y, this.radius * 2, this.radius);
    triangle(this.x - 8, this.y - 10, this.x + 5, this.y - 30, this.x + 7, this.y - 2);
    triangle(this.x + 40, this.y - 30, this.x + 10, this.y, this.x + 30, this.y);
    triangle(this.x + 40, this.y + 20, this.x + 10, this.y, this.x + 30, this.y);    
    triangle(this.x - 8, this.y + 10, this.x + 5, this.y + 30, this.x + 7, this.y + 2);
    fill("black");
    rect(this.x - 30, this.y + 3, 15, 1);
    ellipse(this. x - 15, this.y - 3, this.radius / 8)
    fill("white");
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

const player = new mainCharacter(100, 30, "orange", 10, 0.05);
const enemies = [];
let scarecrow;

function addShark(
  amount = 1,
  coordinates = [Math.random() * width, Math.random() * height],
  size = Math.random() * 20 + 10,
  speed = Math.random() * 0.03 + 0.003
) {
  for (let i = 0; i < amount; i++) {
    enemies.push(
      new enemyCharacter(coordinates[0] + i, coordinates[1], size, speed)
    );
  }
}

function setup() {
  createCanvas(800, 600);
  noStroke();
  // addEnemy();
  // addEnemy(3);
  // addEnemy(4);
  addShark(3, [300, 300], 30, 0.01);
}

function draw() {
  background("rgb(40, 70, 150)");
  player.draw();
  player.move({ x: mouseX, y: mouseY });
  enemies.forEach(enemy => enemy.draw());
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--; 
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
  adjust();
  drawHealthBar();
  time += 1/60;
  textSize(30);
  text(Math.round(time), width-40, 50);
}

function adjust() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0) {
    const adjustX = overlap / 2 * (dx / distance);
    const adjustY = overlap / 2 * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
    if (c1 === player) {
      playerHealth -= 0.1;
      if (playerHealth == 0) {
        fill('red');
        rect(100,100,100,100);
      }
    }
  }
}

function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new mainCharacter(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}
