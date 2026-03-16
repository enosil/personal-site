// ====== WORLD CLOCKS ======
function updateClocks() {
  const zones = [
    { id: 'la', tz: 'America/Los_Angeles' },
    { id: 'ny', tz: 'America/New_York' },
    { id: 'uk', tz: 'Europe/London' }
  ];

  zones.forEach(z => {
    const clockEl = document.getElementById('clock-' + z.id);
    const dateEl = document.getElementById('date-' + z.id);
    if (!clockEl || !dateEl) return;
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
    clockEl.textContent = time;
    dateEl.textContent = date;
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
if (counter) {
  let count = 4782;
  setInterval(() => {
    if (Math.random() < 0.3) {
      count++;
      counter.textContent = String(count).padStart(6, '0');
    }
  }, 5000);
}

// ====== CALENDAR ======
(function() {
  const calBody = document.getElementById('calendar-body');
  const calTitle = document.getElementById('calendar-title');
  if (!calBody || !calTitle) return;

  let currentDate = new Date();
  let viewYear = currentDate.getFullYear();
  let viewMonth = currentDate.getMonth();

  function renderCalendar() {
    const today = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    calTitle.textContent = months[viewMonth].substring(0, 3) + ' ' + viewYear;

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    let html = '';
    let day = 1;
    let nextDay = 1;

    for (let row = 0; row < 6; row++) {
      html += '<tr>';
      for (let col = 0; col < 7; col++) {
        const cellIndex = row * 7 + col;
        if (cellIndex < firstDay) {
          const d = daysInPrev - firstDay + col + 1;
          html += '<td class="other-month">' + d + '</td>';
        } else if (day > daysInMonth) {
          html += '<td class="other-month">' + nextDay + '</td>';
          nextDay++;
        } else {
          const isToday = (day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear());
          html += '<td' + (isToday ? ' class="today"' : '') + '>' + day + '</td>';
          day++;
        }
      }
      html += '</tr>';
      if (day > daysInMonth) break;
    }
    calBody.innerHTML = html;
  }

  window.calPrev = function() {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  };

  window.calNext = function() {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  };

  renderCalendar();
})();

// ====== MUSIC PLAYER ======
(function() {
  const playBtn = document.getElementById('music-play');
  if (!playBtn) return;

  const playlist = [
    { title: 'Song 1', artist: 'Artist 1', src: 'music/surfing.mp3' },
    { title: 'Song 2', artist: 'Artist 2', src: 'music/song2.mp3' },
    { title: 'Song 3', artist: 'Artist 3', src: 'music/song3.mp3' }
  ];

  let currentTrack = 0;
  let audio = new Audio();
  let isPlaying = false;

  const titleEl = document.getElementById('music-title');
  const artistEl = document.getElementById('music-artist');
  const progressBar = document.getElementById('music-progress-bar');
  const progressWrap = document.getElementById('music-progress');

  function loadTrack(index) {
    currentTrack = index;
    if (currentTrack < 0) currentTrack = playlist.length - 1;
    if (currentTrack >= playlist.length) currentTrack = 0;
    const track = playlist[currentTrack];
    audio.src = track.src;
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    progressBar.style.width = '0%';
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      playBtn.textContent = '\u25B6';
      isPlaying = false;
    } else {
      audio.play().catch(() => {});
      playBtn.textContent = '\u275A\u275A';
      isPlaying = true;
    }
  }

  window.musicPrev = function() {
    loadTrack(currentTrack - 1);
    if (isPlaying) { audio.play().catch(() => {}); }
  };

  window.musicNext = function() {
    loadTrack(currentTrack + 1);
    if (isPlaying) { audio.play().catch(() => {}); }
  };

  window.musicToggle = togglePlay;

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
  });

  audio.addEventListener('ended', () => {
    loadTrack(currentTrack + 1);
    audio.play().catch(() => {});
  });

  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      if (audio.duration) {
        const rect = progressWrap.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
      }
    });
  }

  loadTrack(0);
})();
