import { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  PlusCircle,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

const avatarFallback =
  "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000";

const getUserId = (user) => user?._id || user?.id;

export default function TeacherNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const teacherId = getUserId(user);
  const dashboardPath = token && teacherId ? `/teacher-dashboard/${teacherId}` : "/teacher-auth";
  const createPath =
    token && teacherId
      ? `/teacher-dashboard/${teacherId}/create-course`
      : "/teacher-auth";

  const navItems = [
    { label: "Home", path: "/teacher-home", icon: Home },
    { label: "Courses", path: dashboardPath, icon: BookOpen },
    { label: "Create", path: createPath, icon: PlusCircle },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  const goTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <header className="fixed left-0 right-0 top-0 z-[999] px-3 py-3 sm:px-5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[1.5rem] border border-slate-200/70 bg-white/90 px-4 shadow-2xl shadow-slate-950/10 backdrop-blur-xl sm:px-5">
        <button
          onClick={() => goTo("/teacher-home")}
          className="group flex cursor-pointer items-center gap-3"
          aria-label="Go to teacher home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition group-hover:-translate-y-0.5 group-hover:bg-teal-700">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="text-lg font-black leading-5 text-slate-950">
              LearnSphere
            </p>
            <p className="hidden text-xs font-bold uppercase text-teal-700 sm:block">
              Teacher studio
            </p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 rounded-2xl bg-slate-50 p-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                onClick={() => goTo(item.path)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${
                  active
                    ? "bg-slate-950 text-white shadow-lg"
                    : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {token ? (
            <div className="group relative">
              <button className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
                <img
                  src={user?.profilePicture || avatarFallback}
                  alt="Profile"
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <div className="max-w-32 text-left">
                  <p className="truncate text-sm font-black text-slate-950">
                    {user?.username || "Teacher"}
                  </p>
                  <p className="text-xs font-bold text-slate-500">TEACHER</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 transition group-hover:rotate-180" />
              </button>

              <div className="absolute right-0 top-full h-3 w-full" />
              <div className="pointer-events-none absolute right-0 mt-3 w-56 origin-top-right scale-95 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl shadow-slate-950/10 transition duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
                <button
                  onClick={() => goTo(dashboardPath)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo("/teacher-auth")}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 hover:shadow-sm"
              >
                Login
              </button>
              <button
                onClick={() => goTo("/teacher-auth")}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl"
              >
                <Sparkles className="h-4 w-4" />
                Register
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <MobileMenu
          navItems={navItems}
          user={user}
          token={token}
          onClose={() => setIsMenuOpen(false)}
          onLogout={handleLogout}
          onNavigate={goTo}
          activePath={location.pathname}
        />
      )}
    </header>
  );
}

const MobileMenu = ({
  navItems,
  user,
  token,
  onClose,
  onLogout,
  onNavigate,
  activePath,
}) => (
  <div className="fixed inset-0 z-[1000] lg:hidden">
    <button
      className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-sm"
      onClick={onClose}
      aria-label="Close menu"
    />
    <aside className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
      <div className="bg-slate-950 p-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <GraduationCap className="h-6 w-6 text-teal-200" />
            </div>
            <div>
              <p className="text-lg font-black">LearnSphere</p>
              <p className="text-xs font-bold uppercase text-teal-200">
                Teacher studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {token && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <img
              src={user?.profilePicture || avatarFallback}
              alt="Profile"
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-black">{user?.username || "Teacher"}</p>
              <p className="text-sm font-semibold text-slate-300">TEACHER</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            activePath === item.path || activePath.startsWith(item.path);

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.path)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left font-black transition ${
                active
                  ? "bg-slate-950 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-50 hover:text-teal-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-200 p-4">
        {token ? (
          <button
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 font-black text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        ) : (
          <button
            onClick={() => onNavigate("/teacher-auth")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-700"
          >
            <UserRound className="h-5 w-5" />
            Login or Register
          </button>
        )}
      </div>
    </aside>
  </div>
);
