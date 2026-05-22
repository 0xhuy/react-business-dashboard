// ============================================================
// APP
// ============================================================

// ===== Router =====
import { AppRouter } from "@/router";

// ===== Others =====
import { AuthProvider } from "./components/providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
