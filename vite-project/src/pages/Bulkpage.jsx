import React, { useState, useCallback } from 'react';
import { 
  ArrowRight, 
  Layers, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

const ImageAnalysisTool = () => {
  // State management
  const [imageUrls, setImageUrls] = useState('');
  const [processingOption, setProcessingOption] = useState('ecommerce');
  const [parameters, setParameters] = useState({
    // Ecommerce parameters
    descriptionType: 'sales pitch',
    targetAudience: 'general consumers',
    tone: 'professional',
    
    // Social media parameters
    platform: 'Instagram',
    includeEmojis: false,
    customHashtags: ''
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // URL input handler
  const handleUrlInput = (e) => {
    setImageUrls(e.target.value);
  };

  // Update specific parameter
  const updateParameter = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Submit handler with robust error handling
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    // Prepare image URLs
    const urlArray = imageUrls.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    // Validate URLs
    if (urlArray.length === 0) {
      setError('Please provide at least one valid image URL');
      setIsLoading(false);
      return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/analyze-bulk-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              images: urlArray,
              option: processingOption,
              parameters
            })
          });

      // Log the raw response for debugging
      console.log('Response status:', response.status);

      // Check if response body exists before parsing
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      // Try to parse the response
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to analyze images');
      }

      // Validate response structure
      if (!data || !data.results) {
        throw new Error('Invalid response structure from server');
      }

      setResults(data);
    } catch (err) {
      console.error('Full error details:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [imageUrls, processingOption, parameters]);

  // Render methods
  const renderUrlInputSection = () => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Image URLs
      </label>
      <textarea
        value={imageUrls}
        onChange={handleUrlInput}
        placeholder="Paste comma-separated image URLs"
        className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 transition duration-300"
        rows={3}
        required
      />
    </div>
  );

  const renderProcessingOptions = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Processing Mode
        </label>
        <div className="flex space-x-2">
          {['ecommerce', 'social'].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setProcessingOption(option)}
              className={`flex-1 py-2 rounded-lg transition duration-300 ${
                processingOption === option 
                  ? 'bg-orange-500 text-black' 
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {option === 'ecommerce' ? 'E-Commerce' : 'Social Media'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Advanced Settings
        </label>
        <div className="w-full">
          {processingOption === 'ecommerce' ? (
            <select
              value={parameters.descriptionType}
              onChange={(e) => updateParameter('descriptionType', e.target.value)}
              className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="sales pitch">Sales Pitch</option>
              <option value="narrative">Narrative</option>
              <option value="technical">Technical</option>
            </select>
          ) : (
            <select
              value={parameters.platform}
              onChange={(e) => updateParameter('platform', e.target.value)}
              className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-4 mt-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle2 className="text-green-500" />
          <h2 className="text-xl font-semibold text-gray-200">
            Analysis Results
          </h2>
        </div>
        {results.results.map((result, index) => (
          <div 
            key={index} 
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img 
                  src={result.imageUrl} 
                  alt="Analyzed content" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Original Caption: {result.originalCaption}
                </p>
                {Object.entries(result.descriptions).map(([key, description]) => (
                  <div key={key} className="bg-gray-800 rounded-md p-3">
                    <h3 className="text-orange-500 font-semibold text-sm mb-1">
                      {key}:
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Image Analysis Studio
            </h1>
            <div className="flex items-center space-x-2">
              <Layers className="text-orange-500" />
              <span className="text-gray-200 font-medium">
                {processingOption === 'ecommerce' ? 'E-Commerce' : 'Social Media'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderUrlInputSection()}
            {renderProcessingOptions()}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-pulse flex items-center">
                  <ArrowRight className="mr-2 animate-spin" />
                  Processing Images
                </div>
              ) : (
                <>
                  <ArrowRight className="mr-2" />
                  Analyze Images
                </>
              )}
            </button>
          </form>

          {/* Error Handling */}
          {error && (
            <div className="bg-red-900/30 border-2 border-red-700 rounded-lg p-4 flex items-center space-x-3 mt-4">
              <AlertTriangle className="text-red-500" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {renderResults()}
        </div>
      </div>
    </div>
  );
};
      
export default ImageAnalysisTool;