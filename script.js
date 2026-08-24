// База деталей: українська назва, посилання на сторінку та варіанти назв
// (українською та російською) для пошуку.
const PARTS = [
  {
    name: "Високовольтна батарея",
    url: "battery.html",
    keywords: ["високовольтна батарея", "батарея", "акумулятор", "аку",
               "высоковольтная батарея", "батарейка", "аккумулятор", "акб"]
  },
  {
    name: "Двері та крила",
    url: "doors.html",
    keywords: ["двері", "двері та крила", "крило", "крила",
               "двери", "дверь", "крыло", "крылья"]
  },
  {
    name: "Фари та ліхтарі",
    url: "headlights.html",
    keywords: ["фари", "фара", "ліхтарі", "ліхтар",
               "фары", "фара", "фонари", "фонарь"]
  },
  {
    name: "Двигун та редуктор",
    url: "engine.html",
    keywords: ["двигун", "редуктор", "мотор",
               "двигатель", "редуктор", "мотор"]
  },
  {
    name: "Підвіска",
    url: "suspension.html",
    keywords: ["підвіска", "амортизатор", "важіль", "стійка",
               "подвеска", "амортизатор", "рычаг", "стойка"]
  },
  {
    name: "Салон",
    url: "salon.html",
    keywords: ["салон", "сидіння", "крісло", "торпедо",
               "салон", "сиденье", "сидения", "кресло", "торпеда"]
  }
];

function normalize(str) {
  return str.toLowerCase().trim();
}

function findMatches(query) {
  const q = normalize(query);
  if (!q) return [];
  const seen = new Set();
  const results = [];
  PARTS.forEach(part => {
    const hit = part.keywords.some(k => normalize(k).includes(q));
    if (hit && !seen.has(part.url)) {
      seen.add(part.url);
      results.push(part);
    }
  });
  return results;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("partSearch");
  const dropdown = document.getElementById("searchResults");
  if (!input || !dropdown) return;

  function renderDropdown(matches) {
    dropdown.innerHTML = "";
    if (matches.length === 0) {
      dropdown.classList.remove("open");
      return;
    }
    matches.forEach(part => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.textContent = part.name;
      item.addEventListener("click", () => {
        window.location.href = part.url;
      });
      dropdown.appendChild(item);
    });
    dropdown.classList.add("open");
  }

  input.addEventListener("input", () => {
    renderDropdown(findMatches(input.value));
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const matches = findMatches(input.value);
      if (matches.length > 0) {
        window.location.href = matches[0].url;
      }
    } else if (e.key === "Escape") {
      dropdown.classList.remove("open");
    }
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) renderDropdown(findMatches(input.value));
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.classList.remove("open");
    }
  });
});
