import React from 'react';
import { ArrowUpRight, Image, Images } from 'lucide-react';

const Resources = () => {
  const Tools = [
    {
      "id": 1,
      "name": "AI Image Description",
      "description": "Generate compelling descriptions for your social media images or e-commerce product photos with our advanced AI tool.",
      "icon": "Image",
      "link": "image"
    },
    {
      "id": 2,
      "name": "Bulk Image Processor",
      "description": "Process multiple images at once to save time. Perfect for e-commerce stores with large product catalogs.",
      "icon": "Images",
      "link": "bulk"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen  p-8">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools Resources</h1>
        <p className="text-lg text-black max-w-2xl">
          Powerful AI solutions to enhance your image descriptions for social media and e-commerce
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {Tools.map((tool) => (
          <div 
            key={tool.id} 
            className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
          >
            {/* Card Header with Icon */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 rounded-bl-full flex items-start justify-end p-4">
              {tool.icon === "Image" ? (
                <Image size={28} className="text-black" />
              ) : (
                <Images size={28} className="text-black" />
              )}
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{tool.name}</h2>
              <p className="text-gray-600 mb-6">{tool.description}</p>
              
              <a 
                href={tool.link} 
                className="inline-flex items-center text-orange-500 font-semibold group-hover:text-orange-600 transition-colors"
              >
                Try this tool <ArrowUpRight size={16} className="ml-2" />
              </a>
            </div>
            
            {/* Orange Accent */}
            <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-orange-600 absolute bottom-0"></div>
          </div>
        ))}
      </div>
      
      {/* CTA Section */}
      <div className="mt-16 bg-black text-white p-8 rounded-xl max-w-5xl w-full">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold mb-2">Ready to enhance your images?</h3>
            <p className="text-gray-400">Our AI tools help you create perfect descriptions that convert.</p>
          </div>
          <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resources;