const fetch = require("node-fetch");
const Groq = require("groq-sdk");

const analyzeBulkImages = async (imageUrls, option, parameters = {}) => {
    // Limit to 6 images
    const MAX_IMAGES = 6;
    const processingUrls = imageUrls.slice(0, MAX_IMAGES);

    try {
        // Validate input
        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return { 
                error: "Invalid input", 
                message: "Please provide a non-empty array of image URLs" 
            };
        }

        // Parallel image analysis
        const bulkAnalysisResults = await Promise.all(
            processingUrls.map(async (imageUrl, index) => {
                try {
                    // Step 1: Send the image URL to Hugging Face's BLIP model
                    console.log(`Requesting image description for image ${index + 1}...`);
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
                        console.error(`Hugging Face API Error for image ${index + 1}:`, blipResult.error);
                        return { 
                            imageUrl, 
                            error: "Failed to generate image description",
                            status: 'error'
                        };
                    }
                    
                    // Step 3: Extract the generated caption
                    const description = blipResult[0].generated_text;
                    console.log(`Initial description for image ${index + 1}:`, description);
                    
                    // Initialize Groq
                    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
                    
                    // Step 4: Generate descriptions based on option and parameters
                    let generatedDescriptions;
                    
                    switch (option.toLowerCase()) {
                        case 'ecommerce':
                          generatedDescriptions = await Promise.all([
                            // Description based on selected type (limited to 200 words)
                            groq.chat.completions.create({
                              messages: [{
                                role: "user",
                                content: `Image Description: "${description}"
                                
                                Create a ${parameters.descriptionType || 'sales pitch'} style description for a product.
                                
                                Key Details:
                                - Target Audience: ${parameters.targetAudience || 'general consumers'}
                                - Tone: ${parameters.tone || 'professional'}
                                - Word Limit: Maximum 200 words
                                
                                Generate a concise description that appeals to ${parameters.targetAudience || 'potential buyers'}, 
                                using a ${parameters.tone || 'professional'} tone. Keep it under 200 words.`
                              }],
                              model: "llama-3.3-70b-versatile",
                              temperature: parameters.tone === 'luxurious' ? 0.5 : 0.7,
                              max_completion_tokens: 200, // Limit to 200 words
                              top_p: 1,
                              stream: false,
                            }),
                            // Emotional/storytelling description (limited to 200 words)
                            groq.chat.completions.create({
                              messages: [{
                                role: "user",
                                content: `Image Description: "${description}"
                                
                                Create a storytelling product description that connects emotionally with ${parameters.targetAudience || 'potential buyers'}.
                                
                                Key Details:
                                - Narrative Style: Emotionally engaging
                                - Target Audience: ${parameters.targetAudience || 'general consumers'}
                                - Tone: ${parameters.tone || 'professional'}
                                - Word Limit: Maximum 200 words
                                
                                Craft a narrative that resonates with ${parameters.targetAudience || 'the target market'}. Keep it under 200 words.`
                              }],
                              model: "llama-3.3-70b-versatile",
                              temperature: 0.8,
                              max_completion_tokens: 200, // Limit to 200 words
                              top_p: 1,
                              stream: false,
                            }),
                            // Technical/benefit-driven description (limited to 200 words)
                            groq.chat.completions.create({
                              messages: [{
                                role: "user",
                                content: `Image Description: "${description}"
                                
                                Create a technical description highlighting product benefits.
                                
                                Key Details:
                                - Focus: Technical specifications and key benefits
                                - Target Audience: ${parameters.targetAudience || 'tech-savvy consumers'}
                                - Tone: ${parameters.tone || 'professional'}
                                - Word Limit: Maximum 200 words
                                
                                Provide detailed insights that would appeal to ${parameters.targetAudience || 'potential buyers'}. Keep it under 200 words.`
                              }],
                              model: "llama-3.3-70b-versatile",
                              temperature: 0.6,
                              max_completion_tokens: 200, // Limit to 200 words
                              top_p: 1,
                              stream: false,
                            })
                          ]);
                          break;
                      
                        case 'social':
                          generatedDescriptions = await Promise.all([
                            // Platform-specific social media post (with emojis)
                            groq.chat.completions.create({
                              messages: [{
                                role: "user",
                                content: `Image Description: "${description}"
                                
                                Create a social media post for ${parameters.platform || 'Instagram'}.
                                
                                Key Details:
                                - Platform: ${parameters.platform || 'Instagram'}
                                - Tone: ${parameters.tone || 'casual'}
                                - Emoji Usage: Include emojis
                                
                                Craft a post that suits ${parameters.platform || 'the selected platform'}
                                with a ${parameters.tone || 'casual'} tone. Use fun and relevant emojis.`
                              }],
                              model: "llama-3.3-70b-versatile",
                              temperature: 1.0,
                              max_completion_tokens: 500,
                              top_p: 1,
                              stream: false,
                            }),
                            // Alternate tone social media post (with emojis)
                            groq.chat.completions.create({
                              messages: [{
                                role: "user",
                                content: `Image Description: "${description}"
                                
                                Create a social media post with a specific tone.
                                
                                Key Details:
                                - Platform: ${parameters.platform || 'Social Media'}
                                - Tone: ${parameters.tone || 'inspirational'}
                                - Emoji Usage: Include emojis
                                
                                Generate a post that embodies a ${parameters.tone || 'inspirational'} approach. Use emotionally resonant emojis.`
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
                    console.log(`Descriptions generated for image ${index + 1} successfully`);
                    
                    // Return the descriptions for this image
                    return {
                        imageUrl,
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
                            },
                        status: 'success'
                    };
                    
                } catch (imageError) {
                    console.error(`Error processing image ${index + 1}:`, imageError);
                    return { 
                        imageUrl, 
                        error: imageError.message || "Unknown error occurred during image processing",
                        status: 'error'
                    };
                }
            })
        );

        // Return the bulk analysis results
        return {
            totalImages: imageUrls.length,
            processedImages: processingUrls.length,
            results: bulkAnalysisResults
        };
        
    } catch (error) {
        console.error("Bulk image analysis error:", error);
        return { 
            error: error.message || "Unknown error occurred during bulk image analysis",
            supportedOptions: ['social', 'ecommerce']
        };
    }
};

module.exports = { analyzeBulkImages };