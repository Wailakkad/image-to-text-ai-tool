const express = require("express");
const router = express.Router();
const { analyzeImage } = require("../services/analyzeService");
const { analyzeBulkImages } = require("../services/Bulk_Image");


router.post("/analyze-image", async (req, res) => {
    const { image_url , option ,  parameters  } = req.body;

    if (!image_url || !option) {
        return res.status(400).json({ error: "somme info is required" });
    }

    const description = await analyzeImage(image_url , option ,  parameters );

    if (!description) {
        return res.status(500).json({ error: "Failed to analyze image" });
    }
    res.status(200).json({description : description})
});

router.post("/analyze-bulk-images", async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        
        const { images, option, parameters } = req.body;
        
        // Validate input
        if (!images || !Array.isArray(images) || images.length === 0) {
            console.error('Invalid input: No images provided');
            return res.status(400).json({
                error: "Invalid input",
                message: "Please provide a non-empty array of image URLs"
            });
        }
        
        // Perform bulk image analysis
        const analysisResults = await analyzeBulkImages(images, option, parameters);
        
        // Log the results for debugging
        console.log('Analysis Results:', JSON.stringify(analysisResults, null, 2));
        
        // Ensure you always send a response
        if (analysisResults.error) {
            console.error('Analysis error:', analysisResults.error);
            return res.status(400).json(analysisResults);
        }
        
        // Send successful response
        res.status(200).json(analysisResults);
    } catch (error) {
        console.error('Bulk image analysis route error:', error);
        
        // Always send a JSON response, even for unexpected errors
        res.status(500).json({
            error: "Internal server error",
            message: error.message || "Failed to process bulk image analysis"
        });
    }
});

module.exports = router;
