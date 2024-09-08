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

    drawWithAnim(wave3, 5, 157, 35);

    ctx.drawImage(bratBoat, (t / 75) % (canvas.width + 100), 100, 72, 72);
}

requestAnimationFrame(draw);

const ocean = new Audio('/assets/ocean.mp3');
document.body.addEventListener('click', () => {
    ocean.play();
});
ocean.addEventListener(
    'ended',
    function () {
        this.currentTime = 0;
        this.play();
    },
    false,
);
