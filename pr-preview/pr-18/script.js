$(document).ready(function () {
  // --- Memory Game Logic ---
  const gameImages = [
    'photo_2023-05-01_23-10-48.jpg',
    'photo_2023-05-07_00-34-35.jpg',
    'photo_2023-06-11_21-57-30.jpg',
    'photo_2023-06-12_20-20-39.jpg',
    'photo_2023-06-21_22-32-40.jpg',
    'photo_2023-06-24_00-17-04.jpg',
    'photo_2023-06-26_15-54-23.jpg',
    'photo_2023-07-08_23-10-46.jpg'
  ];

  // Select 6 random images for 12 cards (4x3 grid)
  let gameCards = [];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let matchesFound = 0;
  const totalPairs = 6;

  function initGame() {
    const selectedImages = gameImages.sort(() => 0.5 - Math.random()).slice(0, 6);
    gameCards = [...selectedImages, ...selectedImages];
    gameCards.sort(() => 0.5 - Math.random());

    const gameBoard = $('#memoryGame');
    gameBoard.empty();
    matchesFound = 0;
    $('#restartGameBtn').hide();

    gameCards.forEach(imgSrc => {
      const card = $(`
        <div class="memory-card" data-framework="${imgSrc}">
          <div class="front-face"><img src="${imgSrc}" alt="Memory"></div>
          <div class="back-face"><span class="material-icons">favorite</span></div>
        </div>
      `);
      gameBoard.append(card);
    });

    $('.memory-card').click(flipCard);
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    $(this).addClass('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = $(firstCard).data('framework') === $(secondCard).data('framework');
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    $(firstCard).off('click');
    $(secondCard).off('click');
    matchesFound++;
    resetBoard();

    if (matchesFound === totalPairs) {
      setTimeout(() => {
         confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
         $('#restartGameBtn').fadeIn();
      }, 500);
    }
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      $(firstCard).removeClass('flip');
      $(secondCard).removeClass('flip');
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  $('#restartGameBtn').click(initGame);
  initGame(); // Start game on load

  // --- Message in a Bottle Logic ---
  const bottleMessages = [
    "O destino me sorriu quando te conheci.",
    "Nosso futuro é a minha vista favorita.",
    "Prometo te fazer feliz todos os dias.",
    "Você é meu sonho realizado.",
    "Em cada estrela, vejo o brilho dos teus olhos.",
    "Nossa história é meu livro preferido.",
    "Te amarei até o fim dos tempos.",
    "Você é a melhor parte do meu dia.",
    "Juntos somos invencíveis.",
    "Minha alma gêmea é você."
  ];

  $('#floatingBottle').click(function() {
     const msg = bottleMessages[Math.floor(Math.random() * bottleMessages.length)];
     $('#bottleMessage').text(msg);
     $('#bottleModal').fadeIn().css('display', 'flex');
  });

  $('.close-bottle').click(function() {
    $('#bottleModal').fadeOut();
  });

  // --- Time Capsule Logic ---
  $('#openCapsuleBtn, #capsuleLockBtn').click(function() {
      // Logic to check date (mocked to allow opening with a trick or just open for now)
      // Real usage: const now = new Date(); const target = new Date('2025-11-29');
      // For demo, we simulate a "shaking lock" then open or just open

      const lock = $('#capsuleLockBtn');
      const btn = $('#openCapsuleBtn');

      // Add shake animation
      lock.css('animation', 'shake 0.5s');
      setTimeout(() => lock.css('animation', ''), 500);

      // Simulate unlocking process
      btn.text('Destrancando...');
      setTimeout(() => {
          lock.addClass('unlocked');
          btn.text('Abrir Mensagem');
          btn.off('click').click(function() {
             $('#capsuleModal').fadeIn().css('display', 'flex');
             confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500'] // Gold/Orange
             });
          });
      }, 1500);
  });

  $('.close-capsule').click(function() {
     $('#capsuleModal').fadeOut();
  });

  // --- Bucket List Logic (LocalStorage) ---
  function updateBucketProgress() {
      const total = $('.bucket-item input[type="checkbox"]').length;
      const checked = $('.bucket-item input[type="checkbox"]:checked').length;
      const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

      $('#bucketProgressBar').css('width', percent + '%');
      $('#bucketProgressText').text(percent + '% Realizado');
  }

  // Load saved state
  $('.bucket-item input[type="checkbox"]').each(function() {
     const id = $(this).attr('id');
     const checked = localStorage.getItem(id) === 'true';
     $(this).prop('checked', checked);
  });

  // Initial update
  updateBucketProgress();

  // Save state on change
  $('.bucket-item input[type="checkbox"]').change(function(event) {
     const id = $(this).attr('id');
     localStorage.setItem(id, $(this).prop('checked'));
     updateBucketProgress();

     if($(this).prop('checked')) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { x: (event.clientX / window.innerWidth), y: (event.clientY / window.innerHeight) },
          colors: ['#4caf50', '#ffffff'] // Green/White for check
        });
     }
  });

  // --- Click Heart Effect ---
  $(document).click(function(e) {
     // Avoid double trigger on buttons that already have effects
     if ($(e.target).closest('button').length || $(e.target).closest('.envelope-wrapper').length || $(e.target).closest('.memory-card').length || $(e.target).closest('.bucket-item').length || $(e.target).closest('.floating-bottle').length) return;

     const heart = $('<div class="heart-click material-icons">favorite</div>');
     heart.css({
        left: e.clientX,
        top: e.clientY
     });
     $('body').append(heart);
     setTimeout(() => heart.remove(), 1000);
  });

  // Vanilla Tilt Initialization
  VanillaTilt.init(document.querySelectorAll(".glass-card"), {
    max: 5,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.02
  });
  // Carousel
  $('.slick-carousel').slick({
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: true,
    infinite: true,
    fade: true,
    cssEase: 'linear',
    speed: 500
  });

  // --- TIMERS LOGIC ---
  const relationshipStart = new Date('2022-07-28T00:00:00').getTime();
  const weddingDate = new Date('2025-11-29T00:00:00').getTime();

  const bodasMap = {
    1: "Papel", 2: "Algodão", 3: "Trigo", 4: "Flores e Frutas", 5: "Madeira",
    6: "Perfume", 7: "Lã", 8: "Barro", 9: "Cerâmica", 10: "Estanho",
    15: "Cristal", 20: "Porcelana", 25: "Prata", 30: "Pérola",
    35: "Coral", 40: "Rubi", 45: "Platina", 50: "Ouro", 60: "Diamante"
  };

  function formatTime(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  function renderTimer(id, timeObj) {
    const html = `
      <div class="time-box"><span class="time-val">${timeObj.days}</span><span class="time-label">Dias</span></div>
      <div class="time-box"><span class="time-val">${timeObj.hours}</span><span class="time-label">Horas</span></div>
      <div class="time-box"><span class="time-val">${timeObj.minutes}</span><span class="time-label">Min</span></div>
      <div class="time-box"><span class="time-val">${timeObj.seconds}</span><span class="time-label">Seg</span></div>
    `;
    document.getElementById(id).innerHTML = html;
  }

  function updateTimers() {
    const now = new Date().getTime();

    // 1. Relationship Timer (Always count UP)
    const relDiff = now - relationshipStart;
    renderTimer('relationship-timer', formatTime(relDiff));

    // 2. Wedding Timer
    const weddingDiff = weddingDate - now;

    if (weddingDiff > 0) {
      // Future: Countdown
      document.getElementById('wedding-title').innerText = "Contagem regressiva";
      document.getElementById('wedding-date-display').style.display = 'block';
      document.getElementById('bodas-display').style.display = 'none';
      renderTimer('wedding-timer', formatTime(weddingDiff));
    } else {
      // Past: Married Timer + Bodas
      document.getElementById('wedding-title').innerText = "Casados há";
      const marriedDiff = now - weddingDate;
      const marriedTime = formatTime(marriedDiff);
      renderTimer('wedding-timer', marriedTime);

      // Calculate Bodas (Years)
      const yearsMarried = Math.floor(marriedDiff / (1000 * 60 * 60 * 24 * 365.25));
      if (yearsMarried >= 1) {
         const bodasName = bodasMap[yearsMarried] || "Amor";
         const bodasHtml = `<span class="material-icons">stars</span> Bodas de ${bodasName}`;
         const bodasEl = document.getElementById('bodas-display');
         bodasEl.innerHTML = bodasHtml;
         bodasEl.style.display = 'inline-block';
      } else {
         document.getElementById('bodas-display').style.display = 'none';
      }
    }
  }

  setInterval(updateTimers, 1000);
  updateTimers();

  // Reasons Logic
  const reasons = [
    "Pelo seu sorriso que ilumina meu dia.",
    "Pela forma como você cuida de mim.",
    "Por ser minha melhor amiga.",
    "Pelo seu abraço aconchegante.",
    "Pela nossa cumplicidade única.",
    "Porque você me inspira a ser melhor.",
    "Pelo brilho dos seus olhos.",
    "Por me apoiar em todos os momentos.",
    "Pelas nossas conversas infinitas.",
    "Porque ao seu lado, tudo fica perfeito.",
    "Pelo seu coração bondoso.",
    "Pela paz que você me traz.",
    "Porque você é o amor da minha vida.",
    "Pelo jeito que você me olha.",
    "Pela nossa história linda.",
    "Porque você me entende como ninguém.",
    "Pelo seu cheiro que eu amo.",
    "Porque você é meu porto seguro.",
    "Por todos os nossos planos futuros.",
    "Simplesmente por você existir."
  ];

  // Intro Overlay
  $('#enterBtn').click(function() {
    $('#introOverlay').fadeOut(1000, function() {
      $(this).remove();
      typeGreeting();
    });
    // Try to trigger autoplay by updating src with autoplay=1
    const iframe = $('#musicPlayer');
    const src = iframe.attr('src');
    if (src.indexOf('autoplay') === -1) {
       iframe.attr('src', src + "&autoplay=1");
    }
  });

  function typeGreeting() {
    const text = "Olá, amor da minha vida...";
    const el = $('#greeting-typewriter');
    let i = 0;
    function type() {
      if (i < text.length) {
        el.text(el.text() + text.charAt(i));
        i++;
        setTimeout(type, 100);
      }
    }
    setTimeout(type, 500);
  }

  $('#reasonsBtn').click(function() {
    // Disable button while typing
    const btn = $(this);
    if (btn.prop('disabled')) return;
    btn.prop('disabled', true);

    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    const display = $('#reason-display');

    display.text(''); // Clear previous text
    display.css('opacity', 1);

    let i = 0;
    const text = '"' + randomReason + '"';

    function typeWriter() {
      if (i < text.length) {
        display.text(display.text() + text.charAt(i));
        i++;
        setTimeout(typeWriter, 50);
      } else {
         btn.prop('disabled', false);
      }
    }

    typeWriter();

    // Confetti burst
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff6b81', '#e91e63', '#ffffff']
    });
  });

  // Background Petals Animation
  setInterval(function () {
    var r_size = Math.floor(Math.random() * 15) + 10;
    var r_left = Math.floor(Math.random() * 100) + 1;
    var r_time = Math.floor(Math.random() * 10) + 10;

    $('.bg_petals').append("<div class='petal' style='width:" + r_size + "px;height:" + r_size + "px;left:" + r_left + "%;animation-duration:" + r_time + "s'></div>");

    $('.petal').each(function () {
      var top = $(this).offset().top;
      if (top > window.innerHeight) {
        $(this).remove();
      }
    });
  }, 400);

  // Surprise Button
  $('#surpriseBtn').click(function() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInOut(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    $('#envelopeOverlay').fadeIn().css('display', 'flex');
  });

  $('#envelopeWrapper').click(function() {
    $(this).addClass('open');
    $('.click-hint').hide();
  });

  $('.close-envelope-btn').click(function(e) {
    e.stopPropagation();
    $('#envelopeOverlay').fadeOut();
    setTimeout(function() {
      $('#envelopeWrapper').removeClass('open');
      $('.click-hint').show();
    }, 500);
  });

  // --- Heart Cursor Trail ---
  let lastTime = 0;
  $(document).mousemove(function(e) {
    const now = Date.now();
    if (now - lastTime < 50) return; // Throttle
    lastTime = now;

    const heart = $('<div class="heart-trail">❤</div>');
    heart.css({
      left: e.clientX,
      top: e.clientY
    });
    $('body').append(heart);
    setTimeout(() => heart.remove(), 1000);
  });

  // --- Rising Hearts Background ---
  setInterval(function () {
    var r_size = Math.floor(Math.random() * 20) + 10;
    var r_left = Math.floor(Math.random() * 100) + 1;
    var r_time = Math.floor(Math.random() * 15) + 10;

    // Randomly choose a heart icon
    var icons = ['favorite', 'favorite_border', 'volunteer_activism'];
    var icon = icons[Math.floor(Math.random() * icons.length)];

    var el = $("<div class='heart-float material-icons'>" + icon + "</div>");
    el.css({
      'font-size': r_size + 'px',
      'left': r_left + '%',
      'animation-duration': r_time + 's'
    });

    $('.bg_hearts').append(el);

    // Remove after animation
    setTimeout(function() {
      el.remove();
    }, r_time * 1000);
  }, 800);

  // --- Konami Code Easter Egg ---
  // Up, Up, Down, Down, Left, Right, Left, Right, B, A
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  $(document).keydown(function(e) {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        // Trigger Easter Egg
        $('#konamiModal').fadeIn().css('display', 'flex');
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 }
        });
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  $('.close-modal').click(function() {
    $('#konamiModal').fadeOut();
  });

  $(window).click(function(e) {
    if ($(e.target).hasClass('modal')) {
      $('#konamiModal').fadeOut();
    }
  });

  // --- SCRATCH CARD LOGIC ---
  const canvas = document.getElementById('scratchCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('scratchCardWrapper');
    let isDrawing = false;

    // Set canvas size to match wrapper
    function resizeCanvas() {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
      ctx.fillStyle = '#b0bec5'; // Silver color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text "Raspe Aqui"
      ctx.font = '20px Montserrat';
      ctx.fillStyle = '#607d8b';
      ctx.textAlign = 'center';
      ctx.fillText('Raspe Aqui', canvas.width / 2, canvas.height / 2);
    }

    // Initial resize
    resizeCanvas();

    // Randomize Prize
    const prizes = [
        "Vale um Beijo Apaixonado!",
        "Vale um Jantar Romântico!",
        "Vale uma Massagem!",
        "Vale um Cinema em Casa!",
        "Vale um Desejo a sua Escolha!"
    ];
    $('#scratchPrizeText').text(prizes[Math.floor(Math.random() * prizes.length)]);

    function getMousePos(canvas, evt) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (evt.clientX || evt.touches[0].clientX) - rect.left,
        y: (evt.clientY || evt.touches[0].clientY) - rect.top
      };
    }

    function scratch(e) {
      if (!isDrawing) return;
      e.preventDefault(); // Prevent scroll on touch
      const pos = getMousePos(canvas, e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Events
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mouseleave', () => { isDrawing = false; });

    // Touch support
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, {passive: false});
    canvas.addEventListener('touchmove', (e) => { scratch(e); }, {passive: false});
    canvas.addEventListener('touchend', () => { isDrawing = false; });
  }

  // --- LOVE CALCULATOR LOGIC ---
  $('#calcBtn').click(function() {
     const name1 = $('#calcName1').val();
     const name2 = $('#calcName2').val();

     if(name1.trim() === "" || name2.trim() === "") {
        alert("Por favor, preencha os dois nomes!");
        return;
     }

     const resultEl = $('#calcResult');
     resultEl.text('Calculando...');

     let percentage = 0;
     const interval = setInterval(() => {
        percentage += Math.floor(Math.random() * 10) + 5; // Faster increment
        if(percentage > 100) percentage = 100;
        resultEl.text(percentage + '%');

        if(percentage === 100) {
           clearInterval(interval);
           setTimeout(() => {
              resultEl.html('<span style="font-size: 4rem;">∞%</span><br><span style="font-size: 1.5rem;">Almas Gêmeas!</span>');
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#e91e63', '#ffeb3b']
              });
           }, 500);
        }
     }, 50); // Faster interval
  });

  // --- LOVE QUIZ LOGIC ---
  const quizQuestions = [
    { q: "Qual é o meu lugar favorito no mundo?", options: ["Paris", "Praia", "Ao seu lado", "Em casa"], correct: 2 },
    { q: "O que eu mais amo em você?", options: ["Seu sorriso", "Seu abraço", "Tudo", "Seu cheiro"], correct: 2 }, // "Tudo" is usually the safe bet!
    { q: "Quando nossa história começou?", options: ["2020", "2021", "2022", "2023"], correct: 2 }, // Based on timers (July 2022)
    { q: "Qual a palavra que nos define?", options: ["Amor", "Cumplicidade", "Destino", "Eternidade"], correct: 3 } // Picking Eternidade based on "Eternizando"
  ];

  let currentQuestion = 0;
  let score = 0;

  function loadQuiz() {
      if (currentQuestion >= quizQuestions.length) {
          $('#quiz-box').hide();
          $('#quizResult').html(`Você acertou ${score} de ${quizQuestions.length}!<br>Você me conhece tão bem! ❤️`);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          return;
      }

      const q = quizQuestions[currentQuestion];
      $('#quizQuestion').text(q.q);
      const optsDiv = $('#quizOptions');
      optsDiv.empty();

      q.options.forEach((opt, index) => {
          optsDiv.append(`<button class="quiz-btn" onclick="checkAnswer(${index})">${opt}</button>`);
      });
  }

  // Make checkAnswer global so onclick works
  window.checkAnswer = function(selectedIndex) {
      const q = quizQuestions[currentQuestion];
      const buttons = $('.quiz-btn');

      if (selectedIndex === q.correct) {
          $(buttons[selectedIndex]).addClass('correct');
          score++;
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      } else {
          $(buttons[selectedIndex]).addClass('wrong');
          // Highlight correct one
          $(buttons[q.correct]).addClass('correct');
      }

      // Disable all buttons
      buttons.prop('disabled', true);

      setTimeout(() => {
          currentQuestion++;
          loadQuiz();
      }, 1500);
  };

  // Initialize Quiz if element exists
  if ($('#quiz-box').length) {
     loadQuiz();
  }

  // --- STARFIELD BACKGROUND ---
  const starCanvas = document.getElementById('starfield');
  if (starCanvas) {
      const starCtx = starCanvas.getContext('2d');
      let stars = [];
      const numStars = 80;
      let width, height;

      function resizeStars() {
          width = window.innerWidth;
          height = window.innerHeight;
          starCanvas.width = width;
          starCanvas.height = height;
      }

      class Star {
          constructor() {
              this.x = Math.random() * width;
              this.y = Math.random() * height;
              this.vx = (Math.random() - 0.5) * 0.2;
              this.vy = (Math.random() - 0.5) * 0.2;
              this.size = Math.random() * 2;
          }
          update() {
              this.x += this.vx;
              this.y += this.vy;
              if (this.x < 0) this.x = width;
              if (this.x > width) this.x = 0;
              if (this.y < 0) this.y = height;
              if (this.y > height) this.y = 0;
          }
          draw() {
              starCtx.fillStyle = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.3) + ')';
              starCtx.beginPath();
              starCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              starCtx.fill();
          }
      }

      function initStars() {
          resizeStars();
          for(let i=0; i<numStars; i++) stars.push(new Star());
          animateStars();
      }

      function animateStars() {
          starCtx.clearRect(0, 0, width, height);

          // Update and Draw Stars
          stars.forEach(star => {
              star.update();
              star.draw();
          });

          // Draw Constellations (Connections)
          starCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          starCtx.lineWidth = 0.5;
          for (let i = 0; i < stars.length; i++) {
              for (let j = i + 1; j < stars.length; j++) {
                  const dx = stars[i].x - stars[j].x;
                  const dy = stars[i].y - stars[j].y;
                  const dist = Math.sqrt(dx * dx + dy * dy);

                  if (dist < 100) {
                      starCtx.beginPath();
                      starCtx.moveTo(stars[i].x, stars[i].y);
                      starCtx.lineTo(stars[j].x, stars[j].y);
                      starCtx.stroke();
                  }
              }
          }

          requestAnimationFrame(animateStars);
      }

      window.addEventListener('resize', resizeStars);
      initStars();
  }

});
