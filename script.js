"use strict";

const ASSETS_DIR = "assets";

const QUIZ = {
  title: "Plan a Purrfect Trip to Barcelona!",
  homeImage: "main.png",
  questions: [
    {
      image: "season.png",
      prompt: "What season will you travel?",
      options: [
        { label: "Spring", score: { T: 1, Y: 1 } },
        { label: "Summer", score: { T: 2 } },
        { label: "Fall", score: { B: 2 } },
        { label: "Winter", score: { Y: 2 } },
      ],
    },
    {
      image: "passport.png",
      prompt: "Where's your passport?",
      options: [
        { label: "Stored safely", score: { T: 2 } },
        { label: "Expired 2 years ago", score: { B: 1, Y: 1 } },
        { label: "Still in my suitcase", score: { B: 2 } },
        { label: "No idea...?", score: { Y: 2 } },
      ],
    },
    {
      image: "item.png",
      prompt: "Your essential travel item?",
      options: [
        { label: "A book", score: { T: 2 } },
        { label: "Neck pillow = naps", score: { B: 2 } },
        { label: "Noise canceling headphones", score: { Y: 2 } },
        { label: "Catnip... I mean snacks", score: { B: 1, Y: 1 } },
      ],
    },
    {
      image: "morning.png",
      prompt: "Morning routine on vacation?",
      options: [
        { label: "Up at 6am with a coffee in paw!", score: { B: 2 } },
        { label: "5 alarms later... still groggy", score: { T: 1, Y: 1 } },
        { label: "Morning? You mean noon-ish", score: { T: 2 } },
        { label: "Who sleeps in Barcelona anyway?", score: { Y: 2 } },
      ],
    },
    {
      image: "navigate.png",
      prompt: "How will you navigate?",
      options: [
        { label: "Google Maps forever", score: { T: 2 } },
        { label: "Wandering > planning", score: { B: 2 } },
        { label: "Ask locals (and pet every cat)", score: { B: 1, T: 1 } },
        { label: "I'm lost...", score: { Y: 2 } },
      ],
    },
    {
      image: "busy.png",
      prompt: "How busy will your days be?",
      options: [
        { label: "Jam packed! No siestas here", score: { T: 2 } },
        { label: "Busy, but with snack breaks", score: { B: 2 } },
        { label: "Easy breezy, no rush", score: { Y: 2 } },
        { label: "Depends on my mood, meow", score: { B: 1, T: 1 } },
      ],
    },
    {
      image: "food.png",
      prompt: "Adventurous with food?",
      options: [
        { label: "I'll try anything once", score: { B: 2 } },
        { label: "Looks good = I'm in", score: { Y: 2 } },
        { label: "My tummy is sensitive", score: { T: 1, Y: 1 } },
        { label: "Is that... octopus!?!?", score: { T: 2 } },
      ],
    },
    {
      image: "excited.png",
      prompt: "Most excited to...",
      options: [
        { label: "Admire the pretty cathedrals", score: { Y: 2 } },
        { label: "Catch a FC Barca soccer match", score: { B: 1, T: 1 } },
        { label: "Eat all the tapas and sip sangria", score: { B: 2 } },
        { label: "Get my steps in till my paws hurt", score: { T: 2 } },
      ],
    },
    {
      image: "evening.png",
      prompt: "Ideal evening?",
      options: [
        { label: "In bed by 8pm sharp", score: { T: 2 } },
        { label: "Hitting the nightlife", score: { B: 2 } },
        { label: "Chill show & bubble bath", score: { Y: 2 } },
        { label: "Midnight stroll with gelato", score: { B: 1, Y: 1 } },
      ],
    },
    {
      image: "souvenir.png",
      prompt: "What souvenir will you bring back?",
      options: [
        { label: "Messi jersey", score: { B: 2 } },
        { label: "Silly bull bobblehead", score: { B: 1, T: 1, Y: 1 } },
        { label: "Classic fridge magnet", score: { Y: 2 } },
        { label: "Fancy olive oil", score: { T: 2 } },
      ],
    },
  ],
  bonus: {
    image: "bonus.png",
    title: "Bonus round!",
    subtitle: "(Only displays if there is a tie)",
  },
  results: {
    B: {
      name: "Baron",
      image: "baron.png",
      title: "You got Baron!",
      text:
        "You are charming, dapper, and a bit mischievous. " +
        "You have a surprisingly strong maternal instinct, especially when someone is sick. " +
        "Rules are not really your thing, but you will jump through hoops for a treat!",
      extra: "Your favorite chore: Bathroom Cleaning",
    },
    T: {
      name: "Turnip",
      image: "turnip.png",
      title: "You got Turnip!",
      text:
        "You’re smart, sassy, and absolutely require luxury. " +
        "Cabinets are your own personal treasure chests, and no snack or toy escapes your inspection. " +
        "You are picky about food and even pickier about who earns your trust!",
      extra: "Your favorite person: Mommy ♡",
    },
    Y: {
      name: "Yuki",
      image: "yuki.png",
      title: "You got Yuki!",
      text:
        "You are ethereal, affectionate, and a little spacey. " +
        "You drift through life like a snowflake... until you trip over your own tail. " +
        "It may take time to coax you out from hiding, but once you show up, you are pure sweetness!",
      extra: "Your favorite animal: Frogs",
    },
  },
};

const screenEl = document.getElementById("screen");

