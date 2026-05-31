 import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: "500",
          },
        }}
      />

      <AppRoutes />
    </>
  );
}

export default App;