import { Sidebar } from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Journals } from "./pages/Journals";
import { Todos } from "./pages/Todos";
import { Goals } from "./pages/Goals";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/journals" element={<Journals />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
