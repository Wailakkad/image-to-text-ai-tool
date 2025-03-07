const { Groq } = require("groq-sdk");

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Replace with your Groq API key
});

/**
 * Function to generate hashtags using Groq
 */
async function generateHashtagsWithGroq(text, numHashtags = 10, tone, audience, platform, keywords) {
  try {
    // Build the prompt with additional parameters
    let prompt = `Generate ${numHashtags} relevant hashtags for: ${text}\n`;
    if (tone) prompt += `- Tone: ${tone}\n`;
    if (audience) prompt += `- Target audience: ${audience}\n`;
    if (platform) prompt += `- Platform: ${platform}\n`;
    if (keywords) prompt += `- Include these keywords: ${keywords.join(", ")}\n`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile", // Replace with your preferred model
      temperature: 0.7, // Adjust for creativity
      max_tokens: 200, // Increase max_tokens to allow for a longer response
    });

    // Log the raw response for debugging
    console.log("Raw response:", chatCompletion);

    // Extract and clean the generated hashtags
    const generatedText = chatCompletion.choices[0].message.content.trim();
    const hashtags = generatedText
      .split("\n")
      .map((tag) => tag.trim().replace(/^\d+\.\s*/, "")) // Remove numbering if present
      .filter((tag) => tag);

    // Log the generated hashtags for debugging
    console.log("Generated hashtags:", hashtags);

    // Ensure we have the requested number of hashtags
    if (hashtags.length < numHashtags) {
      console.warn(`Expected ${numHashtags} hashtags, but got ${hashtags.length}`);
    }

    return hashtags;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to generate hashtags");
  }
}

const Hashtags = async (req, res) => {
  try {
    const { text, numHashtags, tone, audience, platform, keywords } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: "Missing 'text' field in request" });
    }

    // Generate hashtags using Groq
    const hashtags = await generateHashtagsWithGroq(
      text,
      numHashtags || 10,
      tone,
      audience,
      platform,
      keywords
    );

    // Return the response
    res.json({ hashtags });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = Hashtags;