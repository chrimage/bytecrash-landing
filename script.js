const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let animationFrameId = null;
let lastWidth = 0;
let lastHeight = 0;

// --- Particle Network Settings ---
const NEON_COLORS = ['#00FFE7', '#B100FF', '#FF00AA', '#AAFF00'];
const PARTICLE_COUNT = 40; // Between 30-50 as per DESIGN.md
const MAX_LINE_DISTANCE = 120; // Threshold for connecting lines
const PARTICLE_SPEED_FACTOR = 0.5; // Slow drift
const PARTICLE_RADIUS = 2;
let particles = [];
// --------------------------------

// --- Particle Class ---
class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }

    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
// ---------------------

function initParticles(width, height) {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const vx = (Math.random() - 0.5) * PARTICLE_SPEED_FACTOR * 2; // Random horizontal velocity
        const vy = (Math.random() - 0.5) * PARTICLE_SPEED_FACTOR * 2; // Random vertical velocity
        const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
        particles.push(new Particle(x, y, vx, vy, color));
    }
    console.log(`Initialized ${particles.length} particles.`);
}

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width !== lastWidth || height !== lastHeight) {
        canvas.width = width;
        canvas.height = height;
        lastWidth = width;
        lastHeight = height;
        console.log(`Canvas resized to ${width}x${height}`);

        // Re-initialize particles for new dimensions if needed (or just let them adapt)
        // For simplicity, let's re-initialize on resize if not reduced motion
        if (!prefersReducedMotion) {
             initParticles(width, height);
        }

        // Draw static elements if reduced motion is preferred
        if (prefersReducedMotion) {
            drawStaticScene();
        }
    }
}

function drawNoise() {
    const width = canvas.width;
    const height = canvas.height;
    // Optimization: Avoid creating ImageData repeatedly if dimensions haven't changed
    // However, for simplicity and ensuring noise changes, we create it each time.
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = 15; // Low alpha for noise
    }
    ctx.putImageData(imageData, 0, 0); // This overwrites the canvas
}

function updateAndDrawParticles() {
    const width = canvas.width;
    const height = canvas.height;

    // Update and draw particles
    particles.forEach(p => {
        p.update(width, height);
        p.draw(); // Draw particle itself
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAX_LINE_DISTANCE) {
                // Calculate opacity based on distance (closer = more opaque)
                const opacity = 1 - (dist / MAX_LINE_DISTANCE);
                // Use the color of the first particle for the line, could alternate or mix
                const lineColor = p1.color;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = lineColor;
                // Apply fading opacity - Ensure color format supports alpha if needed,
                // otherwise use globalAlpha. Using globalAlpha is simpler here.
                ctx.globalAlpha = opacity * 0.5; // Make lines generally faint
                ctx.lineWidth = 0.5; // Thin lines
                ctx.stroke();
                ctx.globalAlpha = 1.0; // Reset global alpha
            }
        }
    }
}

function drawStaticParticles() {
    // Draw particles in their current positions without lines
    particles.forEach(p => p.draw());
    console.log("Drew static particles (reduced motion).");
}


function drawStaticScene() {
    // Draw noise once
    drawNoise();
    // Draw particles without lines or movement
    // Ensure particles are initialized if they haven't been
    if (particles.length === 0 && canvas.width > 0 && canvas.height > 0) {
        initParticles(canvas.width, canvas.height);
    }
    drawStaticParticles();
    console.log("Drew static scene (reduced motion).");
}

function animateScene() {
    // Draw the noise background first (overwrites previous frame)
    drawNoise();

    // Update positions, draw particles and connecting lines
    updateAndDrawParticles();

    // Request next frame
    animationFrameId = requestAnimationFrame(animateScene);
}

function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        console.log("Animation stopped.");
        // Clear canvas or draw static state when stopping if needed
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Check for reduced motion preference
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = mediaQuery.matches;

function handleReducedMotionChange(event) {
    prefersReducedMotion = event.matches;
    if (prefersReducedMotion) {
        stopAnimation();
        // Draw the static scene once if the canvas is ready
        if (canvas.width > 0 && canvas.height > 0) {
             drawStaticScene();
        }
    } else {
        // Start animation only if it wasn't already running and canvas is sized
        if (!animationFrameId && canvas.width > 0 && canvas.height > 0) {
            // Ensure particles are initialized before starting animation
            if (particles.length === 0) {
                initParticles(canvas.width, canvas.height);
            }
            console.log("Starting scene animation.");
            animateScene();
        }
    }
}

// Initial setup
window.addEventListener('resize', resizeCanvas);
mediaQuery.addEventListener('change', handleReducedMotionChange);

// Set initial canvas size and initialize particles
resizeCanvas(); // This will call initParticles if not reduced motion

// Start animation or draw static scene based on initial preference
if (prefersReducedMotion) {
    // resizeCanvas already called drawStaticScene if needed, but call again to be sure
    // if resize didn't trigger particle init (e.g., initial size was 0)
     drawStaticScene();
} else {
    // resizeCanvas initialized particles, now start animation
    console.log("Starting scene animation.");
    animateScene();
}

console.log(`Initial prefers-reduced-motion: ${prefersReducedMotion}`);