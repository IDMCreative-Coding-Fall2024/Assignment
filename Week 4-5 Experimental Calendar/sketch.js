const mVel = 1;
let particles = [];
let x = 0; 
let quadWidth = 45; 
let spacing = -10; 
let daysSinceChernobylDisaster;
const elements = {
    star: { count: 100, halfLife: 8 }, 
    circle: { count: 100, halfLife: 30.2 * 365.25 },  
    triangle: { count: 100, halfLife: 28.8 * 365.25 },
    square: { count: 100, halfLife: 24100 * 365.25 }   
};

let numCircles = elements.circle.count;
let numSquares = elements.square.count;
let numTriangles = elements.triangle.count;
let numStars = elements.star.count;

let lastClickedElement = null;
let shouldDrawRectangle = false;
let moveSpeed = 0.2;

function setup() {
    createCanvas(windowWidth, windowHeight);

    updateElementCounts(daysSinceChernobylDisaster);

    // baseColor = color(0, 0, 255);
    for (let i = 0; i < elements.circle.count; i++) {
        particles.push(new Particle('circle'));
    }
    for (let i = 0; i < elements.square.count; i++) {
        particles.push(new Particle('square'));
    }
    for (let i = 0; i < elements.triangle.count; i++) {
        particles.push(new Particle('triangle'));
    }
    for (let i = 0; i < elements.star.count; i++) {
        particles.push(new Particle('star'));
    }
}

function draw() {
    background(0);

    for (let particle of particles) {
        particle.update();
        particle.render();
    }

    if (x > quadWidth + spacing) {
        x = 0;
    }


    fill(237, 209, 71);
    rect(0, 0, width, 70);
    fill(237, 209, 71);
    rect(0, windowHeight - 70, width, 70);

    for (let i = x - (quadWidth + spacing); i < width + quadWidth; i += quadWidth + spacing) {
        drawQuad(i);
    }
    x += moveSpeed;

    if (shouldDrawRectangle) {
        drawBottomRectangle();
    } else {
        drawAggregateRectangle();
    }
}



class Particle {
    constructor(shape) {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-mVel, mVel), random(-mVel, mVel));
        this.col = color(237, 209, 71);
        this.shape = shape;
    }

    update() {
        this.pos.add(this.vel);
        this.bounce();
    }

    render() {
        fill(this.col);
        noStroke();
        switch (this.shape) {
            case 'circle':
                ellipse(this.pos.x, this.pos.y, 12);
                break;
            case 'square':
                rect(this.pos.x, this.pos.y, 12, 12);
                break;
            case 'triangle':
                triangle(this.pos.x, this.pos.y - 6, this.pos.x - 6, this.pos.y + 6, this.pos.x + 6, this.pos.y + 6);
                break;
            case 'star':
                this.drawStar(this.pos.x, this.pos.y, 5, 10, 5);
                break;
        }
    }

    drawStar(x, y, radius1, radius2, npoints) {
        let angle = TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        beginShape();
        for (let a = -PI / 10; a < TWO_PI; a += angle) { 
            let sx = x + cos(a) * radius2;
            let sy = y + sin(a) * radius2;
            vertex(sx, sy);
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }


    bounce() {
        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }
}

function drawQuad(baseX) {
    fill(0);
    quad(baseX, 0, baseX + 20, 0, baseX - 5, 30, baseX - 25, 30);
    quad(baseX, windowHeight - 30, baseX + 20, windowHeight - 30, baseX - 5, windowHeight, baseX - 25, windowHeight);

}

function clearParticles() {
    particles = [];
}

function generateCircles() {
    clearParticles();
    for (let i = 0; i < elements.circle.count; i++) {
        particles.push(new Particle('circle'));
    }

    let rectLength = width * (50 - elements.circle.count) / 50;

    fill(237, 209, 71); 
    rect(0, height - 50, rectLength, 50);
}

function generateSquares() {
    clearParticles();
    for (let i = 0; i < elements.square.count; i++) {
        particles.push(new Particle('square'));
    }
}

function generateTriangles() {
    clearParticles();
    for (let i = 0; i < elements.triangle.count; i++) {
        particles.push(new Particle('triangle'));
    }
}

function generateStars() {
    clearParticles();
    for (let i = 0; i < elements.star.count; i++) {
        particles.push(new Particle('star'));
    }
}

window.onload = function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.body.classList.add('modal-open');
}


window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    }
}

function getBar() {
    var shell = document.querySelector('.shell');

    shell.addEventListener('click', function (event) {
        this.classList.toggle('expanded');
        event.stopPropagation();  
    });

    document.addEventListener('click', function (event) {
        if (!shell.contains(event.target)) {
            shell.classList.remove('expanded');
        }
    });
}

function calculateDaysSinceChernobyl() {
    const chernobylDate = new Date('04/26/1986');

    const displayedDateText = document.getElementById('currentDate').textContent;
    const currentDate = new Date(displayedDateText);

    const diffInMilliseconds = currentDate - chernobylDate;
    return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
}

function getCurrentDateStr() {
    const currentDate = new Date();
    return `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
}

function updateElementCounts(daysElapsed) {
    for (let key in elements) {
        let element = elements[key];
        let decayFactor = Math.pow(0.5, daysElapsed / element.halfLife);
        element.count = Math.floor(element.count * decayFactor);
        console.log(element.count)
    }
}

function drawBottomRectangle() {
    if (!lastClickedElement) return; 

    let remainingCount = elements[lastClickedElement].count;


    let rectLength = width * (1 - remainingCount / 100);

    fill(237, 209, 71);

    rect(0, height - 50, rectLength, 50);
    rect(0, 0, rectLength, 50);
}


function drawAggregateRectangle() {
    let totalInitialCount = 0;
    for (let key in elements) {
        totalInitialCount += elements[key].count;
    }

    let totalCurrentCount = 0;
    for (let key in elements) {
        let element = elements[key];
        let decayFactor = Math.pow(0.5, daysSinceChernobylDisaster / element.halfLife);
        totalCurrentCount += Math.floor(element.count * decayFactor);
    }

    let rectLength = width * (totalInitialCount - totalCurrentCount) / totalInitialCount;

    fill(237, 209, 71); 
    rect(0, height - 50, rectLength, 50);
    rect(0, 0, rectLength, 50);
}