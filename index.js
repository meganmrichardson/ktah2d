let playerHealth = 100;
let backgroundImage;
let time = 0;
let skyHeight = 0;

function drawHealthBar() {
  fill("grey");
  rect(640, 10, 150, 10);
  if (playerHealth > 0) {
    fill(playerHealth > 25 ? "green" : "red");
    rect(640, 10, 1.5 * playerHealth, 10);
  } else if (playerHealth <= 0) {
    fill("rgba(100, 100, 100, 0.5)");
    rect(0, 0, width, height);
    textFont("Avenir");
    textAlign(CENTER);
    textSize(40);
    textStyle(BOLD);
    fill(0);
    text("GAME OVER", width / 2, height / 2 - 20);
    text(`${Math.round(time)} seconds`, width / 2, height / 2 + 20);
    exit();
  }
}

function updateTimer() {
  fill("grey");
  time += 1 / 60;
  textSize(30);
  textAlign(RIGHT);
  text(Math.round(time), width - 10, 50);
}

function updateScarecrow() {
  fill("grey");
  rect(10, 10, 150, 10);
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
      scarecrowCooldown = time;
    }
  } else {
    fill("white");
    rect(
      10,
      10,
      time - scarecrowCooldown < 10 ? 15 * (time - scarecrowCooldown) : 150,
      10
    );
    if (time - scarecrowCooldown > 10) {
      fill("grey");
      textSize(15);
      textAlign(LEFT);
      text("Click to use bait!", 10, 40);
    }
  }
}

class healthbox {
  constructor(x, y, index) {
    Object.assign(this, { x, y, index });
  }
  update() {
    fill("white");
    ellipse(this.x, this.y, 20, 20);
    fill("red");
    rect(this.x - 8, this.y - 3, 16, 6);
    rect(this.x - 3, this.y - 8, 6, 16);
    let [dx, dy] = [this.x - player.x, this.y - player.y];
    const distance = Math.hypot(dx, dy);
    let overlap = 20 + player.radius - distance;
    if (this.y < skyHeight) {
      this.delete;
    } else if (overlap > 0) {
      playerHealth = playerHealth > 90 ? 100 : playerHealth + 10;
      this.delete();
    }
  }
  subtract() {
    this.index--;
  }
  delete() {
    healthboxes.splice(this.index, 1);
    healthboxes.forEach(box => {
      if (box.index > this.index) {
        box.subtract();
      }
    });
  }
}

class mainCharacter {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 1.8);
    triangle(
      this.x,
      this.y,
      this.x + 15,
      this.y - 10,
      this.x + 15,
      this.y + 10
    );
    fill("black");
    ellipse(this.x - 3, this.y - 3, this.radius / 3, this.radius / 3);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

