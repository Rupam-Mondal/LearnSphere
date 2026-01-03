import { useNavigate } from "react-router-dom";
import girl from "../../assets/LandingPic/girl.webp"; // Kept for consistency if needed
import { useState } from "react";

const TeacherLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-[90vh] bg-zinc-50 flex items-center justify-center px-5 py-12">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1]">
              Come Teach <br /> 
              <span className="text-purple-600 font-serif italic">With Us</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed">
              Become an instructor on <span className="font-bold text-gray-900">LearnSphere</span>. 
              Join one of the world’s largest online learning marketplaces and share your expertise with millions of students.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => navigate("/teacher/auth")}
                className="bg-gray-900 hover:bg-gray-800 transition-all text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-4 border-purple-200 rounded-2xl hidden md:block"></div>
              <img
                src="https://s.udemycdn.com/teaching/record-your-video-v3.jpg"
                alt="Teacher Illustration"
                className="relative z-10 w-full max-w-[550px] rounded-2xl shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">So many reasons to Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Teach your way</h3>
              <p className="text-gray-600">Publish the course you want, in the way you want, and always have control of your own content.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2">Inspire learners</h3>
              <p className="text-gray-600">Teach what you know and help learners explore their interests, gain new skills, and advance their careers.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Get rewarded</h3>
              <p className="text-gray-600">Expand your professional network, build your expertise, and earn money on each paid enrollment.</p>
            </div>
          </div>
        </div>
      </section>

      <HowToBegin />
    </div>
  );
};

export default TeacherLanding;


const HowToBegin = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: "Plan your curriculum",
      heading: "You start with your passion and knowledge.",
      description: "Then choose a promising topic with the help of our Marketplace Insights tool. The way that you teach — what you bring to it — is up to you.",
      helpTitle: "How we help you",
      helpText: "We offer plenty of resources on how to create your first course. And, our instructor dashboard and curriculum pages help keep you organized.",
      image: "https://s.udemycdn.com/teaching/plan-your-curriculum-v3.jpg", // Example Udemy asset
    },
    {
      title: "Record your video",
      heading: "Use what you have or upgrade your gear.",
      description: "You don't need to be a pro to get started. Use a smartphone or a DSLR. Add a good microphone and you’re ready to go.",
      helpTitle: "How we help you",
      helpText: "Our support team is available to help you through the process, and we provide resources on everything from lighting to editing.",
      image: "https://s.udemycdn.com/teaching/record-your-video-v3.jpg",
    },
    {
      title: "Launch your course",
      heading: "Gather your first ratings and reviews.",
      description: "Promote your course through social media and your professional network to get your first students and start building momentum.",
      helpTitle: "How we help you",
      helpText: "Our custom coupon tool helps you create incentives for students to join, and our global marketing reaches millions.",
      image: "https://s.udemycdn.com/teaching/launch-your-course-v3.jpg",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          How to begin
        </h2>

        {/* Tab Headers */}
        <div className="flex justify-center border-b border-gray-200 mb-16 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 md:px-8 py-4 text-lg font-bold transition-all duration-300 whitespace-nowrap border-b-2 ${
                activeTab === index
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[400px]">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {tabs[activeTab].heading} {tabs[activeTab].description}
            </p>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {tabs[activeTab].helpTitle}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {tabs[activeTab].helpText}
            </p>
          </div>

          <div className="flex justify-center animate-in fade-in slide-in-from-right-4 duration-500">
            <img
              src={tabs[activeTab].image}
              alt={tabs[activeTab].title}
              className="w-full max-w-[450px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
