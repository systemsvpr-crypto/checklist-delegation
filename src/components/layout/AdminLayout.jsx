// "use client";

// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   CheckSquare,
//   ClipboardList,
//   Home,
//   LogOut,
//   Menu,
//   Database,
//   ChevronDown,
//   ChevronRight,
//   Zap,
//   FileText,
//   X,
//   Play,
//   Pause,
//   KeyRound,
//   Video,
//   Calendar
// } from "lucide-react";

// export default function AdminLayout({ children, darkMode, toggleDarkMode }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isDataSubmenuOpen, setIsDataSubmenuOpen] = useState(false);
//   const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
//   const [username, setUsername] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);

//   // Check authentication on component mount
//   useEffect(() => {
//     const storedUsername = sessionStorage.getItem("username");
//     const storedRole = sessionStorage.getItem("role");

//     if (!storedUsername) {
//       // Redirect to login if not authenticated
//       navigate("/login");
//       return;
//     }

//     setUsername(storedUsername);
//     setUserRole(storedRole || "user");
//   }, [navigate]);

//   // Handle logout
//   const handleLogout = () => {
//     // sessionStorage.removeItem('username')
//     // sessionStorage.removeItem('role')
//     // sessionStorage.removeItem('department')
//     navigate("/login");
//   };

//   // Filter dataCategories based on user role
//   const dataCategories = [
//     //{ id: "main", name: "PURAB", link: "/dashboard/data/main" },
//     { id: "sales", name: "Checklist", link: "/dashboard/data/sales" },
//     {
//       id: "approval",
//       name: "Approval Pending",
//       link: "/dashboard/data/approval",
//     },
//     // { id: "service", name: "Security Guard", link: "/dashboard/data/service" },
//     // { id: "account", name: "Injection Molding", link: "/dashboard/data/account" },
//     // { id: "warehouse", name: "Packing(Mohan)", link: "/dashboard/data/warehouse" },
//     // { id: "purchase", name: "Packing(Guddu)", link: "/dashboard/data/purchase" },
//     // { id: "director", name: "Pipe", link: "/dashboard/data/director" },
//     // { id: "managing-director", name: "Garden", link: "/dashboard/data/managing-director" },
//     // { id: "coo", name: "Bend", link: "/dashboard/data/coo" },
//     // { id: "jockey", name: "Sanjay", link: "/dashboard/data/jockey" },
//   ];

//   const getAccessibleDepartments = () => {
//     const userRole = sessionStorage.getItem("role") || "user";
//     return dataCategories.filter(
//       (cat) => !cat.showFor || cat.showFor.includes(userRole)
//     );
//   };

//   const accessibleDepartments = getAccessibleDepartments();

//   // Update the routes array based on user role
//   const routes = [
//     {
//       href: "/dashboard/admin",
//       label: "Dashboard",
//       icon: Database,
//       active: location.pathname === "/dashboard/admin",
//       showFor: ["admin"], // Show for both roles
//     },
//     {
//       href: "/dashboard/quick-task",
//       label: "Quick Task Checklist",
//       icon: Zap,
//       active: location.pathname === "/dashboard/quick-task",
//       showFor: ["admin",], // Only both
//     },
//     {
//       href: "/dashboard/assign-task",
//       label: "Assign Task",
//       icon: CheckSquare,
//       active: location.pathname === "/dashboard/assign-task",
//       showFor: ["admin"], // Only show for admin
//     },

//     {
//       href: "/dashboard/delegation",
//       label: "Delegation",
//       icon: ClipboardList,
//       active: location.pathname === "/dashboard/delegation",
//       showFor: ["admin", "user"], // Only show for admin
//     },

//     ...accessibleDepartments.map((category) => ({
//       href: category.link || `/dashboard/data/${category.id}`,
//       label: category.name,
//       icon: FileText, // or any icon you prefer
//       active:
//         location.pathname ===
//         (category.link || `/dashboard/data/${category.id}`),
//       showFor: ["admin", "user"],
//     })),
//     {
//       href: "/dashboard/calendar",
//       label: "Calendar",
//       icon: Calendar,
//       active: location.pathname === "/dashboard/calendar",
//       showFor: ["admin", "user"], // show both
//     },
//     {
//       href: "/dashboard/license",
//       label: "License",
//       icon: KeyRound,
//       active: location.pathname === "/dashboard/license",
//       showFor: ["admin", "user"], // show both
//     },