class enemy {
  constructor(type, x, y, radius, speed) {
    Object.assign(this, { type, x, y, radius, speed });
  }
  draw() {
    if (this.type === "shark") {
      fill("rgb(160, 200, 255)");
      ellipse(this.x, this.y, this.radius * 2, this.radius);
      triangle(
        this.x - 8,
        this.y - 10,
        this.x + 5,
        this.y - 30,
        this.x + 7,
        this.y - 2
      );
      triangle(
        this.x + 40,
        this.y - 30,
        this.x + 10,
        this.y,
        this.x + 30,
        this.y
      );
      triangle(
        this.x + 40,
        this.y + 20,
        this.x + 10,
        this.y,
        this.x + 30,
        this.y
      );
      triangle(
        this.x - 8,
        this.y + 10,
        this.x + 5,
        this.y + 30,
        this.x + 7,
        this.y + 2
      );
      fill("black");
      rect(this.x - 30, this.y + 3, 15, 1);
      ellipse(this.x - 15, this.y - 3, this.radius / 8);
    } else if (this.type === "starfish") {
      fill("rgb(255, 130, 120)");
      star(this.x, this.y, this.radius, this.radius / 2, 5);
      function star(x, y, outerRadius, innerRadius, points) {
        let angle = TWO_PI / points;
        let halfAngle = angle / 2.0;
        beginShape();
        for (let angleIndex = 0; angleIndex < TWO_PI; angleIndex += angle) {
          let newX = x + cos(angleIndex) * innerRadius;
          let newY = y + sin(angleIndex) * innerRadius;
          vertex(newX, newY);
          newX = x + cos(angleIndex + halfAngle) * outerRadius;
          newY = y + sin(angleIndex + halfAngle) * outerRadius;
          vertex(newX, newY);
        }
        endShape(CLOSE);
      }
      fill("black");
      ellipse(this.x - 4, this.y - 1, this.radius / 5);
      ellipse(this.x + 2, this.y - 3, this.radius / 5);
    } else if (this.type === "jellyfish") {
      fill("rgb(220, 120, 255)");
      ellipse(this.x, this.y, this.radius * 2, this.radius);
      rect(this.x + 2, this.y, 2, this.radius * 1.6);
      rect(this.x - 3, this.y, 2, this.radius * 1.4);
      rect(this.x + 7, this.y, 2, this.radius * 1.4);
      rect(this.x + 12, this.y, 2, this.radius * 1.6);
      rect(this.x - 8, this.y, 2, this.radius * 1.6);
      rect(this.x - 13, this.y, 2, this.radius * 1.4);
      fill("black");
      ellipse(this.x - 4, this.y + 2, this.radius / 5);
      ellipse(this.x + 4, this.y + 2, this.radius / 5);
    } else if (this.type === "fish") {
      fill("red");
      ellipse(this.x, this.y, this.radius * 2, this.radius * 1.8);
      triangle(
        this.x,
        this.y,
        this.x + 15,
        this.y - 10,
        this.x + 15,
        this.y + 10
      );
      fill("black");
      ellipse(this.x - 3, this.y - 3, this.radius / 3, this.radius / 3);
    }
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

const player = new mainCharacter(100, 30, "orange", 10, 0.05);
let enemies = [];
let healthboxes = [];
let scarecrow;
let scarecrowCooldown = 0;

function addEnemy(
  type,
  amount = 1,
  coordinates = [
    Math.random() > 0.5 ? 0 : width,
    Math.random() * (height - skyHeight) - skyHeight
  ],
  size = Math.random() * 20 + 10,
  speed = Math.random() * 0.03 + 0.003
) {
  for (let i = 0; i < amount; i++) {
    enemies.push(
      new enemy(type, coordinates[0] + i, coordinates[1], size, speed)
    );
  }
}

function drawSky() {
  fill("rgb(160, 200, 255)");
  skyHeight = time * 1.5;
  rect(0, 0, width, skyHeight);
}

function setup() {
  createCanvas(800, 600);
  noStroke();
  spawnEnemies();
}

function draw() {
  background("rgb(40, 70, 150)");
  player.draw();
  player.move({ x: mouseX, y: mouseY });
  enemies.forEach(enemy => enemy.draw());
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  healthboxes.forEach(box => box.update());
  adjust();
  drawSky();
  drawHealthBar();
  updateTimer();
  updateScarecrow();
  if ((Math.round(60 * time) / 60) % 10 === 0) {
    spawnEnemies();
    if (Math.random() > 0.3) {
      healthboxes.push(
        new healthbox(
          Math.random() * width,
          Math.random() * (height - skyHeight) - skyHeight,
          healthboxes.length
        )
      );
    }
  }
}

function spawnEnemies() {
  addEnemy("fish", 1, undefined, 10);
  addEnemy("shark", 1, undefined, 30);
  addEnemy("starfish");
  addEnemy("jellyfish", 1, undefined, 15);
}

function adjust() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
  if (player.y <= skyHeight + player.radius) {
    player.y = skyHeight + player.radius;
    playerHealth -= 0.1;
  }
  for (enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
    if (enemies[enemyIndex].y <= skyHeight + enemies[enemyIndex].radius) {
      enemies[enemyIndex].y = skyHeight + enemies[enemyIndex].radius;
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
        fill("red");
        rect(100, 100, 100, 100);
      }
    }
  }
}

function mouseClicked() {
  if (!scarecrow & (time - scarecrowCooldown > 10)) {
    scarecrow = new mainCharacter(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}
