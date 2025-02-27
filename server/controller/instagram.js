const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");
const logger = require("../utils/logger");

const ig = new IgApiClient();

const login = async (username, password) => {
    ig.state.generateDevice(username);
    try {
        console.log("Logging into Instagram...");
        await ig.account.login(username, password);
        console.log("Login successful!");
    } catch (error) {
        logger.error("Instagram Login Failed:", error);
        throw error;
    }
};

const postImage = async (imageUrl, caption) => {
    try {
        console.log("Downloading image...");
        const imageBuffer = await get({ url: imageUrl, encoding: null });

        console.log("Posting image to Instagram...");
        await ig.publish.photo({ file: imageBuffer, caption });

        console.log("Image posted successfully!");
    } catch (error) {
        logger.error("Failed to post image:", error);
    }
};

module.exports = { login, postImage };