//     {
//       href: "/dashboard/traning-video",
//       label: "Training Video",
//       icon: Video,
//       active: location.pathname === "/dashboard/traning-video",
//       showFor: ["admin", "user"], //  show both
//     },
//   ];

//   // Filter routes based on user role
//   const getAccessibleRoutes = () => {
//     const userRole = sessionStorage.getItem("role") || "user";
//     return routes.filter((route) => route.showFor.includes(userRole));
//   };

//   // Check if the current path is a data category page
//   const isDataPage = location.pathname.includes("/dashboard/data/");

//   // If it's a data page, expand the submenu by default
//   useEffect(() => {
//     if (isDataPage && !isDataSubmenuOpen) {
//       setIsDataSubmenuOpen(true);
//     }
//   }, [isDataPage, isDataSubmenuOpen]);

//   // Get accessible routes and departments
//   const accessibleRoutes = getAccessibleRoutes();
//   // const accessibleDepartments = getAccessibleDepartments();

//   // License Modal Component
//   const LicenseModal = () => {
//     // Function to convert YouTube URL to embed URL
//     const getYouTubeEmbedUrl = (url) => {
//       const regExp =
//         /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//       const match = url.match(regExp);
//       return match && match[2].length === 11
//         ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
//         : url;
//     };

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//         <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
//           {/* Modal Content */}
//           <div className="flex h-[80vh]"></div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div
//       className={`flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50`}
//     >
//       {/* Sidebar for desktop */}
//       <aside className="hidden w-64 flex-shrink-0 border-r border-blue-200 bg-white md:flex md:flex-col">
//         <div className="flex h-14 items-center border-b border-blue-200 px-4 bg-gradient-to-r from-blue-100 to-purple-100">
//           <Link
//             to="/dashboard/admin"
//             className="flex items-center gap-2 font-semibold text-blue-700"
//           >
//             <ClipboardList className="h-5 w-5 text-blue-600" />
//             <span>Checklist & Delegation</span>
//           </Link>
//         </div>
//         <nav className="flex-1 overflow-y-auto p-2">
//           <ul className="space-y-1">
//             {accessibleRoutes.map((route) => (
//               <li key={route.label}>
//                 {route.submenu ? (
//                   <div>
//                     <button
//                       onClick={() => setIsDataSubmenuOpen(!isDataSubmenuOpen)}
//                       className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
//                         route.active
//                           ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
//                           : "text-gray-700 hover:bg-blue-50"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <route.icon
//                           className={`h-4 w-4 ${
//                             route.active ? "text-blue-600" : ""
//                           }`}
//                         />
//                         {route.label}
//                       </div>
//                       {isDataSubmenuOpen ? (
//                         <ChevronDown className="h-4 w-4" />
//                       ) : (
//                         <ChevronRight className="h-4 w-4" />
//                       )}
//                     </button>
//                     {isDataSubmenuOpen && (
//                       <ul className="mt-1 ml-6 space-y-1 border-l border-blue-100 pl-2">
//                         {accessibleDepartments.map((category) => (
//                           <li key={category.id}>
//                             <Link
//                               to={
//                                 category.link ||
//                                 `/dashboard/data/${category.id}`
//                               }
//                               className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
//                                 location.pathname ===
//                                 (category.link ||
//                                   `/dashboard/data/${category.id}`)
//                                   ? "bg-blue-50 text-blue-700 font-medium"
//                                   : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 "
//                               }`}
//                               onClick={() => setIsMobileMenuOpen(false)}
//                             >
//                               {category.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 ) : (
//                   <Link
//                     to={route.href}
//                     className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
//                       route.active
//                         ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
//                         : "text-gray-700 hover:bg-blue-50"
//                     }`}
//                   >
//                     <route.icon
//                       className={`h-4 w-4 ${
//                         route.active ? "text-blue-600" : ""
//                       }`}
//                     />
//                     {route.label}
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
//         <div className="border-t border-blue-200 p-4 bg-gradient-to-r from-blue-50 to-purple-50 ">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
//                 <span className="text-sm font-medium text-white">
//                   {username ? username.charAt(0).toUpperCase() : "U"}
//                 </span>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-blue-700">
//                   {username || "User"} {userRole === "admin" ? "(Admin)" : ""}
//                 </p>
//                 <p className="text-xs text-blue-600">
//                   {username
//                     ? `${username.toLowerCase()}@example.com`
//                     : "user@example.com"}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {/* <button
//                 onClick={() => setIsLicenseModalOpen(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
//                 title="License & Help"
//               >
//                 <FileText className="h-4 w-4" />
//                 <span className="text-xs font-medium">License</span>
//               </button> */}
//               {toggleDarkMode && (
//                 <button
//                   onClick={toggleDarkMode}
//                   className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
//                 >
//                   {darkMode ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//                       />
//                     </svg>
//                   )}
//                   <span className="sr-only">
//                     {darkMode ? "Light mode" : "Dark mode"}
//                   </span>
//                 </button>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
//               >
//                 <LogOut className="h-4 w-4" />
//                 <span className="sr-only">Log out</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile menu button */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="md:hidden absolute left-4 top-3 z-50 text-blue-700 p-2 rounded-md hover:bg-blue-100"
//       >
//         <Menu className="h-5 w-5" />
//         <span className="sr-only">Toggle menu</span>
//       </button>

