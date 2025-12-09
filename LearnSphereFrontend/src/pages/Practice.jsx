import Navbar from "../Components/Navbar/Navbar";
import { FaBrain, FaComments, FaSadTear, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Practice() {
  const navigate = useNavigate();

  const tests = [
    {
      title: "Stress Interview Test",
      description:
        "Simulates high-pressure questions to test your composure and stress handling.",
      color: "bg-red-50",
      icon: <FaBrain className="text-red-500 text-3xl" />,
      route: "/practice/stress-interview",
    },
    {
      title: "Fluency Test",
      description:
        "Evaluate your speaking clarity and fluency in real-time scenarios.",
      color: "bg-green-50",
      icon: <FaComments className="text-green-500 text-3xl" />,
      route: "/practice/fluency",
    },
    {
      title: "Java Test",
      description:
        "Assess your Java programming skills with practical coding questions.",
      color: "bg-yellow-50",
      icon: <FaSadTear className="text-yellow-500 text-3xl" />,
      route: "/practice/Java",
    },
    {
      title: "Situational Test",
      description:
        "Check how well you respond to practical, real-world work situations.",
      color: "bg-blue-50",
      icon: <FaUserTie className="text-blue-500 text-3xl" />,
      route: "/practice/situational",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl pt-40 mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {tests.map((test, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 ${test.color} flex flex-col justify-between`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div>{test.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800">{test.title}</h2>
            </div>

            <p className="text-gray-700 mb-6 text-sm leading-relaxed">
              {test.description}
            </p>

            <button
              onClick={() => navigate(test.route)}
              className="self-start mt-auto bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition cursor-pointer"
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Practice;
