const express = require("express");
const router = express.Router();
const { analyzeImage } = require("../services/analyzeService");
// const { postToInstagram } = require("../services/instagramService");

router.post("/analyze-and-post", async (req, res) => {
    const { image_url , option } = req.body;

    if (!image_url || !option) {
        return res.status(400).json({ error: "somme info is required" });
    }

    const description = await analyzeImage(image_url , option);

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
