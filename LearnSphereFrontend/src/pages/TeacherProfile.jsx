import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function TeacherProfile() {
    const { teacherId } = useParams();

    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/teacher/${teacherId}/details`
                );

                setTeacher(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [teacherId]);

    if (loading)
        return (
            <p className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
                Loading teacher…
            </p>
        );

    if (!teacher)
        return (
            <p className="min-h-screen flex items-center justify-center text-gray-500">
                Teacher not found
            </p>
        );

    const details = teacher.teacherDetails || {};

    return (
        <div className="min-h-screen bg-[#f9fafb] pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
                {/* ================= LEFT — STICKY CARD ================= */}
                <aside className="lg:sticky lg:top-24 h-fit animate-slide-in">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        {/* Cover */}
                        <div className="h-36 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200" />

                        {/* Profile */}
                        <div className="-mt-14 px-6 pb-6 text-center">
                            <img
                                src={
                                    teacher.profilePicture ||
                                    "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                                }
                                alt={teacher.username}
                                className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-md object-cover"
                            />

                            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                                {teacher.username}
                            </h2>

                            <p className="text-sm text-gray-500">{teacher.email}</p>

                            {!!details.specialization && (
                                <p className="mt-3 text-sm text-gray-700">
                                    <span className="font-medium">Specialization:</span>{" "}
                                    {details.specialization}
                                </p>
                            )}

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-gray-500">Experience</p>
                                    <p className="font-semibold">
                                        {details.experience ? `${details.experience} yrs` : "—"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-gray-500">Qualification</p>
                                    <p className="font-semibold">
                                        {details.qualification || "—"}
                                    </p>
                                </div>
                            </div>

                            {teacher.rating && (
                                <div className="mt-5 inline-block bg-yellow-400 px-4 py-1.5 rounded-full text-sm font-semibold">
                                    ★ {teacher.rating.toFixed(1)}
                                </div>
                            )}

                            <p className="mt-6 text-xs text-gray-500">
                                Status:{" "}
                                <span className="font-medium capitalize">
                                    {details.approved}
                                </span>
                            </p>
                        </div>
                    </div>
                </aside>

                {/* ================= RIGHT — COURSES GRID ================= */}
                <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-up">
                        Courses by {teacher.username}
                    </h3>

                    {teacher.courses?.length === 0 ? (
                        <p className="text-gray-500 mt-10 animate-fade-up">
                            No courses created yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {teacher.courses.map((course, i) => (
                                <div
                                    key={course._id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 animate-card"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    {/* Thumbnail */}
                                    <div className="h-44 overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Body */}
                                    <div className="p-5 space-y-2">
                                        <h4 className="font-semibold text-gray-900 text-lg">
                                            {course.title}
                                        </h4>

                                        <p className="text-sm italic text-gray-500">
                                            by {teacher.username}
                                        </p>

                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {course.description}
                                        </p>

                                        <p className="mt-3 text-sm font-semibold text-gray-700">
                                            {course.lessons?.length || 0} videos
                                        </p>

                                        {/* Rating + Enrolled */}
                                        <div className="flex items-center justify-between mt-2 text-sm">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <span>★★★★★</span>
                                                <span className="text-gray-600">
                                                    ({course.rating || 4.5})
                                                </span>
                                            </div>

                                            <span className="text-gray-500">
                                                {(course.students?.length) || 0} ENROLLED
                                            </span>
                                        </div>

                                        {/* Price + Enroll button */}
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-xl font-bold">₹{course.price}</p>

                                            <button
                                                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md"
                                                onClick={() => navigate(`/student/course-details/${course._id}`)}
                                            >
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>

            {/* animations */}
            <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes cardFade {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        .animate-card {
          animation: cardFade 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
