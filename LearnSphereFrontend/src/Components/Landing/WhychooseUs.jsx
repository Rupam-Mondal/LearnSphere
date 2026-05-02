import { Sparkles, BrainCircuit, Target, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Learning",
      description:
        "Our adaptive AI engine creates highly personalized learning paths based on your pace and understanding.",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: <Target className="w-8 h-8 text-purple-500" />,
      title: "Real-world Projects",
      description:
        "Gain practical experience by working on real-world projects that simulate actual industry scenarios.",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "Verified Mentors",
      description:
        "Learn exclusively from top-tier, verified experts actively working in leading tech companies.",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Interactive Practice",
      description:
        "Reinforce your knowledge with instant feedback using our interactive coding and testing environments.",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  return (
    <section className="relative bg-[#0b0f19] py-24 px-5 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            The LearnSphere{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Advantage
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            We merge cutting-edge technology with world-class education to
            deliver an unparalleled learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/30 group"
            >
              <CardContent className="p-8 border-none flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.bgColor} ${feature.borderColor} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
