let currentScene = 1;
let poppedCount = 0;
const totalBalloons = 5;

// --- BOW & ARROW LOGIC ---
const bowContainer = document.getElementById('bow-container');
const arrow = document.getElementById('arrow');
const bowString = document.getElementById('bow-string');
const heartTarget = document.getElementById('heart-target');
let isDragging = false;
let startX = 0;
let currentPull = 0;
const maxPull = 60; 

bowContainer.addEventListener('mousedown', startDrag);
bowContainer.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
window.addEventListener('mousemove', drag);
window.addEventListener('touchmove', (e) => drag(e.touches[0]));
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

function startDrag(e) {
  if (currentScene !== 1) return;
  isDragging = true;
  startX = e.clientX;
  arrow.style.transition = 'none';
}

function drag(e) {
  if (!isDragging) return;
  let pull = startX - e.clientX;
  if (pull < 0) pull = 0;
  if (pull > maxPull) pull = maxPull;
  currentPull = pull;
  arrow.style.transform = `translateX(-${pull}px) translateY(-50%)`;
  bowString.setAttribute('d', `M 15 10 Q ${15 - pull} 90 15 170`);
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  
  if (currentPull > 35) {
    arrow.style.transition = 'transform 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
    arrow.style.transform = `translateX(180px) translateY(-50%)`; 
    bowString.setAttribute('d', `M 15 10 Q 15 90 15 170`); 
    
    const music = document.getElementById('bg-music');
    if (music) music.play().catch(() => console.log("Music blocked"));
    
    setTimeout(() => {
      heartTarget.classList.remove('heartbeat');
      heartTarget.style.transform = 'scale(1.4) rotate(15deg)';
      heartTarget.style.opacity = '0'; 
      
      confetti({ particleCount: 50, spread: 70, origin: { x: 0.6, y: 0.4 }, colors: ['#ff4757', '#ff2e4c', '#fff'] });
      document.getElementById('pull-instruction').innerText = "direct hit! 💘";
      
      setTimeout(() => { nextScene(2); }, 1500);
    }, 300); 
  } else {
    arrow.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    arrow.style.transform = `translateX(0px) translateY(-50%)`;
    bowString.setAttribute('d', `M 15 10 Q 15 90 15 170`);
  }
  currentPull = 0;
}

function nextScene(sceneNumber) {
  const oldScene = document.getElementById(`scene-${currentScene}`);
  oldScene.classList.remove('active');
  
  setTimeout(() => {
    oldScene.classList.add('hidden');
    const newScene = document.getElementById(`scene-${sceneNumber}`);
    newScene.classList.remove('hidden');
    
    setTimeout(() => { newScene.classList.add('active'); }, 50);
    currentScene = sceneNumber;
    window.scrollTo(0, 0);
  }, 1000); 
}

// --- JELLY CAKE FIRE BLOW LOGIC ---
function blowDragonFire() {
  const fire = document.getElementById('dragon-fire');
  if (fire.style.display === 'none') return; 
  fire.style.display = 'none';

  confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#ff4500', '#ffa502', '#ff6b81', '#fff'] });
  document.getElementById('blow-instruction').innerText = "wish granted, my love... ✨";
  setTimeout(() => { nextScene(3); }, 2500);
}

// --- BALLOONS LOGIC ---
function popBalloon(event, element, message) {
  if (element.style.visibility === 'hidden') return;
  element.style.visibility = 'hidden';
  
  const xPos = event.clientX / window.innerWidth;
  const yPos = event.clientY / window.innerHeight;
  
  confetti({ particleCount: 30, spread: 60, origin: { x: xPos, y: yPos }, colors: ['#ff4d4d', '#9b59b6', '#f1c40f', '#ff9ff3', '#ffffff'] });
  
  const msgBox = document.getElementById('pop-message');
  msgBox.classList.remove('animate-reason');
  void msgBox.offsetWidth; 
  msgBox.innerText = message;
  msgBox.classList.add('animate-reason');

  poppedCount++;
  
  if (poppedCount >= totalBalloons) {
    document.getElementById('balloon-instruction').style.display = 'none';
    setTimeout(() => {
      const revealBtn = document.getElementById('reveal-msg-btn');
      revealBtn.classList.remove('hidden');
      revealBtn.classList.add('fade-in-text');
    }, 2000);
  }
}

