import React, { useState } from 'react'; 
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Subjects from './pages/Subjects';
import Units from './pages/Units';
import QuestionTypes from './pages/QuestionTypes';
import Practice from './pages/Practice';




import 'katex/dist/katex.min.css';



import Contact from './components/ContactForm'; // <-- Import new Contact page

import AskAssistant from './shared/AskAssistant';
import Navbar from './components/Navbar'; // <-- Import new Navbar
import Footer from './components/Footer';


import ScrollToTop from './utils/ScrollToTop';


export default function App() {

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  return (
    <div className="app-root">
      {/* Pass the function to open the assistant to the Navbar */}
      <ScrollToTop />
      <Navbar onAskAiClick={() => setIsAssistantOpen(true)} />

      {/* Pass the state and setter to the Assistant itself */}
      <AskAssistant isOpen={isAssistantOpen} setIsOpen={setIsAssistantOpen} />
      
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          
      
          <Route path="/classes/:classId/subjects" element={<Subjects />} />
          <Route path="/classes/:classId/subjects/:subject/units" element={<Units />} />
          <Route path="/practice/:classId/:subject/:unit_no/:unit_name" element={<QuestionTypes />} />
<Route path="/practice/:classId/:subject/:unit_no/:unit_name/:type" element={<Practice />} />

<Route path="/contact" element={<Contact />} /> {/* <-- Add Contact route */}

<Route path="*" element={<NotFoundPage />} />

 </Routes>
      </main>
      <Footer />
    </div>
  );
}
