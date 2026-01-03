import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUsers, FiBookOpen, FiLogOut, FiCheck, FiX, FiExternalLink } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]); // State for pending teachers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseRes, teacherRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/pending-courses`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/pending-teachers`)
        ]);

        if (courseRes.data.success) setCourses(courseRes.data.courses);
        if (teacherRes.data.success) setTeachers(teacherRes.data.teachers.filter(t => t.teacherDetails.approved === 'pending')  );
        
      } catch (err) {
        setError("Failed to sync with server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCourseAction = async (courseId, action) => {
    try {
      const endpoint = action === 'approve' ? 'approve-course' : 'reject-course';
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/${endpoint}`, { courseId });
      if (res.data.success) {
        setCourses(courses.filter(c => c._id !== courseId));
        toast.success(`Course ${action}d successfully`);
      }
    } catch (err) { toast.error("Action failed"); }
  };

  const handleTeacherAction = async (teacherId, action) => {
    try {
      const endpoint = action === 'approve' ? 'approve-teacher' : 'reject-teacher';
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/${endpoint}`, { teacherId });
      if (res.data.success) {
        setTeachers(teachers.filter(t => t._id !== teacherId));
        toast.success(`Teacher ${action}d successfully`);
      }
    } catch (err) { toast.error("Action failed"); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium tracking-wide">Securing data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-black text-indigo-600 tracking-tighter italic">LearnSphere</h2>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Admin Central</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "courses" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <FiBookOpen /> Pending Courses
            {courses.length > 0 && <span className="ml-auto bg-indigo-400 text-white text-[10px] px-2 py-0.5 rounded-full">{courses.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab("teachers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "teachers" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <FiUsers /> Pending Teachers
            {teachers.length > 0 && <span className="ml-auto bg-indigo-400 text-white text-[10px] px-2 py-0.5 rounded-full">{teachers.length}</span>}
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-all"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 capitalize">{activeTab} Review</h1>
            <p className="text-slate-500">You have {activeTab === 'courses' ? courses.length : teachers.length} items requiring attention.</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "courses" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.length === 0 ? <EmptyState msg="No courses pending" /> : 
                  courses.map(course => (
                    <CourseCard key={course._id} course={course} onAction={handleCourseAction} />
                  ))
                }
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Instructor</th>
                      <th className="px-6 py-4">Qualifications</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teachers.length === 0 ? <tr><td colSpan="3" className="p-10 text-center text-slate-400">No pending teacher applications</td></tr> : 
                      teachers.map(teacher => (
                        <TeacherRow key={teacher._id} teacher={teacher} onAction={handleTeacherAction} />
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS FOR CLEANER CODE ---

const CourseCard = ({ course, onAction }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex gap-4">
      <img src={course.thumbnail} className="w-24 h-24 rounded-xl object-cover border border-slate-100" alt="" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{course.title}</h3>
          <span className="text-indigo-600 font-black text-sm">₹{course.price}</span>
        </div>
        <p className="text-slate-500 text-xs mt-1">By <span className="font-semibold text-slate-700">{course.teacher?.username}</span></p>
        <p className="text-slate-400 text-sm mt-3 line-clamp-2">{course.description}</p>
      </div>
    </div>
    <div className="mt-6 flex gap-3">
      <button onClick={() => onAction(course._id, 'approve')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all">
        <FiCheck /> Approve
      </button>
      <button onClick={() => onAction(course._id, 'reject')} className="flex-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all">
        <FiX /> Reject
      </button>
    </div>
  </div>
);

const TeacherRow = ({ teacher, onAction }) => (
  <tr className="hover:bg-slate-50/50 transition-all">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="overflow-hidden w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
          <img src={teacher?.profilePicture || ""} alt={teacher.username.charAt(0)} />
        </div>
        <div>
          <p className="font-bold text-slate-800">{teacher.username}</p>
          <p className="text-xs text-slate-400 italic">{teacher.email}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-slate-600">
      {teacher.teacherDetails?.qualification || "Self-taught expert"}
    </td>
    <td className="px-6 py-4">
      <div className="flex justify-center gap-2">
        <button onClick={() => onAction(teacher._id, 'approve')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
          <FiCheck size={18} />
        </button>
        <button onClick={() => onAction(teacher._id, 'reject')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
          <FiX size={18} />
        </button>
      </div>
    </td>
  </tr>
);

const EmptyState = ({ msg }) => (
  <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
    <div className="text-4xl mb-3">✨</div>
    <p className="text-slate-500 font-medium">{msg}</p>
  </div>
);

export default AdminDashboard;