//       {/* Mobile sidebar */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 z-40 md:hidden">
//           <div
//             className="fixed inset-0 bg-black/20"
//             onClick={() => setIsMobileMenuOpen(false)}
//           ></div>
//           <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
//             <div className="flex h-14 items-center border-b border-blue-200 px-4 bg-gradient-to-r from-blue-100 to-purple-100">
//               <Link
//                 to="/dashboard/admin"
//                 className="flex items-center gap-2 font-semibold text-blue-700"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <ClipboardList className="h-5 w-5 text-blue-600" />
//                 <span>Checklist & Delegation</span>
//               </Link>
//             </div>
//             <nav className="flex-1 overflow-y-auto p-2 bg-white">
//               <ul className="space-y-1">
//                 {accessibleRoutes.map((route) => (
//                   <li key={route.label}>
//                     {route.submenu ? (
//                       <div>
//                         <button
//                           onClick={() =>
//                             setIsDataSubmenuOpen(!isDataSubmenuOpen)
//                           }
//                           className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
//                             route.active
//                               ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
//                               : "text-gray-700 hover:bg-blue-50"
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <route.icon
//                               className={`h-4 w-4 ${
//                                 route.active ? "text-blue-600" : ""
//                               }`}
//                             />
//                             {route.label}
//                           </div>
//                           {isDataSubmenuOpen ? (
//                             <ChevronDown className="h-4 w-4" />
//                           ) : (
//                             <ChevronRight className="h-4 w-4" />
//                           )}
//                         </button>
//                         {isDataSubmenuOpen && (
//                           <ul className="mt-1 ml-6 space-y-1 border-l border-blue-100 pl-2">
//                             {accessibleDepartments.map((category) => (
//                               <li key={category.id}>
//                                 <Link
//                                   to={
//                                     category.link ||
//                                     `/dashboard/data/${category.id}`
//                                   }
//                                   className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
//                                     location.pathname ===
//                                     (category.link ||
//                                       `/dashboard/data/${category.id}`)
//                                       ? "bg-blue-50 text-blue-700 font-medium"
//                                       : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                   }`}
//                                   onClick={() => setIsMobileMenuOpen(false)}
//                                 >
//                                   {category.name}
//                                 </Link>
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     ) : (
//                       <Link
//                         to={route.href}
//                         className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
//                           route.active
//                             ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
//                             : "text-gray-700 hover:bg-blue-50"
//                         }`}
//                         onClick={() => setIsMobileMenuOpen(false)}
//                       >
//                         <route.icon
//                           className={`h-4 w-4 ${
//                             route.active ? "text-blue-600" : ""
//                           }`}
//                         />
//                         {route.label}
//                       </Link>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//             <div className="border-t border-blue-200 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
//                     <span className="text-sm font-medium text-white">
//                       {username ? username.charAt(0).toUpperCase() : "U"}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-blue-700">
//                       {username || "User"}{" "}
//                       {userRole === "admin" ? "(Admin)" : ""}
//                     </p>
//                     <p className="text-xs text-blue-600">
//                       {username
//                         ? `${username.toLowerCase()}@example.com`
//                         : "user@example.com"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {toggleDarkMode && (
//                     <button
//                       onClick={toggleDarkMode}
//                       className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
//                     >
//                       {darkMode ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//                           />
//                         </svg>
//                       ) : (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//                           />
//                         </svg>
//                       )}
//                       <span className="sr-only">
//                         {darkMode ? "Light mode" : "Dark mode"}
//                       </span>
//                     </button>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 "
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span className="sr-only">Log out</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* License Modal */}
//       {isLicenseModalOpen && <LicenseModal />}

