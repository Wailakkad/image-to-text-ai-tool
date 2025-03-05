const fetch = require("node-fetch");
const Groq = require("groq-sdk");

const analyzeImage = async (imageUrl, option, parameters = {}) => {
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
        
        // Initialize Groq
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        // Step 4: Generate descriptions based on option and parameters
        let generatedDescriptions;
        
        switch(option.toLowerCase()) {
            case 'ecommerce':
                generatedDescriptions = await Promise.all([
                    // Description based on selected type
                    groq.chat.completions.create({
                        messages: [{ 
                            role: "user", 
                            content: `Image Description: "${description}"
                            
                            Create a ${parameters.descriptionType || 'sales pitch'} style description for a product.
                            
                            Key Details:
                            - Target Audience: ${parameters.targetAudience || 'general consumers'}
                            - Tone: ${parameters.tone || 'professional'}
                            
                            Generate a description that appeals to ${parameters.targetAudience || 'potential buyers'}, 
                            using a ${parameters.tone || 'professional'} tone.` 
                        }],
                        model: "llama-3.3-70b-versatile",
                        temperature: parameters.tone === 'luxurious' ? 0.5 : 0.7,
                        max_completion_tokens: 700,
                        top_p: 1,
                        stream: false,
                    }),
                    // Emotional/storytelling description
                    groq.chat.completions.create({
                        messages: [{ 
                            role: "user", 
                            content: `Image Description: "${description}"
                            
                            Create a storytelling product description that connects emotionally with ${parameters.targetAudience || 'potential buyers'}.
                            
                            Key Details:
                            - Narrative Style: Emotionally engaging
                            - Target Audience: ${parameters.targetAudience || 'general consumers'}
                            - Tone: ${parameters.tone || 'professional'}
                            
                            Craft a narrative that resonates with ${parameters.targetAudience || 'the target market'}.` 
                        }],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.8,
                        max_completion_tokens: 700,
                        top_p: 1,
                        stream: false,
                    }),
                    // Technical/benefit-driven description
                    groq.chat.completions.create({
                        messages: [{ 
                            role: "user", 
                            content: `Image Description: "${description}"
                            
                            Create a technical description highlighting product benefits.
                            
                            Key Details:
                            - Focus: Technical specifications and key benefits
                            - Target Audience: ${parameters.targetAudience || 'tech-savvy consumers'}
                            - Tone: ${parameters.tone || 'professional'}
                            
                            Provide detailed insights that would appeal to ${parameters.targetAudience || 'potential buyers'}.` 
                        }],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.6,
                        max_completion_tokens: 700,
                        top_p: 1,
                        stream: false,
                    })
                ]);
                break;
                
            case 'social':
                generatedDescriptions = await Promise.all([
                    // Platform-specific social media post
                    groq.chat.completions.create({
                        messages: [{ 
                            role: "user", 
                            content: `Image Description: "${description}"
                            
                            Create a social media post for ${parameters.platform || 'Instagram'}.
                            
                            Key Details:
                            - Platform: ${parameters.platform || 'Instagram'}
                            - Tone: ${parameters.tone || 'casual'}
                            - Emoji Usage: ${parameters.includeEmojis ? 'Include emojis' : 'No emojis'}
                            
                            Craft a post that suits ${parameters.platform || 'the selected platform'}
                            with a ${parameters.tone || 'casual'} tone.
                            
                            ${parameters.includeEmojis ? 'Use fun and relevant emojis.' : ''}` 
                        }],
                        model: "llama-3.3-70b-versatile",
                        temperature: 1.0,
                        max_completion_tokens: 500,
                        top_p: 1,
                        stream: false,
                    }),
                    // Alternate tone social media post
                    groq.chat.completions.create({
                        messages: [{ 
                            role: "user", 
                            content: `Image Description: "${description}"
                            
                            Create a social media post with a specific tone.
                            
                            Key Details:
                            - Platform: ${parameters.platform || 'Social Media'}
                            - Tone: ${parameters.tone || 'inspirational'}
                            - Emoji Usage: ${parameters.includeEmojis ? 'Include emojis' : 'No emojis'}
                            
                            Generate a post that embodies a ${parameters.tone || 'inspirational'} approach.
                            
                            ${parameters.includeEmojis ? 'Use emotionally resonant emojis.' : ''}` 
                        }],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.9,
                        max_completion_tokens: 500,
                        top_p: 1,
                        stream: false,
                    }),
                    // Hashtag generation
                    groq.chat.completions.create({
                        messages: [{ 
                            role: "user", 
                            content: `Image Description: "${description}"
                            
                            Generate hashtags for social media.
                            
                            Key Details:
                            - Platform: ${parameters.platform || 'Social Media'}
                            - Custom Hashtags: ${parameters.customHashtags || 'Auto-generate'}
                            
                            ${parameters.customHashtags ? 
                                `Include these custom hashtags: ${parameters.customHashtags}` : 
                                'Create trending and relevant hashtags based on the image description.'
                            }` 
                        }],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.7,
                        max_completion_tokens: 300,
                        top_p: 1,
                        stream: false,
                    })
                ]);
                break;
                
            default:
                return { 
                    error: "Invalid option. Please use 'social' or 'ecommerce'.",
                    supportedOptions: ['social', 'ecommerce']
                };
        }
        
        // Extract the generated descriptions
        const finalDescriptions = generatedDescriptions.map(
            desc => desc.choices[0]?.message?.content || "No description generated"
        );
        
        // Log success
        console.log(`Descriptions generated for ${option} successfully`);
        
        // Return the descriptions
        return {
            originalCaption: description,
            descriptions: option.toLowerCase() === 'ecommerce' 
                ? {
                    description1: finalDescriptions[0],
                    description2: finalDescriptions[1],
                    description3: finalDescriptions[2]
                }
                : {
                    description1: finalDescriptions[0],
                    description2: finalDescriptions[1],
                    hashtags: finalDescriptions[2]
                }
        };
        
    } catch (error) {
        console.error("Error analyzing image:", error);
        return { 
            error: error.message || "Unknown error occurred",
            supportedOptions: ['social', 'ecommerce']
        };
    }
};

module.exports = { analyzeImage };