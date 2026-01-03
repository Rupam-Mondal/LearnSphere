import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="container mx-auto px-6">
        
        {/* Top Section: CTA */}
        <div className="mb-8 border-b border-gray-700 pb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold">
            Start Teaching on LearnSphere
          </h2>
          <button className="border border-gray-400 cursor-pointer hover:bg-gray-700 hover:border-white text-white font-medium py-2 px-6 rounded-lg transition duration-300 whitespace-nowrap">
            Get Started
          </button>
        </div>

        {/* Bottom Section: Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} LearnSphere. All rights reserved.</p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer