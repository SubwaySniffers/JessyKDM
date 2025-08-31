
// ===== DOM ELEMENTS =====
const canvas = document.getElementById('canvas');
const searchText = document.getElementsByClassName('searchText')[0];
const searchInput = document.getElementById('searchInput');
const ctx = canvas.getContext('2d');

// ===== GLOBAL VARIABLES =====
// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let hovering = false;
let animationId;

// Sprite animation
let framey = new Image();
let ccc = 0;
let xPosition = 10;
let yPosition = 0; // Will be set in draw function
let xVelocity = 1;
let yVelocity = 0;
let onFloor = true;
let turnTick = Math.floor(Math.random() * 150);

// Animation constants
const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 150;
const MOVEMENT_SPEED = 30;
const FRAME_CHANGE_INTERVAL = 8;
const MAX_LIGHT_DISTANCE = 150;
const BAND_SIZE = 5;
const TILE_COUNT = 25;

// Colors
const DIM_COLOR = '#525668';
const LIGHT_COLOR = '#686c85';
const WHITE_COLOR = '#fff';

// Pre-calculated color values
const dimRgb = hexToRgb(DIM_COLOR);
const lightRgb = hexToRgb(LIGHT_COLOR);

// Tile colors array (unchanged)
const tileThings = ['#4f4f4f', '#363636', '#4a4a4a', '#4b4b4b', '#939393', '#333333', '#464646', '#646464', '#818181', '#5d5d5d', '#797979', '#333333', '#464646', '#5b5b5b', '#555555', '#4b4b4b', '#484848', '#575757', '#767676', '#404040', '#767676', '#636363', '#585858', '#3d3d3d', '#656565', '#3a3a3a', '#7b7b7b', '#2e2e2e', '#919191', '#555555', '#8f8f8f', '#393939', '#606060', '#3c3c3c', '#8f8f8f', '#545454', '#4a4a4a', '#616161', '#767676', '#4f4f4f', '#5c5c5c', '#2e2e2e', '#696969', '#676767', '#959595', '#696969', '#7b7b7b', '#666666', '#5c5c5c', '#424242', '#7f7f7f', '#5e5e5e', '#848484', '#2e2e2e', '#484848', '#5b5b5b', '#606060', '#555555', '#888888', '#434343', '#4d4d4d', '#3a3a3a', '#868686', '#434343', '#9a9a9a', '#575757', '#7d7d7d', '#585858', '#484848', '#494949', '#585858', '#606060', '#7d7d7d', '#555555', '#7f7f7f', '#646464', '#464646', '#404040', '#464646', '#5b5b5b', '#8f8f8f', '#606060', '#868686', '#4f4f4f', '#424242', '#2e2e2e', '#9a9a9a', '#666666', '#767676', '#585858', '#8c8c8c', '#333333', '#868686', '#333333', '#818181', '#4b4b4b', '#939393', '#303030', '#727272', '#494949', '#535353', '#515151', '#696969', '#3c3c3c', '#5a5a5a', '#363636', '#5c5c5c', '#3f3f3f', '#707070', '#525252', '#868686', '#5a5a5a', '#585858', '#666666', '#6b6b6b', '#646464', '#424242', '#515151', '#9a9a9a', '#575757', '#767676', '#545454', '#8a8a8a', '#434343', '#4a4a4a', '#616161', '#424242', '#454545', '#444444', '#5a5a5a', '#4f4f4f', '#606060', '#919191', '#4f4f4f', '#696969', '#434343', '#464646', '#494949', '#606060', '#3c3c3c', '#959595', '#555555', '#8a8a8a', '#606060', '#515151', '#585858', '#939393', '#494949', '#535353', '#464646', '#7f7f7f', '#3a3a3a', '#848484', '#484848', '#5a5a5a', '#636363', '#535353', '#606060', '#747474', '#3c3c3c', '#747474', '#4b4b4b', '#747474', '#343434', '#515151', '#363636', '#848484', '#4b4b4b', '#919191', '#555555', '#7f7f7f', '#606060', '#5c5c5c', '#434343', '#676767', '#555555', '#444444', '#393939', '#818181', '#545454', '#979797', '#646464', '#727272', '#4e4e4e', '#8a8a8a', '#4e4e4e', '#636363', '#343434', '#767676', '#404040', '#767676', '#4e4e4e', '#636363', '#636363', '#747474', '#5b5b5b', '#484848', '#666666', '#747474', '#3f3f3f', '#919191', '#3f3f3f', '#7d7d7d', '#696969', '#888888', '#5a5a5a', '#727272', '#575757', '#656565', '#313131', '#7d7d7d', '#666666', '#8c8c8c', '#525252', '#4f4f4f', '#3f3f3f', '#707070', '#434343', '#888888', '#4e4e4e', '#7f7f7f', '#484848', '#7f7f7f', '#4e4e4e', '#727272'];

