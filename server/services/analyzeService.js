const fetch = require("node-fetch");
const Groq = require("groq-sdk");

const analyzeImage = async (imageUrl) => {
    try {
        // Step 1: Send the image URL to Hugging Face's BLIP model
        const blipResponse = await fetch(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: imageUrl }), // Send the image URL
            }
        );

        // Step 2: Parse the API response
        const blipResult = await blipResponse.json();

        // Log the full API response for debugging
        console.log("Hugging Face API Response:", blipResult);

        // Handle API errors
        if (blipResult.error) {
            console.error("Hugging Face API Error:", blipResult.error);
            return null;
        }

        // Step 3: Extract the generated caption
        const description = blipResult[0].generated_text;

        // Step 4: Refine the description using Llama (Groq Cloud)
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Refine this image description for an Instagram post: ${description}`,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 1,
            max_completion_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        // Step 5: Extract the refined description from the Llama response
        const refinedDescription = chatCompletion.choices[0]?.message?.content || description;

        // Return the refined description
        return refinedDescription;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return null;
    }
};

module.exports = { analyzeImage };