//       {/* Main content */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <header className="flex h-14 items-center justify-between border-b border-blue-200 bg-white px-4 md:px-6">
//           <div className="flex md:hidden w-8"></div>
//           <h1 className="text-lg font-semibold text-blue-700">
//             Checklist & Delegation
//           </h1>
//         </header>
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50">
//           {children}
//           <div className="fixed md:left-64 left-0 right-0 bottom-0 py-1 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-sm shadow-md z-10">
//             <a
//               href="https://www.botivate.in/" // Replace with actual URL
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hover:underline"
//             >
//               Powered by-<span className="font-semibold">Botivate</span>
//             </a>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckSquare,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Database,
  ChevronDown,
  ChevronRight,
  Zap,
  FileText,
  X,
  Play,
  Pause,
  KeyRound,
  Video,
  Calendar,
  CalendarCheck,
  CirclePlus,
  BookmarkCheck
} from "lucide-react";

export default function AdminLayout({ children, darkMode, toggleDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDataSubmenuOpen, setIsDataSubmenuOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [headerAnimatedText, setHeaderAnimatedText] = useState("")
  const [showAnimation, setShowAnimation] = useState(false)
// Authentication check + user info + header animation
useEffect(() => {
  const storedUsername = sessionStorage.getItem("username")
  const storedRole = sessionStorage.getItem("role")

  if (!storedUsername) {
    navigate("/login")
    return
  }

  setUsername(storedUsername)
  setUserRole(storedRole || "user")

  // Show welcome text animation once on mount
  const hasSeenAnimation = sessionStorage.getItem("hasSeenWelcomeAnimation")
  if (!hasSeenAnimation) {
    setShowAnimation(true)
    sessionStorage.setItem("hasSeenWelcomeAnimation", "true")

    let currentIndex = 0
    const welcomeText = `Welcome, ${storedUsername}`

    const typingInterval = setInterval(() => {
      if (currentIndex <= welcomeText.length) {
        setAnimatedText(welcomeText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setShowAnimation(false)
        // Start header animation after typing animation finishes
        startHeaderAnimation(storedUsername)
      }
    }, 80)

    return () => clearInterval(typingInterval)
  } else {
    // Show header text immediately without animation
    setHeaderAnimatedText(`Welcome, ${storedUsername}`)
  }
}, [navigate])

// Header typing animation function
function startHeaderAnimation(name) {
  let currentIndex = 0
  const headerText = `Welcome, ${name}`
  const headerInterval = setInterval(() => {
    if (currentIndex <= headerText.length) {
      setHeaderAnimatedText(headerText.slice(0, currentIndex))
      currentIndex++
    } else {
      clearInterval(headerInterval)
    }
  }, 80)
}

  // Handle logout
  const handleLogout = () => {
    navigate("/login");
  };

  // Filter dataCategories based on user role
  const dataCategories = [
    { id: "sales", name: "Checklist", link: "/dashboard/data/sales" },
    {
      id: "approval",
      name: "Approval Pending",
      link: "/dashboard/data/approval",
    },
  ];

  const getAccessibleDepartments = () => {
    const userRole = sessionStorage.getItem("role") || "user";
    return dataCategories.filter(
      (cat) => !cat.showFor || cat.showFor.includes(userRole)
    );
  };

  const accessibleDepartments = getAccessibleDepartments();

  // Update the routes array based on user role
  const routes = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      icon: Database,
      active: location.pathname === "/dashboard/admin",
      showFor: ["admin"],
    },
    {
      href: "/dashboard/quick-task",
      label: "Quick Task Checklist",
      icon: Zap,
      active: location.pathname === "/dashboard/quick-task",
      showFor: ["admin"],
    },
    {
      href: "/dashboard/assign-task",
      label: "Assign Task",
      icon: CheckSquare,
      active: location.pathname === "/dashboard/assign-task",
      showFor: ["admin"],
    },
    {
      href: "/dashboard/delegation",
      label: "Delegation",
      icon: ClipboardList,
      active: location.pathname === "/dashboard/delegation",
      showFor: ["admin", "user"],
    },
    ...accessibleDepartments.map((category) => ({
      href: category.link || `/dashboard/data/${category.id}`,
      label: category.name,
      icon: FileText,
      active:
        location.pathname ===
        (category.link || `/dashboard/data/${category.id}`),
      showFor: ["admin", "user"],
    })),
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: Calendar,
      active: location.pathname === "/dashboard/calendar",
      showFor: ["admin", "user"],
    },
    {
      href: "/dashboard/license",
      label: "License",
      icon: KeyRound,
      active: location.pathname === "/dashboard/license",
      showFor: ["admin", "user"],
    },
    {
      href: "/dashboard/traning-video",
      label: "Training Video",
      icon: Video,
      active: location.pathname === "/dashboard/traning-video",
      showFor: ["admin", "user"],
    },
  ];

  // Filter routes based on user role
  const getAccessibleRoutes = () => {
    const userRole = sessionStorage.getItem("role") || "user";
    return routes.filter((route) => route.showFor.includes(userRole));
  };

  // Check if the current path is a data category page
  const isDataPage = location.pathname.includes("/dashboard/data/");

  // If it's a data page, expand the submenu by default
  useEffect(() => {
    if (isDataPage && !isDataSubmenuOpen) {
      setIsDataSubmenuOpen(true);
    }
  }, [isDataPage, isDataSubmenuOpen]);

  const accessibleRoutes = getAccessibleRoutes();

  // License Modal Component
  const LicenseModal = () => {
    const getYouTubeEmbedUrl = (url) => {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11
        ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
        : url;
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          <div className="flex h-[80vh]"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-blue-200 bg-white md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-blue-200 px-4 bg-gradient-to-r from-blue-100 to-purple-100">
          <Link to="/dashboard/admin" className="flex items-center gap-2 font-semibold text-blue-700">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <span>Checklist & Delegation</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {accessibleRoutes.map((route) => (
              <li key={route.label}>
                {route.submenu ? (
                  <div>
                    <button
                      onClick={() => setIsDataSubmenuOpen(!isDataSubmenuOpen)}
                      className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        route.active
                          ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <route.icon
                          className={`h-4 w-4 ${route.active ? "text-blue-600" : ""}`}
                        />
                        {route.label}
                      </div>
                      {isDataSubmenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {isDataSubmenuOpen && (
                      <ul className="mt-1 ml-6 space-y-1 border-l border-blue-100 pl-2">
                        {accessibleDepartments.map((category) => (
                          <li key={category.id}>
                            <Link
                              to={category.link || `/dashboard/data/${category.id}`}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                                location.pathname === (category.link || `/dashboard/data/${category.id}`)
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={route.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      route.active
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    <route.icon
                      className={`h-4 w-4 ${route.active ? "text-blue-600" : ""}`}
                    />
                    {route.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-blue-200 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">
                  {username || "User"} {userRole === "admin" ? "(Admin)" : ""}
                </p>
                <p className="text-xs text-blue-600">
                  {username
                    ? `${username.toLowerCase()}@example.com`
                    : "user@example.com"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {toggleDarkMode && (
                <button
                  onClick={toggleDarkMode}
                  className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                >
                  {darkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 08 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                  <span className="sr-only">
                    {darkMode ? "Light mode" : "Dark mode"}
                  </span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden absolute left-4 top-3 z-50 text-blue-700 p-2 rounded-md hover:bg-blue-100"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </button>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex h-14 items-center border-b border-blue-200 px-4 bg-gradient-to-r from-blue-100 to-purple-100">
              <Link
                to="/dashboard/admin"
                className="flex items-center gap-2 font-semibold text-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <span>Checklist & Delegation</span>
              </Link>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 bg-white">
              <ul className="space-y-1">
                {accessibleRoutes.map((route) => (
                  <li key={route.label}>
                    {route.submenu ? (
                      <div>
                        <button
                          onClick={() => setIsDataSubmenuOpen(!isDataSubmenuOpen)}
                          className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            route.active
                              ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                              : "text-gray-700 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <route.icon
                              className={`h-4 w-4 ${route.active ? "text-blue-600" : ""}`}
                            />
                            {route.label}
                          </div>
                          {isDataSubmenuOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        {isDataSubmenuOpen && (
                          <ul className="mt-1 ml-6 space-y-1 border-l border-blue-100 pl-2">
                            {accessibleDepartments.map((category) => (
                              <li key={category.id}>
                                <Link
                                  to={category.link || `/dashboard/data/${category.id}`}
                                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                                    location.pathname === (category.link || `/dashboard/data/${category.id}`)
                                      ? "bg-blue-50 text-blue-700 font-medium"
                                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                  }`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={route.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          route.active
                            ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <route.icon
                          className={`h-4 w-4 ${route.active ? "text-blue-600" : ""}`}
                        />
                        {route.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-blue-200 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {username ? username.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      {username || "User"} {userRole === "admin" ? "(Admin)" : ""}
                    </p>
                    <p className="text-xs text-blue-600">
                      {username
                        ? `${username.toLowerCase()}@example.com`
                        : "user@example.com"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {toggleDarkMode && (
                    <button
                      onClick={toggleDarkMode}
                      className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                    >
                      {darkMode ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 08 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                          />
                        </svg>
                      )}
                      <span className="sr-only">
                        {darkMode ? "Light mode" : "Dark mode"}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-blue-700 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* License Modal */}
      {isLicenseModalOpen && <LicenseModal />}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-16 items-center justify-between border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 px-4 md:px-6 shadow-md">
  <div className="flex md:hidden w-8"></div>
  <div className="flex flex-col gap-1">
   
    {headerAnimatedText && (
      <div className="relative">
        <p className="text-lg md:text-xl font-['Poppins',_'Segoe_UI',_sans-serif] tracking-wide">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
            {headerAnimatedText}
          </span>
          <span className="inline-block animate-bounce ml-2 text-yellow-500">👋</span>
        </p>
      </div>
    )}
  </div>
</header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50 pb-20">
          {children}</main>

      {/* Mobile Footer Tabs - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-blue-200 shadow-lg z-50">
          {/* Navigation tabs */}
          <nav className="flex justify-around py-2">
            <Link
              to="/dashboard/admin"
              className={`flex flex-col items-center text-sm p-2 transition-colors ${
                location.pathname === "/dashboard/admin"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              aria-label="Dashboard"
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs">Home</span>
            </Link>
            
            <Link
              to="/dashboard/data/sales"
              className={`flex flex-col items-center text-sm p-2 transition-colors ${
                location.pathname === "/dashboard/data/sales"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              aria-label="Checklist"
            >
              <CalendarCheck className="w-6 h-6 mb-1" />
              <span className="text-xs">Checklist</span>
            </Link>

            {/* Assign Task - Only for Admin */}
            {userRole === "admin" && (
              <Link
                to="/dashboard/assign-task"
                className={`flex flex-col items-center text-sm p-2 transition-colors ${
                  location.pathname === "/dashboard/assign-task"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                aria-label="Assign Task"
              >
                <CirclePlus className="w-6 h-6 mb-1" />
                <span className="text-xs">Assign</span>
              </Link>
            )}
            
            <Link
              to="/dashboard/delegation"
              className={`flex flex-col items-center text-sm p-2 transition-colors ${
                location.pathname === "/dashboard/delegation"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              aria-label="Delegation"
            >
              <BookmarkCheck className="w-6 h-6 mb-1" />
              <span className="text-xs">Delegation</span>
            </Link>
          </nav>

          {/* Botivate footer */}
          <div className="w-full border-t border-blue-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-xs py-1">
            <a
              href="https://www.botivate.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Powered by-<span className="font-semibold">Botivate</span>
            </a>
          </div>
        </div>
        {/* Desktop Botivate footer */}
        <div className="fixed md:left-64 left-0 right-0 bottom-0 hidden md:block py-1 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-sm shadow-md z-10">
          <a
            href="https://www.botivate.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Powered by-<span className="font-semibold">Botivate</span>
          </a>
        </div>
      </div>
    </div>
  );
}
