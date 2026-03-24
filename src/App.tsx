import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DevBuilds from './pages/DevBuilds';
import Releases from './pages/Releases';
import Docs from './pages/Docs';



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/devbuilds/:version?/:build_number?" element={<DevBuilds />} />
        <Route path="/devbuilds" element={<DevBuilds />} />
        <Route path="/releases/:version?/:build_number?" element={<Releases />} />
        <Route path="/docs/*" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
