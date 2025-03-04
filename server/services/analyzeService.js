const fetch = require("node-fetch");
const Groq = require("groq-sdk");

const analyzeImage = async (imageUrl) => {
    try {
        // Step 1: Send the image URL to Hugging Face's BLIP model
        console.log("Requesting image description from Hugging Face...");
        const blipResponse = await fetch(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: imageUrl }),
            }
        );
        
        // Step 2: Parse the API response
        const blipResult = await blipResponse.json();
        
        // Handle API errors
        if (blipResult.error) {
            console.error("Hugging Face API Error:", blipResult.error);
            return { error: "Failed to generate image description" };
        }
        
        // Step 3: Extract the generated caption
        const description = blipResult[0].generated_text;
        console.log("Initial description:", description);
        
        // Step 4: Make parallel API calls to get distinct descriptions
        console.log("Generating descriptions in parallel...");
        
        const prompts = [
            // Casual prompt
            `Based on this image description: "${description}", create a casual, friendly Instagram caption with emojis. Keep it relatable and fun.`,
            
            // Poetic prompt
            `Based on this image description: "${description}", create a poetic, artistic Instagram caption that's thoughtful and evocative. Use vivid imagery and emotion.`,
            
            // Minimalist prompt (updated to be longer)
            `Based on this image description: "${description}", create a minimalist, trendy Instagram caption with relevant hashtags. Make it concise but impactful, while including a bit more detail to describe the mood, style, or essence of the image. Keep it stylish and modern.`
          ];
        
        // Initialize Groq once
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        // Create all API calls in parallel for better performance
        const descriptionResults = await Promise.all(
            prompts.map(prompt => 
                groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.9,
                    max_completion_tokens: 500,
                    top_p: 1,
                    stream: false,
                })
                .then(response => response.choices[0]?.message?.content || "No description generated")
                .catch(error => {
                    console.error("Error generating description:", error);
                    return "Error generating description";
                })
            )
        );
        
        // Log success
        console.log("All descriptions generated successfully");
        
        // Return the three descriptions
        return {
            description: {
                casual: descriptionResults[0],
                poetic: descriptionResults[1],
                minimalist: descriptionResults[2]
            }
        };
    } catch (error) {
        console.error("Error analyzing image:", error);
        return { error: error.message || "Unknown error occurred" };
    }
};

module.exports = { analyzeImage };