import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Invitation from "./pages/Invitation";
import Manage from "./pages/Manage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Invitation />} />
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "font-body border border-[#E5E1D8] bg-white text-[#2B2824]",
          },
        }}
      />
    </div>
  );
}

export default App;
