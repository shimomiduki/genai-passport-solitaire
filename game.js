// ===== 用語ソリティア ゲームロジック =====

const $ = (sel) => document.querySelector(sel);

const state = {
  category: "all",
  difficulty: "normal",
  deck: [],          // 残りのペア
  board: [],         // 場札のカード {uid, type, term, meaning, pairId, el}
  selected: null,    // 選択中カード
  locked: false,     // 入力ロック中
  score: 0,
  chain: 0,
  maxChain: 0,
  correct: 0,
  miss: 0,
  startTime: 0,
  timeLeft: 0,       // 連鎖タイマー（秒）
  timeMax: 0,
  timer: null,
  totalPairs: 0,
};

// ---------- 画面遷移 ----------
function show(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + screenId).classList.add("active");
}

// ---------- スタート画面の構築 ----------
function buildStartScreen() {
  const catList = $("#category-list");
  catList.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip" + (c.id === state.category ? " selected" : "");
    b.innerHTML = `<span class="ico">${c.icon}</span>${c.label}`;
    b.onclick = () => {
      state.category = c.id;
      catList.querySelectorAll(".chip").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
    };
    catList.appendChild(b);
  });

  const diffList = $("#difficulty-list");
  diffList.innerHTML = "";
  DIFFICULTIES.forEach((d) => {
    const b = document.createElement("button");
    b.className = "chip" + (d.id === state.difficulty ? " selected" : "");
    b.textContent = d.label;
    b.onclick = () => {
      state.difficulty = d.id;
      diffList.querySelectorAll(".chip").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
    };
    diffList.appendChild(b);
  });
}

// ---------- ユーティリティ ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- ゲーム開始 ----------
function startGame() {
  const diff = DIFFICULTIES.find((d) => d.id === state.difficulty);
  let pool = TERM_DATA.filter(
    (t) => state.category === "all" || t.category === state.category
  );
  pool = shuffle(pool);

  // 出題ペア数（最大24ペアまで）
  const totalPairs = Math.min(pool.length, 24);
  const chosen = pool.slice(0, totalPairs).map((t, i) => ({
    pairId: i,
    term: t.term,
    meaning: t.meaning,
  }));

  state.deck = shuffle(chosen);
  state.board = [];
  state.selected = null;
  state.locked = false;
  state.score = 0;
  state.chain = 0;
  state.maxChain = 0;
  state.correct = 0;
  state.miss = 0;
  state.totalPairs = totalPairs;
  state.timeMax = diff.time;
  state.startTime = Date.now();

  $("#board").innerHTML = "";
  // 初期場札を埋める
  fillBoard(diff.pairs);
  updateHUD();
  startTimer();
  show("screen-game");
}

// ---------- 場札を補充 ----------
function fillBoard(maxPairsOnBoard) {
  const onBoardPairs = state.board.length / 2;
  let need = maxPairsOnBoard - onBoardPairs;
  const newCards = [];
  while (need > 0 && state.deck.length > 0) {
    const p = state.deck.pop();
    const termCard = { uid: "t" + p.pairId, type: "term", text: p.term, pairId: p.pairId };
    const meanCard = { uid: "m" + p.pairId, type: "meaning", text: p.meaning, pairId: p.pairId };
    newCards.push(termCard, meanCard);
    need--;
  }
  // 既存の残りカード＋新カードを混ぜて並べ替え
  state.board = shuffle(state.board.concat(newCards));
  renderBoard();
}

// ---------- 盤面描画 ----------
function renderBoard() {
  const board = $("#board");
  board.innerHTML = "";
  state.board.forEach((card) => {
    const el = document.createElement("div");
    el.className = "card " + card.type;
    el.innerHTML =
      `<span class="tag">${card.type === "term" ? "用語" : "意味"}</span>` +
      `<span>${card.text}</span>`;
    el.onclick = () => onCardTap(card, el);
    card.el = el;
    if (state.selected && state.selected.uid === card.uid) el.classList.add("selected");
    board.appendChild(el);
  });
}

// ---------- カードタップ ----------
function onCardTap(card, el) {
  if (state.locked) return;
  if (state.selected && state.selected.uid === card.uid) {
    // 選択解除
    state.selected = null;
    el.classList.remove("selected");
    return;
  }
  if (!state.selected) {
    state.selected = card;
    el.classList.add("selected");
    return;
  }
  // 2枚目 — 同じタイプ同士は不可（用語×意味のみ）
  if (state.selected.type === card.type) {
    state.selected.el.classList.remove("selected");
    state.selected = card;
    el.classList.add("selected");
    return;
  }

  // 判定
  const first = state.selected;
  if (first.pairId === card.pairId) {
    handleCorrect(first, card);
  } else {
    handleMiss(first, card);
  }
}

