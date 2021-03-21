import Wrapper from "./component/Wrapper";
import CSR from "./component/CSR";
import User from "./component/User";
import NotFound from "./component/notFound";
import Thanks from "./component/Thank";
import Admin from "./component/Admin";
import { useRoutes } from "hookrouter";

// Define map of routes in pages
const routes = {
  '/': () => <CSR />,
  '/user/:id': ({id}) => <User id={id} />,
  '/thanks': () => <Thanks />,
  '/admin/:id': ({id}) => <Admin id={id} />
};

function App() {
  // Get current url
  const match = useRoutes(routes);

  return (
    // Parse URL & respond respectively
    <Wrapper content={match || <NotFound />} />
  );
}

export default App;
