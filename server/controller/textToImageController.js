const { HfInference } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');

const hfToken = process.env.HUGGING_FACE_API_KEY;
const client = new HfInference(hfToken);


const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const generateImage = async (req, res) => {
  try {
    const { prompt, steps = 5 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Generating image for prompt: "${prompt}" with ${steps} steps`);

    
    const image = await client.textToImage({
      model: "strangerzonehf/Flux-Midjourney-Mix2-LoRA",
      inputs: prompt,
      parameters: { num_inference_steps: steps },
      provider: "hf-inference",
    });

    // Save the image blob to a file
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-generated.png`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);

    // Return the image URL and other metadata
    res.status(200).json({
      success: true,
      message: 'Image generated successfully',
      imageUrl: `/uploads/${filename}`,
      prompt: prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating image',
      error: error.message
    });
  }
};

module.exports = { generateImage };