// api/gpt.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });
    const message = completion.choices?.[0]?.message?.content;
    if (!message) throw new Error("No message from OpenAI");
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
