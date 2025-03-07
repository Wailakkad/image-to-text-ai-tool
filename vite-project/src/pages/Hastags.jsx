import React, { useState } from 'react';
import axios from 'axios';

const HashtagGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [error, setError] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [numHashtags, setNumHashtags] = useState(10);
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('');
  const [keywords, setKeywords] = useState('');

  const generateHashtags = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate hashtags');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const keywordsArray = keywords.trim() ? keywords.split(',').map(k => k.trim()) : [];
      
      const response = await axios.post('http://localhost:5000/api/get-hashtags', {
        text: inputText,
        numHashtags,
        tone,
        audience,
        platform,
        keywords: keywordsArray
      });

      setHashtags(response.data.hashtags);
    } catch (err) {
      setError('An error occurred while generating hashtags');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const hashtagText = hashtags.join(' ');
    navigator.clipboard.writeText(hashtagText);
  };

  return (
    <div className="min-h-screen  text-white flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-black to-[#6a040f] bg-clip-text text-transparent">
          Generate Hashtags with AI
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Enter your content and let our AI generate relevant, trending hashtags to maximize your reach and engagement.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 flex-grow">
        <div className="max-w-3xl mx-auto bg-black bg-opacity-40 p-6 rounded-xl shadow-lg border border-gray-800">
          {/* Input Section */}
          <div className="mb-6">
            <textarea
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 transition duration-200 min-h-[120px]"
              placeholder="Enter your text here to generate hashtags"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Advanced Options Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setAdvanced(!advanced)}
              className="text-orange-400 hover:text-orange-300 text-sm flex items-center"
            >
              <span>{advanced ? 'Hide' : 'Show'} Advanced Options</span>
              <svg
                className={`ml-1 w-4 h-4 transition-transform duration-200 ${advanced ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Advanced Options */}
          {advanced && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg animate-fadeIn">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Number of hashtags</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={numHashtags}
                  onChange={(e) => setNumHashtags(parseInt(e.target.value) || 10)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tone</label>
                <input
                  type="text"
                  placeholder="e.g., Professional, Casual, Funny"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g., Marketers, Developers, Millennials"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Platform</label>
                <input
                  type="text"
                  placeholder="e.g., Instagram, Twitter, LinkedIn"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., technology, marketing, AI"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="mb-6">
            <button
              onClick={generateHashtags}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isLoading ? 'Generating...' : 'Generate Hashtags'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900 bg-opacity-40 border border-red-700 text-red-200 rounded-lg text-sm animate-fadeIn">
              {error}
            </div>
          )}

          {/* Results Section */}
          {hashtags.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition-all duration-500 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-orange-400">Generated Hashtags</h3>
                <button
                  onClick={copyToClipboard}
                  className="text-sm bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded flex items-center transition duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-900 text-orange-400 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition duration-200 cursor-pointer"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Futuristic AI Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-40 -left-40 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        <div className="absolute bottom-40 -right-40 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        Powered by advanced AI technology • © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default HashtagGenerator;