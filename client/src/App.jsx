// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import HomePage from "./pages/HomePage";


// function App() {
  
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//          <Route path="/home" element={
        
//             <HomePage/>
         
//           } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import HomePage from "./pages/HomePage";
import { useState } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState(null); // Store user

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/home" element={<HomePage currentUser={currentUser} />} />
        
      </Routes>
    </Router>
  );
}

export default App;
