const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;

const cloud1 = new Image();
cloud1.src = '/assets/cloud1.webp';
const cloud2 = new Image();
cloud2.src = '/assets/cloud2.webp';
const cloud3 = new Image();
cloud3.src = '/assets/cloud3.webp';
const wave1 = new Image();
wave1.src = '/assets/wave1.webp';
const wave2 = new Image();
wave2.src = '/assets/wave2.webp';
const wave3 = new Image();
wave3.src = '/assets/wave3.webp';

const bratBoat = new Image();
bratBoat.src = '/assets/bratboatfloat.webp';

const raft = new Image();
raft.src = '/assets/raft.webp';

let enableBoat = false;

let boats = [];

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function addBoat() {
    const size = randomIntFromInterval(40, 72);
    boats.push({
        x: -1 * size,
        y: randomIntFromInterval(90, 120),
        size: size,
        speed: randomIntFromInterval(1, 5),
    });

    boats.sort((a, b) => a.y + a.size - (b.y + b.size));
}

function sizeCanvas() {
    let WX, WY;
    if (window.innerWidth) {
        WX = window.innerWidth;
        WY = window.innerHeight;
    } else {
        WX = document.body.clientWidth;
        WY = document.body.clientHeight;
    }

    // canvas.height = WY;
    // canvas.width = WX;
    canvas.height = 216;
    canvas.width = (WX * 216) / WY;
}

sizeCanvas();
window.addEventListener('resize', sizeCanvas);

let lastT = 0;
function draw(t) {
    requestAnimationFrame(draw);

    const anim = (factor) => {
        return ((t / 150) * factor) % (2 * 480);
    };

    const drawWithAnim = (img, speed, y, h) => {
        for (let i = 1; true; i += 1) {
            const xPos = canvas.width - 479 * i + anim(speed);

            if (i % 2 === 1) {
                ctx.drawImage(img, xPos, y, 480, h);
            } else {
                ctx.translate(xPos + 480, y);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }

            if (xPos < 0) {
                break;
            }
        }
    };

    // const hUnit = canvas.height / 216;
    const hUnit = 1;

    ctx.fillStyle = '#8fb8ea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWithAnim(cloud1, 1, 43, 173);
    drawWithAnim(cloud2, 2, 77, 139);
    drawWithAnim(cloud3, 5, 105, 111);

    drawWithAnim(wave1, 1, 125, 91);

    ctx.fillStyle = '#6ba2e5';
    ctx.fillRect(0, 140, canvas.width, 76);

    drawWithAnim(wave2, 2, 132, 37);

    ctx.fillStyle = '#5e7eb6';
    ctx.fillRect(0, 171, canvas.width, 51);

    if (!enableBoat) {
        ctx.drawImage(raft, Math.floor(canvas.width / 2) - 31, 128, 62, 46);
    }

    boats.forEach((boat, index, a) => {
        ctx.drawImage(bratBoat, boat.x, boat.y, boat.size, boat.size);

        boat.x += (t - lastT) * 0.01 * boat.speed;

        if (boat.x > canvas.width + 2 * boat.size) {
            a.splice(index, 1);
            addBoat();
        }
    });

    if (
        enableBoat &&
        boats.length < 3 &&
        boats.every((boat) => boat.x > canvas.width / 3) &&
        Math.random() > 0.9
    ) {
        addBoat();
    }

    drawWithAnim(wave3, 5, 157, 35);

    lastT = t;
}

requestAnimationFrame(draw);

const ocean = new Audio('/assets/ocean.mp3');
ocean.addEventListener(
    'ended',
    function () {
        this.currentTime = 0;
        this.play();
    },
    false,
);
const bratAudio = new Audio();
let alreadyPlayed = [];
function pickBrat() {
    if (alreadyPlayed.length === 15) {
        alreadyPlayed = [];
    }

    let num = randomIntFromInterval(1, 15);
    while (alreadyPlayed.includes(num)) {
        num = randomIntFromInterval(1, 15);
    }

    const url = `/songs/${num}.mp3`;
    bratAudio.src = url;
}
pickBrat();

bratAudio.addEventListener(
    'ended',
    function () {
        pickBrat();
        this.currentTime = 0;
        this.play();
    },
    false,
);

document.querySelector('#start').addEventListener('click', () => {
    enableBoat = true;
    document.querySelector('#notice').style.display = 'none';
    document.querySelector('#raft-notes').style.display = 'none';

    addBoat();

    ocean.play();
    bratAudio.play();
});
