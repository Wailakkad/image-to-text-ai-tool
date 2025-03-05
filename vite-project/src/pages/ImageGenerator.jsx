import React, { useState } from 'react';
import { 
  Sparkles, 
  ImageIcon, 
  Wand2, 
  Layers, 
  Copy, 
  CheckCircle,
  Image,
  Settings
} from 'lucide-react';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [descriptions, setDescriptions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('social');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // New state for advanced parameters
  const [advancedParams, setAdvancedParams] = useState({
    social: {
      platform: 'Instagram',
      tone: 'casual',
      includeEmojis: true,
      customHashtags: ''
    },
    ecommerce: {
      descriptionType: 'sales pitch',
      targetAudience: 'general consumers',
      tone: 'professional'
    }
  });
  
  // New state to toggle advanced parameters view
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);

  const options = [
    { value: 'social', label: 'Social Media', icon: Layers },
    { value: 'ecommerce', label: 'E-commerce', icon: Sparkles }
  ];

  const socialPlatforms = [
    'Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'
  ];

  const socialTones = [
    'casual', 'humorous', 'inspirational', 'professional'
  ];

  const ecommerceDescriptionTypes = [
    'sales pitch', 'technical specification', 'storytelling'
  ];

  const ecommerceTargetAudiences = [
    'general consumers', 'tech enthusiasts', 
    'fashion lovers', 'home decor lovers'
  ];

  const ecommerceTones = [
    'professional', 'casual', 'luxurious'
  ];

  const handleGenerateDescription = async () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }

    // Set preview image when generate is clicked
    setPreviewImage(imageUrl);

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze-and-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image_url: imageUrl,
          option: selectedOption,
          parameters: advancedParams[selectedOption]
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Handling different response structures
        const descData = data.descriptions || 
                         (data.description && data.description.descriptions) || 
                         data.description;
        
        setDescriptions(descData);
      } else {
        alert(data.error || 'Failed to generate description');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('An error occurred while generating the description');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(text);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderAdvancedParams = () => {
    const params = selectedOption === 'social' 
      ? advancedParams.social 
      : advancedParams.ecommerce;

    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mt-4 space-y-4">
        {selectedOption === 'social' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <select
                value={params.platform}
                onChange={(e) => setAdvancedParams(prev => ({
                  ...prev,
                  social: { ...prev.social, platform: e.target.value }
                }))}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {socialPlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tone
              </label>
              <select
                value={params.tone}
                onChange={(e) => setAdvancedParams(prev => ({
                  ...prev,
                  social: { ...prev.social, tone: e.target.value }
                }))}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {socialTones.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={params.includeEmojis}
                onChange={(e) => setAdvancedParams(prev => ({
                  ...prev,
                  social: { ...prev.social, includeEmojis: e.target.checked }
                }))}
                className="mr-2 text-blue-500 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Include Emojis
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Hashtags (optional)
              </label>
              <input
                type="text"
                value={params.customHashtags}
                onChange={(e) => setAdvancedParams(prev => ({
                  ...prev,
                  social: { ...prev.social, customHashtags: e.target.value }
                }))}
                placeholder="Enter custom hashtags (comma-separated)"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </>
        )}

        {selectedOption === 'ecommerce' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description Type
              </label>
              <select
                value={params.descriptionType}
                onChange={(e) => setAdvancedParams(prev => ({
                  ...prev,
                  ecommerce: { ...prev.ecommerce, descriptionType: e.target.value }
                }))}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {ecommerceDescriptionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience
              </label>
              <select
                value={params.targetAudience}
                onChange={(e) => setAdvancedParams(prev => ({
                  ...prev,
                  ecommerce: { ...prev.ecommerce, targetAudience: e.target.value }
                }))}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {ecommerceTargetAudiences.map(audience => (
                  <option key={audience} value={audience}>{audience}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tone
              </label>
              <select
                value={params.tone}
                onChange={(e) => setAdvancedParams(prev => ({
                  ...prev,
                  ecommerce: { ...prev.ecommerce, tone: e.target.value }
                }))}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {ecommerceTones.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-center  mb-6">
          <ImageIcon className="text-white w-10 h-10" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-orange-300 p-6">
            Image Description Generator
          </h1>
        </div>

        <div className="flex space-x-6">
          <div className="flex-grow space-y-6">
            <div className="flex space-x-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Paste your image URL here..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 appearance-none focus:ring-2 focus:ring-blue-500"
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
          onClick={handleGenerateDescription}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg hover:from-orange-600 hover:to-white transition-all disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
            </div>

            {/* Advanced Parameters Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Settings className="mr-2" />
                {showAdvancedParams ? 'Hide' : 'Show'} Advanced Parameters
              </button>
            </div>

            {/* Advanced Parameters Section */}
            {showAdvancedParams && renderAdvancedParams()}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center items-center space-x-2 text-blue-500">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0f8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating descriptions...</span>
              </div>
            )}

            {/* Descriptions Display */}
            {descriptions && !isLoading && (
              <div className="space-y-4">
                {Object.entries(descriptions).map(([key, description], index) => (
                  <div 
                    key={key} 
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 relative group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white capitalize">
                        {key.replace('description', 'Option ')}
                      </h3>
                      <button 
                        onClick={() => handleCopyText(description)}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        {copiedIndex === description ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <Copy />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Image Preview */}
          {previewImage && (
            <div className="w-1/3 flex flex-col items-center">
              <div className="border-4 border-blue-200 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/api/placeholder/400/320'; // Fallback placeholder
                  }}
                />
              </div>
              <div className="mt-4 flex items-center text-gray-600 dark:text-gray-300">
                <Image className="mr-2" />
                <span>Image Preview</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;