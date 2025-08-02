document.addEventListener('DOMContentLoaded', function() {
    // Fireworks animation
    function showFireworks() {
        let canvas = document.getElementById('fireworks-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'fireworks-canvas';
            canvas.style.position = 'fixed';
            canvas.style.left = 0;
            canvas.style.top = 0;
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = 1000;
            document.body.appendChild(canvas);
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let ctx = canvas.getContext('2d');
        let particles = [];
        let colors = ['#FFD700','#FF6347','#00BFFF','#32CD32','#FF69B4','#B87333','#8B4513'];
        function createFirework() {
            let x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
            let y = Math.random() * canvas.height * 0.4 + canvas.height * 0.2;
            let color = colors[Math.floor(Math.random()*colors.length)];
            for (let i = 0; i < 32; i++) {
                let angle = (Math.PI * 2 * i) / 32;
                let speed = Math.random() * 3 + 2;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color
                });
            }
        }
        let frame = 0;
        function animate() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            particles.forEach(p => {
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
                ctx.fillStyle = p.color;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.alpha -= 0.015;
            });
            particles = particles.filter(p => p.alpha > 0);
            if (frame % 20 === 0 && frame < 60) createFirework();
            frame++;
            if (frame < 120 || particles.length > 0) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        }
        animate();
    }
    const coin = document.getElementById('coin');
    const resultDiv = document.getElementById('result');
    const playerNamesArea = document.getElementById('playerNamesArea');
    const tournamentArea = document.getElementById('tournamentArea');

    const headsSVG = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="copper-gradient-h" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#FFDAB9"/>
          <stop offset="60%" stop-color="#B87333"/>
          <stop offset="100%" stop-color="#8B4513"/>
        </radialGradient>
        <linearGradient id="edge-gradient-h" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFDAB9"/>
          <stop offset="100%" stop-color="#8B4513"/>
        </linearGradient>
      </defs>
      <g class="coin">
        <circle cx="50" cy="50" r="40" fill="url(#copper-gradient-h)" stroke="url(#edge-gradient-h)" stroke-width="4"/>
        <ellipse cx="50" cy="50" rx="34" ry="12" fill="rgba(255,255,255,0.13)"/>
        <text x="50" y="62" text-anchor="middle" font-size="40" fill="#8B4513" font-family="Arial" font-weight="bold">H</text>
      </g>
    </svg>`;
    const tailsSVG = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="copper-gradient-t" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#FFDAB9"/>
          <stop offset="60%" stop-color="#B87333"/>
          <stop offset="100%" stop-color="#8B4513"/>
        </radialGradient>
        <linearGradient id="edge-gradient-t" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFDAB9"/>
          <stop offset="100%" stop-color="#8B4513"/>
        </linearGradient>
      </defs>
      <g class="coin">
        <circle cx="50" cy="50" r="40" fill="url(#copper-gradient-t)" stroke="url(#edge-gradient-t)" stroke-width="4"/>
        <ellipse cx="50" cy="50" rx="34" ry="12" fill="rgba(255,255,255,0.13)"/>
        <text x="50" y="62" text-anchor="middle" font-size="40" fill="#8B4513" font-family="Arial" font-weight="bold">T</text>
      </g>
    </svg>`;

    function showCoin(face) {
        coin.innerHTML = face === 'heads' ? headsSVG : tailsSVG;
    }

    let players = [];
    let round = 1;
    let currentMatch = 0;
    let roundPlayers = [];
    let playerFields = [];
    let prevNames = [];
    try {
        prevNames = JSON.parse(localStorage.getItem('coinFlipPlayerNames_dynamic')) || [];
    } catch {}
    let initialPlayers = prevNames.length > 0 ? prevNames.length : 4;
    function renderPlayerFields() {
        function getCurrentInputValues() {
            // Only select text inputs for player names
            const oldInputs = playerNamesArea.querySelectorAll('input[type="text"]');
            return Array.from(oldInputs).map((inp, idx) => inp ? inp.value : playerFields[idx]);
        }
        playerNamesArea.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        playerFields.forEach((field, i) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = prevNames[i] || `Player ${i+1}`;
            input.value = field || '';
            input.required = true;
            input.style.marginRight = '8px';
            input.style.textAlign = '';
            div.appendChild(input);
            if (playerFields.length > 2) {
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '-';
                removeBtn.type = 'button';
                removeBtn.onclick = function() {
                    let values = getCurrentInputValues();
                    values.splice(i, 1);
                    playerFields = values;
                    renderPlayerFields();
                };
                div.appendChild(removeBtn);
            }
            wrapper.appendChild(div);
        });
        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.type = 'button';
        addBtn.onclick = function() {
            let values = getCurrentInputValues();
            values.push('');
            playerFields = values;
            renderPlayerFields();
        };
        wrapper.appendChild(addBtn);
        wrapper.appendChild(document.createElement('br'));
        // Add game mode radio buttons in vertical layout with inline descriptions
        const modeDiv = document.createElement('div');
        modeDiv.style.margin = '10px 0';
        modeDiv.style.display = 'flex';
        modeDiv.style.flexDirection = 'column';
        modeDiv.style.alignItems = 'flex-start';
        modeDiv.style.justifyContent = 'flex-start';
        modeDiv.style.gap = '8px';

        // Title
        const modeLabel = document.createElement('span');
        modeLabel.textContent = 'Play to:';
        modeLabel.style.fontWeight = 'bold';
        modeLabel.style.marginBottom = '6px';
        modeDiv.appendChild(modeLabel);

        // Win mode radio and label (with description inline)
        const winRow = document.createElement('div');
        winRow.style.display = 'flex';
        winRow.style.alignItems = 'center';
        const winRadio = document.createElement('input');
        winRadio.type = 'radio';
        winRadio.name = 'gameMode';
        winRadio.id = 'gameModeWin';
        winRadio.value = 'winner';
        winRadio.checked = true;
        const winLabel = document.createElement('label');
        winLabel.htmlFor = 'gameModeWin';
        winLabel.textContent = 'Win (Winner progresses)';
        winLabel.style.marginLeft = '6px';
        winLabel.style.fontWeight = '500';
        winRow.appendChild(winRadio);
        winRow.appendChild(winLabel);
        modeDiv.appendChild(winRow);

        // Lose mode radio and label (with description inline)
        const loseRow = document.createElement('div');
        loseRow.style.display = 'flex';
        loseRow.style.alignItems = 'center';
        const loseRadio = document.createElement('input');
        loseRadio.type = 'radio';
        loseRadio.name = 'gameMode';
        loseRadio.id = 'gameModeLose';
        loseRadio.value = 'loser';
        const loseLabel = document.createElement('label');
        loseLabel.htmlFor = 'gameModeLose';
        loseLabel.textContent = 'Lose (Loser progresses)';
        loseLabel.style.marginLeft = '6px';
        loseLabel.style.fontWeight = '500';
        loseRow.appendChild(loseRadio);
        loseRow.appendChild(loseLabel);
        modeDiv.appendChild(loseRow);
        wrapper.appendChild(modeDiv);
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Begin Tournament';
        startBtn.type = 'button';
        startBtn.onclick = function() {
            // Only select text inputs for player names
            const inputs = wrapper.querySelectorAll('input[type="text"]');
            players = Array.from(inputs).map(inp => inp.value.trim() || inp.placeholder);
            localStorage.setItem('coinFlipPlayerNames_dynamic', JSON.stringify(players));
            playerNamesArea.innerHTML = '';
            // Store game mode in a variable
            const selectedMode = wrapper.querySelector('input[name="gameMode"]:checked').value;
            window.coinFlipGameMode = selectedMode;
            startTournament();
        };
        wrapper.appendChild(startBtn);
        playerNamesArea.appendChild(wrapper);
    }
    playerFields = Array(initialPlayers).fill('');
    for (let i = 0; i < prevNames.length; i++) {
        playerFields[i] = prevNames[i];
    }
    renderPlayerFields();

    let selectedSide = null;
    function startTournament() {
        round = 1;
        roundPlayers = [...players].sort(() => Math.random() - 0.5);
        currentMatch = 0;
        tournamentArea.innerHTML = '';
        coin.style.display = '';
        resultDiv.textContent = '';
        showCoin('heads');
        selectedSide = null;
        showBracket();
        showNextMatch();
    }

    function promptSideSelection() {
        resultDiv.innerHTML = `${roundPlayers[0]}, choose your side: ` +
            `<button id="chooseHeads">Heads</button> <button id="chooseTails">Tails</button>`;
        document.getElementById('chooseHeads').onclick = function() {
            selectedSide = 'heads';
            showNextMatch();
        };
        document.getElementById('chooseTails').onclick = function() {
            selectedSide = 'tails';
            showNextMatch();
        };
    }

    // Store bracket history for diagram
    let bracketHistory = [];
    function showBracket() {
        if (roundPlayers.length > 1 && !bracketHistory[round-1]) {
            let roundMatches = [];
            for (let i = 0; i < roundPlayers.length; i += 2) {
                roundMatches.push({
                    p1: roundPlayers[i],
                    p2: roundPlayers[i+1] || '(bye)',
                    winner: null
                });
            }
            bracketHistory[round-1] = roundMatches;
        }

        let html = `<div class="bracket-diagram">`;
        for (let r = 0; r < bracketHistory.length; r++) {
            if (bracketHistory[r].length === 1 && bracketHistory[r][0].p2 === '(bye)') continue;
            html += `<div class="bracket-round" style="text-align:center;margin-bottom:1em;"><strong>Round ${r+1}</strong><ul style="list-style:none;padding:0;margin:0;">`;
            for (let m = 0; m < bracketHistory[r].length; m++) {
                const match = bracketHistory[r][m];
                html += `<li style="display:flex;align-items:center;justify-content:center;gap:6px;">${match.p1} vs ${match.p2}`;
                if (match.winner) {
                    html += ` <span style="color:green;display:flex;align-items:center;gap:2px;"><span style="font-size:1.2em;">→</span> <span>${match.winner}</span></span>`;
                }
                html += `</li>`;
            }
            html += `</ul></div>`;
        }
        html += `</div>`;
        tournamentArea.innerHTML = html;
    }

    function showNextMatch() {
        let matchesThisRound = Math.floor(roundPlayers.length / 2);
        let hasBye = roundPlayers.length % 2 === 1;
        if (currentMatch >= matchesThisRound * 2) {
            if (hasBye) {
                nextRoundPlayers.push(roundPlayers[roundPlayers.length - 1]);
            }
            if (nextRoundPlayers.length === 1) {
                // Delay winner/loser announcement until after coin flip animation
                setTimeout(() => {
                    const mode = window.coinFlipGameMode || 'winner';
                    if (mode === 'winner') {
                        resultDiv.textContent = `🏆 Winner: ${nextRoundPlayers[0]}!`;
                        coin.style.display = 'none';
                        showFireworks();
                    } else {
                        resultDiv.textContent = `💀 Loser: ${nextRoundPlayers[0]}!`;
                        coin.style.display = 'none';
                        // For Lose mode, just show the result message, no animation
                    }
                }, 700); // Match coin flip animation duration
                return;
    // Humorous sad panda animation for Lose mode
            }
            round++;
            roundPlayers = nextRoundPlayers;
            currentMatch = 0;
            nextRoundPlayers = [];
            showBracket();
            showNextMatch();
            return;
        }
        if (roundPlayers.length > 1) {
            promptSideSelectionForMatch(currentMatch);
        } else {
            resultDiv.innerHTML = '';
        }
    }

    function promptSideSelectionForMatch(matchIdx) {
        // First player always chooses
        let chooser = roundPlayers[matchIdx];
        let opponent = roundPlayers[matchIdx + 1];
        resultDiv.innerHTML = `${chooser} select: <br>` +
            `<button id="chooseHeads">Heads</button> <button id="chooseTails">Tails</button>`;
        coin.onclick = null;
        document.getElementById('chooseHeads').onclick = function() {
            selectedSide = 'heads';
            playMatch(matchIdx, matchIdx);
        };
        document.getElementById('chooseTails').onclick = function() {
            selectedSide = 'tails';
            playMatch(matchIdx, matchIdx);
        };
    }

    let nextRoundPlayers = [];
    function playMatch(matchIdx, chooserIdx) {
        coin.onclick = null;
        coin.classList.add('flipping');
        let flips = 8;
        let interval = 600 / flips;
        let currentFace = 'heads';
        let i = 0;
        const flipInterval = setInterval(() => {
            currentFace = currentFace === 'heads' ? 'tails' : 'heads';
            showCoin(currentFace);
            i++;
            if (i >= flips) {
                clearInterval(flipInterval);
                const isHeads = Math.random() < 0.5;
                showCoin(isHeads ? 'heads' : 'tails');
                let chooser = roundPlayers[chooserIdx];
                let opponent = roundPlayers[matchIdx + (chooserIdx === matchIdx ? 1 : 0)];
                let progresses;
                const mode = window.coinFlipGameMode || 'winner';
                if (mode === 'winner') {
                    // Winner of toss progresses
                    progresses = (selectedSide === 'heads' && isHeads) || (selectedSide === 'tails' && !isHeads) ? chooser : opponent;
                } else {
                    // Loser of toss progresses
                    progresses = (selectedSide === 'heads' && isHeads) || (selectedSide === 'tails' && !isHeads) ? opponent : chooser;
                }
                coin.classList.remove('flipping');
                // Show coin result, then delay before announcing winner/loser
                setTimeout(() => {
                    if (mode === 'winner') {
                        resultDiv.innerHTML = `${progresses} won!</b>`;
                    } else {
                        resultDiv.innerHTML = `${progresses} lost and progresses!`;
                    }
                    if (nextRoundPlayers.length < Math.ceil(roundPlayers.length/2)) {
                        nextRoundPlayers.push(progresses);
                    }
                    if (bracketHistory[round-1] && bracketHistory[round-1][Math.floor(matchIdx/2)]) {
                        bracketHistory[round-1][Math.floor(matchIdx/2)].winner = progresses;
                    }
                    currentMatch += 2;
                    setTimeout(() => {
                        showBracket();
                        showNextMatch();
                    }, 2000);
                }, 1800); // Increased delay after coin stops before showing result
            }
        }, interval);
    }

    showCoin('heads');
    coin.style.display = 'none';
});