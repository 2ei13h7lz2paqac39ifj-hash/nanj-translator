export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "あなたは翻訳AIです。入力された英語を、なんJ掲示板風の日本語（2ch風・煽り・ノリあり）に変換してください。意訳OK。自然なネット掲示板風にしてください。",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await response.json();

    const result = data?.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(500).json({ error: "No response from AI", data });
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
