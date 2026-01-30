import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Loader2,
  Mail,
  Phone,
  Award,
  BookOpen,
  FileText,
  UserX,
  CheckCircle,
  XCircle,
  Ban,
  LayoutGrid,
  Clock,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

import { toast } from "react-hot-toast";

export default function TeacherProfile() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTeacherProfile();
  }, [teacherId]);

  const fetchTeacherProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/get-teacher-details?teacherId=${teacherId}`,
      );
      console.log(data);
      if (data.success) setTeacher(data.teacher);
      else setError(true);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateTeacherStatus = async (status) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update-teacher-status`,
        { teacherId, status },
      );
      toast.success(res.data.message);
      fetchTeacherProfile();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-medium">Synchronizing Profile...</p>
        </div>
      </div>
    );

  if (error || !teacher)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
          <div className="bg-red-50 p-4 rounded-full mb-4 text-red-500">
            <UserX size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Teacher Unavailable
          </h2>
          <p className="text-slate-500 mt-2 max-w-xs text-pretty">
            We couldn't retrieve the data for this ID. It may have been deleted.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const {
    teacherDetails: details,
    username,
    email,
    profilePicture,
    courses,
  } = teacher;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={20} />{" "}
            <span className="font-medium">Back to Directory</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">
              Admin Mode
            </span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <StatusBadge status={details.approved} />
            </div>

            <div className="relative inline-block">
              <img
                src={profilePicture}
                alt={username}
                className="w-32 h-32 rounded-3xl object-cover ring-4 ring-slate-50 shadow-lg"
              />
            </div>

            <h1 className="mt-6 text-2xl font-black text-slate-900 leading-tight">
              {username}
            </h1>
            <p className="text-indigo-600 font-semibold text-sm">
              {details.specialization} Expert
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl text-slate-600 text-sm">
                <Mail size={16} /> {email}
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl text-slate-600 text-sm">
                <Phone size={16} /> {details.mobileNumber}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] uppercase font-bold text-indigo-400">
                  Experience
                </p>
                <p className="text-lg font-bold text-indigo-700">
                  {details.experience} Yrs
                </p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                <p className="text-[10px] uppercase font-bold text-purple-400">
                  Rating
                </p>
                <p className="text-lg font-bold text-purple-700">
                  {details.rating || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-orange-500" />{" "}
              Administrative Actions
            </h3>
            <div className="flex flex-col gap-3">
              {details.approved !== "approved" ? (
                <button
                  onClick={() => updateTeacherStatus("approved")}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve Account
                </button>
              ) : (
                <button
                  onClick={() => updateTeacherStatus("pending")}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl font-bold transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Suspend Account
                </button>
              )}
              <button
                onClick={() => updateTeacherStatus("rejected")}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition flex items-center justify-center gap-2"
              >
                <XCircle size={18} /> Reject
              </button>
              <button
                onClick={() => updateTeacherStatus("banned")}
                className="w-full py-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-2xl font-bold transition flex items-center justify-center gap-2"
              >
                <Ban size={18} /> Ban Teacher
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8 space-y-8">
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4 px-2">
              Verification Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocCard
                title="Educational Qualification"
                icon={<Award />}
                url={details.qualificationProof}
                subtitle={details.qualification}
              />
              <DocCard
                title="Employment History"
                icon={<FileText />}
                url={details.experienceProof}
                subtitle="Experience Proof"
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xl font-bold text-slate-900">
                Assigned Courses
              </h3>
              <span className="text-xs font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full uppercase tracking-widest">
                {courses.length} Items
              </span>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-3xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4">
                      <img
                        src={
                          course.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold">
                        LIVE
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 leading-snug group-hover:text-indigo-600">
                      {course.title || "Foundations of Computer Science"}
                    </h4>
                    <div className="flex items-center gap-4 mt-3 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> 12h Content
                      </span>
                      <span className="flex items-center gap-1">
                        <LayoutGrid size={14} /> 4 Modules
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
                <div className="inline-block p-4 bg-slate-50 rounded-full text-slate-400 mb-3">
                  <BookOpen size={32} />
                </div>
                <p className="text-slate-400 font-medium italic">
                  No courses have been curated by this teacher yet.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    banned: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${styles[status] || styles.pending}`}
    >
      {status}
    </span>
  );
}

function DocCard({ title, icon, url, subtitle }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl hover:border-indigo-300 transition group shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none">
            {title}
          </p>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>
      <ExternalLink
        size={18}
        className="text-slate-300 group-hover:text-indigo-500"
      />
    </a>
  );
}
