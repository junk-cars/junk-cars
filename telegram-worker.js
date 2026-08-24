// Cloudflare Worker: приймає заявку з сайту і пересилає її в Telegram.
// Токен бота і chat_id зберігаються тут, на сервері Cloudflare,
// і НЕ потрапляють у код сайту — тому їх ніхто не побачить через F12.

export default {
  async fetch(request, env) {
    // Дозволяємо запити тільки методом POST
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    try {
      const data = await request.json();
      const text = data.text;

      if (!text || typeof text !== "string") {
        return new Response(JSON.stringify({ ok: false, error: "no text" }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      const tgUrl = "https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendMessage";
      const tgResponse = await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.CHAT_ID, text })
      });

      const tgResult = await tgResponse.json();

      return new Response(JSON.stringify({ ok: tgResult.ok === true }), {
        status: tgResponse.ok ? 200 : 502,
        headers: corsHeaders()
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: "server error" }), {
        status: 500,
        headers: corsHeaders()
      });
    }
  }
};

function corsHeaders() {
  return {
    // Замініть * на адресу вашого сайту на GitHub Pages для більшої безпеки,
    // наприклад: "https://username.github.io"
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}