function revealFinalMessage() {
  document.getElementById('reveal-msg-btn').style.display = 'none'; 
  const msgBox = document.getElementById('pop-message');
  
  msgBox.classList.remove('animate-reason');
  void msgBox.offsetWidth; 
  msgBox.innerText = "You mean everything to me...";
  msgBox.classList.add('animate-reason');
  
  setTimeout(() => {
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.classList.remove('hidden');
    continueBtn.classList.add('fade-in-text');
  }, 1200);
}

// --- MEMORIES LOGIC ---
let currentMemoryIndex = 0;
const totalMemories = 5;

function revealNextMemory() {
  if (currentMemoryIndex < totalMemories - 1) {
    const currentCard = document.getElementById(`mem-${currentMemoryIndex}`);
    currentCard.classList.remove('active-mem');
    currentCard.style.transform = 'scale(0.8) translateY(-30px)';
    currentCard.style.opacity = '0';

    currentMemoryIndex++;
    const nextCard = document.getElementById(`mem-${currentMemoryIndex}`);
    if (nextCard) nextCard.classList.add("active-mem");
    
    confetti({ particleCount: 15, spread: 40, origin: { y: 0.5 }, colors: ['#ff7eb3', '#fcf6ba'] });
    
    if (currentMemoryIndex === totalMemories - 1) {
      document.getElementById('memory-instruction').style.display = 'none';
      const nextBtn = document.getElementById('memory-next-btn');
      nextBtn.classList.remove('hidden');
      nextBtn.classList.add('fade-in-text');
    }
  }
}

// --- FLAWLESS INK PEN TYPEWRITER ANIMATION ---
function openEnvelope() {
  const envelope = document.getElementById('envelope-box');
  const flap = document.querySelector('.envelope-flap');
  const seal = document.querySelector('.wax-seal');
  
  flap.style.transform = 'rotateX(180deg)';
  seal.style.transform = 'scale(0) rotate(45deg)';
  
  confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }, colors: ['#ff4757', '#e5d3b3', '#ffffff'] });

  setTimeout(() => {
    envelope.classList.add('hidden');
    const letter = document.getElementById('unfolded-letter');
    letter.classList.remove('hidden');
    
    typeWriterSequence();
  }, 600);
}

function typeWriterSequence() {
  // YOUR EXACT WORDS RESTORED HERE:
  const letterLines = [
    { id: 'line-1', text: "My love Akshu," },
    { id: 'line-2', text: "Happy Birthday to the woman who makes my heart skip a beat. Before I met you, I didn't know it was possible to love someone this deeply. I'm Lucky that you were born, lucky that our paths crossed, and lucky that I get to call you mine." },
    { id: 'line-3', text: "The way you handle life with such grace, your endless kindness, and your brilliant mind—you are truly one of a kind. I built this to remind you of how incredibly loved and admired you are, not just by me, but by everyone who knows you. Have the most wonderful birthday." },
    { id: 'line-4', text: "All my love,\nHarsh" }
  ];

  let currentLineIndex = 0;

  function typeNextLine() {
    if (currentLineIndex < letterLines.length) {
      const lineData = letterLines[currentLineIndex];
      const element = document.getElementById(lineData.id);
      
      element.style.display = 'block'; 
      element.innerHTML = ''; 
      
      let charIndex = 0;
      const textToType = lineData.text;

      function typeChar() {
        if (charIndex < textToType.length) {
          if (textToType.charAt(charIndex) === '\n') {
            element.innerHTML += '<br>';
          } else {
            element.innerHTML += textToType.charAt(charIndex);
          }
          charIndex++;
          setTimeout(typeChar, 35); // Adjusted speed to 35ms per character for perfect pacing
        } else {
          currentLineIndex++;
          setTimeout(typeNextLine, 500); // Wait half a second before starting next paragraph
        }
      }
      typeChar(); 
    } else {
      setTimeout(() => {
        const mineSec = document.getElementById('final-mine-section');
        mineSec.classList.remove('hidden');
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 }, colors: ['#ff4757', '#ff9ff3', '#fcf6ba'] });
      }, 500);
    }
  }

  typeNextLine();
}

function triggerRestart(e) {
  e.stopPropagation(); 
  const overlay = document.getElementById('restart-overlay');
  overlay.classList.remove('hidden');
  setTimeout(() => { overlay.classList.add('visible'); }, 50);
}