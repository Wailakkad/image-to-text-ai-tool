const { IgApiClient } = require("instagram-private-api");
const request = require("request-promise");

const postToInstagram = async (imageUrl, caption) => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    try {
        // Log in to Instagram
        await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    } catch (error) {
        if (error.response?.body?.message === 'challenge_required') {
            console.log('Challenge required! Please complete the challenge manually.');

            // Get the challenge URL
            const challengeUrl = error.response.body.challenge?.url;
            console.log(`Open this URL in your browser and complete the challenge: ${challengeUrl}`);

            // Wait for the user to complete the challenge
            console.log('Once the challenge is completed, press Enter to continue...');
            await new Promise(resolve => process.stdin.once('data', resolve));

            // Retry login after challenge is completed
            console.log('Retrying login...');
            await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
            console.log('Logged in successfully after challenge!');
        } else {
            throw error;
        }
    }

    try {
        // Download the image using request-promise
        const imageBuffer = await request({
            url: imageUrl,
            encoding: null, // Ensure the response is a buffer
        });

        // Post the image to Instagram
        const publishResult = await ig.publish.photo({
            file: imageBuffer, // Pass the image buffer
            caption
        });

        console.log("Post published:", publishResult);
        return publishResult;
    } catch (error) {
        console.error("Error posting to Instagram:", error);
        return null;
    }
};

module.exports = { postToInstagram };