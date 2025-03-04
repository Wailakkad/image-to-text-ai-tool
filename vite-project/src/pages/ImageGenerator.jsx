import React, { useState, useEffect } from 'react';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [descriptions, setDescriptions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateDescription = async () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
    } else {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/analyze-and-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_url: imageUrl }),
        });
        const data = await response.json();
        console.log("API Response:", data);
        
        if (response.ok) {
          // Access the nested descriptions object
          if (data.description && data.description.description) {
            setDescriptions(data.description.description);
          } else {
            alert('Invalid response format');
          }
        } else {
          alert(data.error || 'Failed to generate description');
        }
      } catch (error) {
        console.error("Error:", error);
        alert('An error occurred while generating the description');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Debug render to check what's in the descriptions state
  useEffect(() => {
    console.log("Current descriptions state:", descriptions);
  }, [descriptions]);
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 transition-colors duration-500 py-20 ">
      <div className='flex flex-col items-center gap-8 w-full max-w-4xl'>
        <h1 className="text-6xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-500">Image Description Generator</h1>
        <div className="flex items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
          <button
            onClick={handleGenerateDescription}
            className="ml-4 py-3 px-6 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 shadow-md"
          >
            Generate
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-8">
          <p className="text-gray-900 dark:text-white">Loading...</p>
        </div>
      )}
      
      {descriptions && (
        <div className="mt-8 w-full max-w-4xl space-y-6">
          {/* Debug section to see raw data */}
          {/* <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Debug - Raw Data:</h3>
            <pre className="text-xs overflow-auto max-h-32 text-gray-900 dark:text-white">{JSON.stringify(descriptions, null, 2)}</pre>
          </div> */}
          
          {/* Description Cards with Numbers */}
          <div className="space-y-6">
            {descriptions.casual && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  <span className="mr-2 text-blue-500">1.</span> Casual Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{descriptions.casual}</p>
              </div>
            )}
            
            {descriptions.poetic && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  <span className="mr-2 text-purple-500">2.</span> Poetic Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{descriptions.poetic}</p>
              </div>
            )}
            
            {descriptions.minimalist && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  <span className="mr-2 text-pink-500">3.</span> Minimalist Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{descriptions.minimalist}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;