const state = {
  index: -1,
  scores: { B: 0, T: 0, Y: 0 },
};

function asset(path) {
  return `${ASSETS_DIR}/${path}`;
}

function sumScores(delta) {
  for (const [k, v] of Object.entries(delta)) {
    if (!state.scores[k]) state.scores[k] = 0;
    state.scores[k] += v;
  }
}

function getWinners() {
  const entries = Object.entries(state.scores);
  const max = Math.max(...entries.map(([, v]) => v));
  const winners = entries.filter(([, v]) => v === max).map(([k]) => k);
  return { winners, max };
}

function bonusOptionsForTie(winners) {
  const set = new Set(winners);
  const opts = [];

  const add = (label, winnerKey) => opts.push({ label, winnerKey });

  if (set.size === 3) {
    add("Banana", "B");
    add("Mouse", "T");
    add("Pickle", "Y");
    return opts;
  }

  if (set.has("T") && set.has("Y")) {
    add("Mouse", "T");
    add("Pickle", "Y");
    return opts;
  }

  if (set.has("B") && set.has("T")) {
    add("Banana", "B");
    add("Mouse", "T");
    return opts;
  }

  if (set.has("B") && set.has("Y")) {
    add("Banana", "B");
    add("Pickle", "Y");
    return opts;
  }

  return opts;
}

function progressDots(activeIndex) {
  const total = QUIZ.questions.length;
  const dots = Array.from({ length: total }, (_, i) => {
    const cls = i === activeIndex ? "dot active" : "dot";
    return `<span class="${cls}" aria-hidden="true"></span>`;
  }).join("");
  return `<div class="progress" aria-label="Progress">${dots}</div>`;
}

function withTransition(renderFn) {
  screenEl.classList.add("is-fading");
  window.setTimeout(() => {
    renderFn();
    window.setTimeout(() => {
      screenEl.classList.remove("is-fading");
    }, 30);
  }, 180);
}

function renderHome() {
  state.index = -1;
  state.scores = { B: 0, T: 0, Y: 0 };

  screenEl.innerHTML = `
    <img class="top-image" src="${asset(QUIZ.homeImage)}" alt="Main image" />
    <div class="content">
      <h1 class="title">${escapeHtml(QUIZ.title)}</h1>
      <p class="subtle">Discover your inner cat!</p>
      <div class="footer-row">
        <button class="primary" id="startBtn" type="button">Start</button>
      </div>
    </div>
  `;

  document.getElementById("startBtn").addEventListener("click", () => {
    withTransition(() => renderQuestion(0));
  });
}

function renderQuestion(i) {
  state.index = i;
  const q = QUIZ.questions[i];

  screenEl.innerHTML = `
    <img class="top-image" src="${asset(q.image)}" alt="Question image" />
    <div class="content">
      ${progressDots(i)}
      <h2 class="prompt">${escapeHtml(q.prompt)}</h2>
      <div class="options" role="list">
        ${q.options
          .map(
            (opt, idx) => `
              <button class="option" type="button" data-idx="${idx}">
                ${escapeHtml(opt.label)}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  screenEl.querySelectorAll("button.option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      const chosen = q.options[idx];
      sumScores(chosen.score);

      const nextIndex = i + 1;
      if (nextIndex < QUIZ.questions.length) {
        withTransition(() => renderQuestion(nextIndex));
        return;
      }

      const { winners } = getWinners();
      if (winners.length === 1) {
        withTransition(() => renderResult(winners[0]));
      } else {
        withTransition(() => renderBonus(winners));
      }
    });
  });
}

function renderBonus(tiedKeys) {
  const opts = bonusOptionsForTie(tiedKeys);

  const tieLabel =
    tiedKeys.length === 3
      ? "(3 way tie)"
      : `(tie between ${tiedKeys.join(" and ")})`;

  screenEl.innerHTML = `
    <img class="top-image" src="${asset(QUIZ.bonus.image)}" alt="Bonus image" />
    <div class="content">
      <h2 class="prompt">${escapeHtml(QUIZ.bonus.title)} <span style="opacity:.9">${escapeHtml(
    tieLabel
  )}</span></h2>
      <p class="subtle">${escapeHtml(QUIZ.bonus.subtitle)}</p>
      <hr class="sep" />
      <h2 class="prompt" style="padding-top:0">Pick one:</h2>
      <div class="options">
        ${opts
          .map(
            (o) => `
              <button class="option" type="button" data-winner="${o.winnerKey}">
                ${escapeHtml(o.label)}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  screenEl.querySelectorAll("button.option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const winnerKey = btn.getAttribute("data-winner");
      withTransition(() => renderResult(winnerKey));
    });
  });
}

function renderResult(winnerKey) {
  const r = QUIZ.results[winnerKey];

  screenEl.innerHTML = `
    <img class="top-image" src="${asset(r.image)}" alt="${escapeHtml(
    r.name
  )} image" />
    <div class="content">
      <div class="result-block">
        <h2 class="result-title">${escapeHtml(r.title)}</h2>
        <p class="result-text">${escapeHtml(r.text)}</p>
        <p class="result-extra">${escapeHtml(r.extra)}</p>
      </div>

      <div class="footer-row" style="padding-top:12px">
        <button class="primary" id="restartBtn" type="button">Restart</button>
      </div>
    </div>
  `;

  document.getElementById("restartBtn").addEventListener("click", () => {
    withTransition(() => renderHome());
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderHome();