// ===== UTILITY FUNCTIONS =====
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(rgb) {
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
}

function interpolateColor(color1, color2, factor) {
    return {
        r: Math.round(color1.r + (color2.r - color1.r) * factor),
        g: Math.round(color1.g + (color2.g - color1.g) * factor),
        b: Math.round(color1.b + (color2.b - color1.b) * factor)
    };
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    yPosition = canvas.height - SPRITE_HEIGHT;
}

// ===== DRAWING FUNCTIONS =====
function drawDigit(n, x, y, w, h) {
    if (n === -1) return;

    const segmentHeight = h / 7;

    // Top horizontal
    if (n !== 1 && n !== 4) {
        ctx.fillRect(x, y, w, segmentHeight);
    }

    // Top right vertical
    if (n !== 5 && n !== 6) {
        ctx.fillRect(x + w - segmentHeight, y, segmentHeight, 4 * segmentHeight);
    }

    // Bottom right vertical
    if (n !== 2) {
        ctx.fillRect(x + w - segmentHeight, y + 3 * segmentHeight, segmentHeight, 4 * segmentHeight);
    }

    // Bottom horizontal
    if (n !== 1 && n !== 4 && n !== 7) {
        ctx.fillRect(x, y + 6 * segmentHeight, w, segmentHeight);
    }

    // Bottom left vertical
    if (n !== 1 && n !== 3 && n !== 4 && n !== 5 && n !== 7 && n !== 9) {
        ctx.fillRect(x, y + 3 * segmentHeight, segmentHeight, 4 * segmentHeight);
    }

    // Top left vertical
    if (n !== 1 && n !== 2 && n !== 3 && n !== 7) {
        ctx.fillRect(x, y, segmentHeight, 4 * segmentHeight);
    }

    // Middle horizontal
    if (n !== 0 && n !== 1 && n !== 7) {
        ctx.fillRect(x, y + 3 * segmentHeight, w, segmentHeight);
    }
}

function drawColon(x, y, w, h) {
    const dotSize = 2 * w / 7;
    ctx.fillRect(x + 2 * w / 7, y + h / 7, dotSize, dotSize);
    ctx.fillRect(x + 2 * w / 7, y + 5 * h / 7, dotSize, dotSize);
}

function drawTimeDisplay() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    ctx.fillStyle = WHITE_COLOR;
    let timeOffset = 0;
    const digitWidth = 25;
    const digitHeight = 40;
    const startX = 10;

    // Date display (DD:MM:YYYY)
    const dateParts = [
        Math.floor(day / 10), day % 10, -1, // Day with colon
        Math.floor(month / 10), month % 10, -1, // Month with colon
        ...year.toString().split('').map(Number) // Year digits
    ];

    dateParts.forEach((digit, index) => {
        if (digit === -1) {
            drawColon(startX + timeOffset * 30, 10, digitWidth, digitHeight);
        } else {
            drawDigit(digit, startX + timeOffset * 30, 10, digitWidth, digitHeight);
        }
        timeOffset++;
    });

    // Time display (HH:MM:SS)
    timeOffset = 0;
    const timeParts = [
        Math.floor(hour / 10), hour % 10, -1, // Hour with colon
        Math.floor(minute / 10), minute % 10, -1, // Minute with colon
        Math.floor(second / 10), second % 10 // Second
    ];

    timeParts.forEach((digit, index) => {
        if (digit === -1) {
            drawColon(startX + timeOffset * 30, 60, digitWidth, digitHeight);
        } else {
            drawDigit(digit, startX + timeOffset * 30, 60, digitWidth, digitHeight);
        }
        timeOffset++;
    });
}

