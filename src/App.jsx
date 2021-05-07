import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CSR from "./Component/Pages/CSR/CSR";
import Home from "./Component/Pages/Home/Home";
import NotFound from "./Component/Pages/NotFound/NotFound";
import User from "./Component/Pages/User/User";
import TEMP from "./Component/Pages/TEMP";
import Footer from "./Component/Footer";
import Header from "./Component/Header";
import Admin from "./Component/Pages/Admin/Admin";
import { generateKey, setLabelHeight } from "./Component/Helper";


// Overidde window resize to set label height on every size change
window.onresize = () => setLabelHeight();


function App(props) {
  const loginKey = generateKey();
  const baseURL = window.location.href.substring(0, window.location.href.indexOf("/", 7)) + "/";

  return (
    <div>
      <Header />
      <Router>
        <Switch>
          <Route path="/" component={() => <Home login={loginKey} url={baseURL} />} exact />
          <Route path="/csr" component={() => <CSR login={loginKey} url={baseURL} />} exact />
          <Route path="/admin/:id" component={(props) => <Admin login={loginKey} url={baseURL} />} exact />
          <Route path="/user/:id" component={(props) => <User login={loginKey} url={baseURL} />} exact />
          <Route path="/temp" component={() => <TEMP login={loginKey} url={baseURL} />} exact />
          <Route path="*" component={() => <NotFound />} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
