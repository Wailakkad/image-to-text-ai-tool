const axios = require("axios");
const { ANALYSIS_API_URL } = require("../config/dotenv");

const analyzeImage = async (imageUrl) => {
    try {
        const response = await axios.post(ANALYSIS_API_URL, { image_url: imageUrl });
        return response.data.description;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return null;
    }
};

module.exports = { analyzeImage };
