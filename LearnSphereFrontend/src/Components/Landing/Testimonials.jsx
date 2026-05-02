import { Star, MessageCircle, Sparkles } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Engineer at Google",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "LearnSphere has completely transformed the way I approach learning. The AI-driven paths ensured I spent time only on what I didn't know, accelerating my journey to a top-tier tech company.",
      rating: 5,
    },
    {
      name: "Samantha Lee",
      role: "Data Scientist",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "The mentors here are incredibly approachable and knowledgeable. Real-world insights provided by them were invaluable and bridged the gap between academic theory and industry practice.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Frontend Developer",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      text: "The interactive practice environments are a game-changer. I could immediately test the concepts I learned in my browser, without the hassle of setting up local development tools.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-[#fafafa] py-24 border-t border-slate-100 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageCircle className="w-4 h-4" />
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Thousands
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here is what our thriving community
            of learners has to say about LearnSphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300 relative group"
            >
              <div className="p-8 border-none flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 italic text-lg leading-relaxed flex-grow mb-8 relative">
                  <span className="text-4xl text-slate-200 absolute -top-4 -left-2 font-serif">
                    &quot;
                  </span>
                  <span className="relative z-10">{testimonial.text}</span>
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