function drawLightEffect() {
    for (let i = MAX_LIGHT_DISTANCE; i > 0; i -= BAND_SIZE) {
        const normalized = 1 - i / MAX_LIGHT_DISTANCE;
        ctx.fillStyle = rgbToHex(interpolateColor(dimRgb, lightRgb, normalized));
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, i, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawTilePattern() {
    let tileIndex = 0;
    const tileSize = canvas.width / TILE_COUNT;

    for (let y = 0; y < TILE_COUNT; y++) {
        for (let x = 0; x < TILE_COUNT; x++) {
            if ((x + y) % 2 === 0) {
                ctx.fillStyle = tileThings[tileIndex] + '10';
                ctx.beginPath();

                const centerX = tileSize * x;
                const centerY = tileSize * y;
                const halfTile = tileSize;

                ctx.moveTo(centerX - halfTile, centerY);
                ctx.lineTo(centerX, centerY - halfTile);
                ctx.lineTo(centerX + halfTile, centerY);
                ctx.lineTo(centerX, centerY + halfTile);
                ctx.closePath();
                ctx.fill();

                tileIndex = (tileIndex + 1) % tileThings.length;
            }
        }
    }
}

function drawSprite() {
    ctx.save();

    if (xVelocity === -1) {
        ctx.translate(xPosition + SPRITE_WIDTH / 2, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(xPosition + SPRITE_WIDTH / 2), 0);
    }

    ctx.drawImage(framey, xPosition, yPosition, SPRITE_WIDTH, SPRITE_HEIGHT);
    ctx.restore();
}

// ===== ANIMATION FUNCTIONS =====
function changeFrame() {
    turnTick--;

    // Boundary collision or random turn
    if (xPosition <= 0 || xPosition + SPRITE_WIDTH >= canvas.width) {
        xVelocity *= -1;
        xPosition += MOVEMENT_SPEED * xVelocity;
    } else if (turnTick <= 0) {
        turnTick = Math.floor(Math.random() * 150);
        xVelocity *= -1;
    }

    // Update sprite animation
    if (xVelocity !== 0) {
        if (ccc % FRAME_CHANGE_INTERVAL === 0) {
            xPosition += MOVEMENT_SPEED * xVelocity;
        }
        framey.src = `walk anim/sprite_${ccc % FRAME_CHANGE_INTERVAL}.png`;
        ccc++;
    }
}

function draw() {
    yPosition = canvas.height - SPRITE_HEIGHT;

    // Clear canvas with base color
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw visual elements
    drawLightEffect();
    drawTimeDisplay();
    drawTilePattern();
    drawSprite();

    // Continue animation
    animationId = requestAnimationFrame(draw);
}

// ===== EVENT LISTENERS =====
// Search functionality
searchText.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(searchText.value);
    }
});

// Mouse hover detection
searchText.addEventListener('mouseenter', () => hovering = true);
searchText.addEventListener('mouseleave', () => hovering = false);

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Mouse click interaction
window.addEventListener('mousedown', (event) => {
    if (event.button === 0 && !hovering) {
        const clickX = event.clientX;
        const clickY = event.clientY;

        // Check if click is on sprite
        if (clickX >= xPosition && clickX <= xPosition + SPRITE_WIDTH &&
            clickY >= yPosition && clickY <= yPosition + SPRITE_HEIGHT) {
            xVelocity *= -1;
        }
    }
});

// Window resize handling
window.addEventListener('resize', resizeCanvas);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// ===== INITIALIZATION =====
// Set up canvas and sprite
searchText.focus();
resizeCanvas();
mouseX = canvas.width / 2;
mouseY = canvas.height / 2;

framey.src = 'walk anim/sprite_3.png';

// Start animations
setInterval(changeFrame, 50);
draw();
