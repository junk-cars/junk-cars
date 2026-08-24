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

// ==== Налаштування відправки заявок у Telegram ====
// Заявки йдуть не напряму в Telegram, а через Cloudflare Worker —
// це приховує токен бота від коду сайту. Вставте сюди адресу
// свого Worker'а (див. інструкцію, яку я надав окремо).
const WORKER_URL = "https://telegram-form-proxy.boris-pavlenko-92.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const modal = document.getElementById("successModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      modal.classList.remove("open");
    });
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("fieldName").value.trim();
    const phone = document.getElementById("fieldPhone").value.trim();
    const vin = document.getElementById("fieldVin").value.trim();
    const part = document.getElementById("fieldPart").value.trim();

    const text =
      "Нова заявка з сайту Chevrolet Bolt Parts:\n" +
      "Ім'я: " + (name || "-") + "\n" +
      "Телефон: " + (phone || "-") + "\n" +
      "VIN-код: " + (vin || "-") + "\n" +
      "Деталь: " + (part || "-");

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        form.reset();
        modal.classList.add("open");
      } else {
        alert("Не вдалося надіслати заявку. Спробуйте, будь ласка, ще раз або напишіть нам у Telegram.");
      }
    } catch (err) {
      alert("Не вдалося надіслати заявку. Перевірте з'єднання з інтернетом і спробуйте ще раз.");
    } finally {
      submitBtn.disabled = false;
    }
  });
});

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
