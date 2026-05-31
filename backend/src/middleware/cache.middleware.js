const NodeCache = require("node-cache");
// Cache data for 1 hour (1800 seconds)
const aiCache = new NodeCache({ stdTTL: 1800 });

const cacheAiResponse = (req, res, next) => {
    // Create a unique key based on the user and the job description
    const { jobDescription } = req.body;
    const userId = req.user.id;
    const cacheKey = `ai_report_${userId}_${jobDescription.substring(0, 20)}`;

    const cachedData = aiCache.get(cacheKey);
    if (cachedData) {
        console.log("Serving instantly from cache!");
        return res.status(200).json(cachedData);
    }

    // If not in cache, attach the key to the request so the controller can save it later
    req.cacheKey = cacheKey;
    next();
};

module.exports = { cacheAiResponse, aiCache };
