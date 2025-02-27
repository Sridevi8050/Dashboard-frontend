
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//   import Loginregister from './components/Loginregister';
  
//   function App() {
//     return (
//       <Router>
//         <div>
//          <Loginregister/>
//         </div>
//       </Router>
//     );
//   }
  
//   export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginregister from "./components/Loginregister";
import Admin from "./components/Admin.jsx";
import User from "./components/User.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginregister />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  );
}