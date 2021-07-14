import "./App.css";
import SignIn from "./landing/signin";
import SignUp from "./landing/signup";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import AuthProvider from "./context/auth/AuthContext";
axios.defaults.withCredentials = true;

function App() {
  // const { loggedIn } = useAuth();
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={SignUp} />
          <Route path="/login" component={SignIn} />
          <Route path="/customer" component={Home} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
