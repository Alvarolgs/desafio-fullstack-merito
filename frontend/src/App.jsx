import { useState } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Fundos from "./pages/Fundos";
import Movimentacoes from "./pages/Movimentacoes";

const PAGES = [
  { id: "dashboard", label: " Dashboard" },
  { id: "fundos", label: "Fundos" },
  { id: "movimentacoes", label: "Movimentações" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Merito <span>Invest</span>
        </div>
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={`nav-item ${page === p.id ? "active" : ""}`}
            onClick={() => setPage(p.id)}
          >
            {p.label}
          </button>
        ))}
      </aside>

      <main className="main-content">
        {page === "dashboard" && <Dashboard />}
        {page === "fundos" && <Fundos />}
        {page === "movimentacoes" && <Movimentacoes />}
      </main>
    </div>
  );
}
