import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddMoney from "./pages/AddMoney";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Admin from "./pages/Admin";

function App() {
  const path = window.location.pathname;

  if (path === "/register") return <Register />;
  if (path === "/dashboard") return <Dashboard />;
  if (path === "/add-money") return <AddMoney />;
  if (path === "/transfer") return <Transfer />;
  if (path === "/transactions") return <Transactions />;
  if (path === "/admin") return <Admin />;

  return <Login />;
}

export default App;
