// ====== WORLD CLOCKS ======
function updateClocks() {
  const zones = [
    { id: 'la', tz: 'America/Los_Angeles' },
    { id: 'ny', tz: 'America/New_York' },
    { id: 'uk', tz: 'Europe/London' }
  ];

  zones.forEach(z => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      timeZone: z.tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const date = now.toLocaleDateString('en-US', {
      timeZone: z.tz,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    document.getElementById('clock-' + z.id).textContent = time;
    document.getElementById('date-' + z.id).textContent = date;
  });
}

updateClocks();
setInterval(updateClocks, 1000);

// ====== SPARKLE TRAIL ======
const sparkles = ['✨', '⭐', '💫', '✦', '★'];
let lastSparkle = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSparkle < 80) return;
  lastSparkle = now;

  const el = document.createElement('div');
  el.className = 'sparkle';
  el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
  el.style.left = e.clientX + 'px';
  el.style.top = e.clientY + 'px';
  document.body.appendChild(el);

  setTimeout(() => el.remove(), 800);
});

// ====== FAKE VISITOR COUNTER ======
const counter = document.getElementById('visitorCount');
let count = 4782;
setInterval(() => {
  if (Math.random() < 0.3) {
    count++;
    counter.textContent = String(count).padStart(6, '0');
  }
}, 5000);
