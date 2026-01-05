// import { Link, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const location = useLocation();
//   const activeClass = "bg-amber-100 border-amber-400 font-bold";

//   return (
//     <header className="border-2 border-amber-700 rounded-lg m-2 bg-gradient-to-r from-amber-700 to-amber-800 shadow-lg">
//       <div className="mx-auto max-w-7xl px-6 py-4">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//           {/* Logo */}
//           <Link to="/" className="hover:scale-105 transition-transform">
//             <h1 className="font-playfair text-3xl font-bold text-amber-50">
//               Dine<span className="text-amber-200">Wise</span>
//             </h1>
//           </Link>

//           {/* Navigation Links */}
//           <nav className="flex flex-wrap justify-center gap-4">
//             <Link
//               to="/"
//               className={`px-4 py-2 rounded-full border-2 border-amber-500 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
//                 location.pathname === '/' ? activeClass : ''
//               }`}
//             >
//               Home
//             </Link>
            
//             <Link
//               to="/tables"
//               className={`px-4 py-2 rounded-full border-2 border-amber-400 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
//                 location.pathname === '/tables' ? activeClass : ''
//               }`}
//             >
//               Live Tables
//             </Link>
            
//             <Link
//               to="/orders"
//               className={`px-4 py-2 rounded-full border-2 border-amber-300 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
//                 location.pathname === '/orders' ? activeClass : ''
//               }`}
//             >
//               Orders
//             </Link>
            
//             <Link
//               to="/menu"
//               className={`px-4 py-2 rounded-full border-2 border-amber-200 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
//                 location.pathname === '/menu' ? activeClass : ''
//               }`}
//             >
//               Our Menu
//             </Link>


//             <Link
//               to="/dish-popularity"
//               className={`px-4 py-2 rounded-full border-2 border-amber-100 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
//                 location.pathname === '/dish-popularity' ? activeClass : ''
//               }`}
//             >
//               Dish Popularity
//             </Link>

//                         {/* New Inventory Link */}
//                         <Link
//               to="/inventory"
//               className={`px-4 py-2 rounded-full border-2 border-amber-100 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
//                 location.pathname === '/inventory' ? activeClass : ''
//               }`}
//             >
//               Inventory
//             </Link>
            
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;



import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton.jsx'; // Import the LogoutButton

const Navbar = () => {
  const location = useLocation();
  const activeClass = "bg-amber-100 border-amber-400 font-bold";

  // Check if the user is logged in by checking for the token
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <header className="border-2 border-amber-700 rounded-lg m-2 bg-gradient-to-r from-amber-700 to-amber-800 shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="hover:scale-105 transition-transform">
            <h1 className="font-playfair text-3xl font-bold text-amber-50">
              Dine<span className="text-amber-200">Wise</span>
            </h1>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full border-2 border-amber-500 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/' ? activeClass : ''
              }`}
            >
              🛖 Home
            </Link>

            <Link
              to="/tables"
              className={`px-4 py-2 rounded-full border-2 border-amber-400 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/tables' ? activeClass : ''
              }`}
            >
              🍴 Live Tables
            </Link>

            <Link
              to="/orders"
              className={`px-4 py-2 rounded-full border-2 border-amber-300 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/orders' ? activeClass : ''
              }`}
            >
              🍽️ Orders
            </Link>

            <Link
              to="/menu"
              className={`px-4 py-2 rounded-full border-2 border-amber-200 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/menu' ? activeClass : ''
              }`}
            >
              📕 Our Menu
            </Link>

            {/* NEW: AI Recommendations Link */}
            <Link
              to="/ai-recommendations"
              className={`px-4 py-2 rounded-full border-2 border-amber-150 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/ai-recommendations' || location.pathname.includes('/ai-recommendations/') 
                  ? activeClass : ''
              }`}
            >
              🤖 AI Recommendations
            </Link>

            <Link
              to="/salad-builder"
              className={`px-4 py-2 rounded-full border-2 border-amber-150 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/salad-builder' ? activeClass : ''
              }`}
            >
              🥬 Build Salad
            </Link>

            <Link
              to="/dish-popularity"
              className={`px-4 py-2 rounded-full border-2 border-amber-100 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/dish-popularity' ? activeClass : ''
              }`}
            >
              🔥 Dish Popularity
            </Link>

            {/* New Inventory Link */}
            {/* <Link
              to="/inventory"
              className={`px-4 py-2 rounded-full border-2 border-amber-100 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/inventory' ? activeClass : ''
              }`}
            >
              Inventory
            </Link> */}

            <Link
              to="/reviews"
              className={`px-4 py-2 rounded-full border-2 border-amber-150 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/reviews' ? activeClass : ''
              }`}
            >
              📝 Reviews
            </Link>


             {/* <Link
              to="/sentiment-analysis"
              className={`px-4 py-2 rounded-full border-2 border-amber-150 bg-amber-600/20 text-amber-100 hover:bg-amber-600/40 transition-all duration-200 ${
                location.pathname === '/sentiment-analysis' ? activeClass : ''
              }`}
            >
              📊 Feedback Analysis
            </Link>  */}
          </nav>

          {/* Conditionally render Logout Button if the user is logged in */}
          {isLoggedIn && <LogoutButton />}  {/* Render logout button only when logged in */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

