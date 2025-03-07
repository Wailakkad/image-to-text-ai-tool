import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Image, Settings, Send, Loader, Download, Share2, RefreshCw, X } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [steps, setSteps] = useState(5);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/generate-image', { prompt, steps });

      if (!response.data) {
        throw new Error('Empty response from server');
      }

      const data = response.data;

      if (!response.status === 200) {
        throw new Error(data.message || 'Failed to generate image');
      }

      // Construct the full URL for the image using the server's base URL
      const fullImageUrl = `http://localhost:5000${data.imageUrl}`;
      setGeneratedImage({ ...data, imageUrl: fullImageUrl });
      console.log('Generated image:', { ...data, imageUrl: fullImageUrl });
      
      // Save prompt to recent prompts
      setRecentPrompts(prev => {
        const updated = [prompt, ...prev.filter(p => p !== prompt)].slice(0, 5);
        localStorage.setItem('recentPrompts', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateImage();
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage.imageUrl;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearPrompt = () => {
    setPrompt('');
  };

  useEffect(() => {
    // Load recent prompts from localStorage
    const savedPrompts = localStorage.getItem('recentPrompts');
    if (savedPrompts) {
      try {
        setRecentPrompts(JSON.parse(savedPrompts));
      } catch (e) {
        console.error('Error loading recent prompts:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="text-[#ffbe0b]" size={32} />
            <span className="bg-clip-text text-transparent bg-black">
              AI Image Generator
            </span>
          </h1>
          <p className="text-white mt-2">Transform your ideas into stunning visuals with AI</p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left panel - Controls */}
          <div className="bg-black rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Image className="mr-2 text-[#ffbe0b]" size={20} />
                Prompt Engineering
              </h2>

              <div className="relative">
                <textarea
                  className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {prompt && (
                  <button 
                    onClick={clearPrompt}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
                <p className="text-xs text-gray-400 mt-1">Press Ctrl+Enter to generate</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#dc2f02] to-[#e85d04] hover:from-[#e85d04] hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin mr-2" size={18} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={18} />
                      Generate Image
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  <Settings size={18} />
                </button>
              </div>

              {/* Advanced settings */}
              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h3 className="text-sm font-medium mb-3 text-gray-300">Advanced Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Steps: {steps}</span>
                        <span className="text-xs text-gray-400">Higher = Better quality, slower</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={steps}
                        onChange={(e) => setSteps(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Recent prompts */}
              {recentPrompts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2 text-gray-300">Recent Prompts</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentPrompts.map((p, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(p)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-3 rounded-full transition-colors duration-200 truncate max-w-xs"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Output */}
          <div className="bg-black rounded-xl shadow-xl overflow-hidden border border-gray-700 flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="mr-2 text-[#ffbe0b]" size={20} />
                Generated Image
              </h2>

              <div className="flex-1 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden">
                {isGenerating ? (
                  <div className="text-center p-8">
                    <Loader size={48} className="animate-spin mx-auto text-purple-400 mb-4" />
                    <p className="text-gray-400">Creating your masterpiece...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={generatedImage.imageUrl}
                      alt={generatedImage.prompt}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-url'; }}
                    />
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Image size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Your generated image will appear here</p>
                    <p className="text-sm text-gray-500 mt-2">Enter a prompt and click Generate</p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={downloadImage}
                      className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center text-sm"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(generatedImage.prompt);
                        }
                      }}
                      className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center text-sm"
                    >
                      <Share2 size={16} className="mr-2" />
                      Copy Prompt
                    </button>
                    <button
                      onClick={generateImage}
                      disabled={isGenerating}
                      className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center text-sm ml-auto"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Regenerate
                    </button>
                  </div>
                  <div className="mt-4 text-sm">
                    <h3 className="font-medium text-gray-300">Prompt Used:</h3>
                    <p className="text-gray-400 mt-1">{generatedImage.prompt}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>Generated at: {new Date(generatedImage.timestamp).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>Steps: {steps}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;