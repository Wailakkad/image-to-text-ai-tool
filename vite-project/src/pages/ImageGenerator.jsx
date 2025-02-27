import React, { useState } from 'react';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [Description, setDescription] = useState(null);
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
        if (response.ok) {
          setDescription(data.description);
          console.log(data.description)
        } else {
          alert(data.error);
        }
      } catch (error) {
        alert('An error occurred while generating the description');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-500 py-20">
      <div className='flex flex-col items-center gap-8'>
        <h1 className="text-6xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-500">Image Generator</h1>
        <div className="flex items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Describe what you want to see..."
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
      {Description && (
        <div className="mt-8 animate-fadeIn">
          <h1>{Description}</h1>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;