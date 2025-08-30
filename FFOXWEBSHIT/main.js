const canvas = document.getElementById('canvas');
const searchText = document.getElementsByClassName('searchText')[0];

searchText.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        window.location.href = 'https://www.google.com/search?q=' + searchText.value;
    }
})

const ctx = canvas.getContext('2d');

let mouseX = 0;
let mouseY = 0;
let animationId;

// Set canvas size to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Set initial mouse position to center
mouseX = canvas.width / 2;
mouseY = canvas.height / 2;

// Helper function to parse hex color to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function rgbToHex(rgb) {
    let hexThing = [];
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            hexThing.push('0123456789abcdef'[i % 16] + '0123456789abcdef'[j % 16]);
        }
    }
    return '#' + hexThing[rgb.r] + hexThing[rgb.g] + hexThing[rgb.b];
}

// Helper function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
    return {
        r: Math.round(color1.r + (color2.r - color1.r) * factor),
        g: Math.round(color1.g + (color2.g - color1.g) * factor),
        b: Math.round(color1.b + (color2.b - color1.b) * factor)
    };
}




function funcy(x) {
    return Math.sqrt(x);
}


let framey = new Image();
framey.style.transform = 'scaleX(-1)';
framey.src = 'walk anim/sprite_3.png';

let ccc = 0;

let xPosition = 10;
let yPosition = canvas.height - 120;
let xVelocity = 1;
let yVelocity = 0;
let onFloor = true;
let turnTick = Math.floor(Math.random() * 150);

function changeFrame() {
    
    turnTick--;
    if (xPosition <= 0 || xPosition + 100 >= canvas.width) {
        xVelocity *= -1;
        xPosition += 30 * xVelocity;
    }
    else if (turnTick <= 0) {
        turnTick = Math.floor(Math.random() * 150);
        xVelocity *= -1;
    }
    if (xVelocity !== 0) {
        if (ccc % 8 === 0) {
            xPosition += 30 * xVelocity;
        }
        framey.src = 'walk anim/sprite_'+(ccc % 8).toString()+'.png';
        
        ccc++;
    }

}

setInterval(changeFrame, 50);
function draw() {
    // Create image data for pixel manipulation
    const bandSize = 5; // Adjust for performance vs quality
    const dimCol = '#48557c';
    const lightCol = '#606c93';

    // Parse colors
    const dimRgb = hexToRgb(dimCol);
    const lightRgb = hexToRgb(lightCol);

    ctx.fillStyle = dimCol;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const maxDist = 150;
    for (let i = maxDist; i > 0; i -= bandSize) {
        const normalIzed = 1 - i / maxDist; // haha get it because i is normalized so i make the i in normalized capital to emphasise it haha im so fucking hilarious
        ctx.fillStyle = rgbToHex(interpolateColor(dimRgb, lightRgb, normalIzed));
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, i, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.save();

    // Apply transformation for flipping if needed
    if (xVelocity === -1) {
        // Translate to the sprite position, flip horizontally, then translate back
        ctx.translate(xPosition + 50, 0); // 50 is half the sprite width (100/2)
        ctx.scale(-1, 1);
        
        ctx.translate(-(xPosition + 50), 0);
    }
    

    ctx.drawImage(framey, xPosition, yPosition, 100, 150);

    // Restore the context state
    ctx.restore();
    
    // Continue animation
    animationId = requestAnimationFrame(draw);
}

// Start the animation
draw();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

function bark() {
    xVelocity *= -1;
    xPosition += 30 * xVelocity;
}
window.addEventListener('mousedown', function(event) {
    if (event.button === 0) {
        mouseX = event.x;
        mouseY = event.y;
        if (xPosition <= mouseX <= xPosition + 100 && yPosition <= mouseY <= yPosition + 150) {
            xVelocity *= -1;
            
        }
    }
});