// ---------- 正解 ----------
function handleCorrect(a, b) {
  state.locked = true;
  state.chain++;
  state.maxChain = Math.max(state.maxChain, state.chain);
  state.correct++;

  const gain = 100 * state.chain;
  state.score += gain;

  // タイマー回復
  state.timeLeft = Math.min(state.timeMax, state.timeLeft + 1.2);

  a.el.classList.add("good");
  b.el.classList.add("good");
  state.selected = null;

  showToast(state.chain >= 2 ? `${state.chain}連鎖! +${gain}` : `+${gain}`, "var(--good)");
  updateHUD();

  setTimeout(() => {
    a.el.classList.add("removing");
    b.el.classList.add("removing");
    setTimeout(() => {
      // 盤面から除去
      state.board = state.board.filter((c) => c.uid !== a.uid && c.uid !== b.uid);
      const diff = DIFFICULTIES.find((d) => d.id === state.difficulty);
      fillBoard(diff.pairs);
      state.locked = false;
      updateHUD();
      checkClear();
    }, 250);
  }, 300);
}

// ---------- おてつき ----------
function handleMiss(a, b) {
  state.locked = true;
  state.chain = 0;
  state.miss++;
  state.timeLeft = Math.max(0, state.timeLeft - 1.5); // ペナルティ

  a.el.classList.add("bad");
  b.el.classList.add("bad");
  showToast("おてつき", "var(--bad)");
  updateHUD();

  setTimeout(() => {
    a.el.classList.remove("bad", "selected");
    b.el.classList.remove("bad", "selected");
    state.selected = null;
    state.locked = false;
  }, 450);
}

// ---------- クリア判定 ----------
function checkClear() {
  if (state.board.length === 0 && state.deck.length === 0) {
    endGame(true);
  }
}

// ---------- HUD ----------
function updateHUD() {
  $("#hud-score").textContent = state.score;
  $("#hud-chain").textContent = state.chain;
  const remainPairs = state.deck.length + state.board.length / 2;
  $("#hud-remain").textContent = remainPairs;
}

// ---------- トースト ----------
function showToast(text, color) {
  const t = $("#toast");
  t.textContent = text;
  t.style.color = color;
  t.classList.remove("show");
  void t.offsetWidth; // reflow
  t.classList.add("show");
}

// ---------- タイマー（連鎖維持の砂時計） ----------
function startTimer() {
  stopTimer();
  state.timeLeft = state.timeMax;
  const bar = $("#timebar");
  state.timer = setInterval(() => {
    if (state.locked) return; // アニメ中は止める
    state.timeLeft -= 0.1;
    const ratio = Math.max(0, state.timeLeft / state.timeMax);
    bar.style.transform = `scaleX(${ratio})`;
    bar.classList.toggle("low", ratio < 0.3);
    if (state.timeLeft <= 0) {
      if (state.chain > 0) {
        // 連鎖が切れる
        state.chain = 0;
        updateHUD();
        showToast("連鎖切れ", "var(--meaning)");
      }
      state.timeLeft = state.timeMax;
    }
  }, 100);
}
function stopTimer() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
}

// ---------- 終了 ----------
function endGame(cleared) {
  stopTimer();
  const elapsed = (Date.now() - state.startTime) / 1000;
  const acc = state.correct + state.miss > 0
    ? Math.round((state.correct / (state.correct + state.miss)) * 100)
    : 100;

  // ランク判定
  let rank = "C";
  if (acc >= 95 && state.maxChain >= state.totalPairs * 0.6) rank = "S";
  else if (acc >= 85) rank = "A";
  else if (acc >= 70) rank = "B";

  $("#result-rank").textContent = rank;
  document.querySelector(".result-title").textContent = cleared ? "クリア！" : "終了";
  $("#result-score").textContent = state.score;
  $("#result-maxchain").textContent = state.maxChain;
  $("#result-acc").textContent = acc + "%";
  $("#result-time").textContent = elapsed.toFixed(1) + "s";

  show("screen-result");
}

// ---------- イベント登録 ----------
function init() {
  buildStartScreen();
  $("#btn-start").onclick = startGame;
  $("#btn-quit").onclick = () => { stopTimer(); show("screen-start"); };
  $("#btn-retry").onclick = startGame;
  $("#btn-home").onclick = () => { buildStartScreen(); show("screen-start"); };
}

init();
