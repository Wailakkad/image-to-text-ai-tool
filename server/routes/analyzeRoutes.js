const express = require("express");
const router = express.Router();
const { analyzeImage } = require("../services/analyzeService");
// const { postToInstagram } = require("../services/instagramService");

router.post("/analyze-and-post", async (req, res) => {
    const { image_url } = req.body;

    if (!image_url) {
        return res.status(400).json({ error: "Image URL is required" });
    }

    const description = await analyzeImage(image_url);

    if (!description) {
        return res.status(500).json({ error: "Failed to analyze image" });
    }
    res.status(200).json({description : description})

    // const postResult = await postToInstagram(image_url, description);

    // if (!postResult) {
    //     return res.status(500).json({ error: "Failed to post to Instagram" });
    // }

    // res.json({ message: "Image analyzed and posted to Instagram!", description });
});

module.exports = router;
