import Wrapper from "./component/Wrapper";
import CSR from "./component/CSR";
import User from "./component/User";
import NotFound from "./component/notFound";
import { useRoutes } from "hookrouter";

// Define map of routes in pages
const routes = {
  '/': () => <CSR />,
  '/user/:id': ({id}) => <User id={id} />,
};

function App() {
  // Get current url
  const match = useRoutes(routes);

  return (
    // Parse URL & respond respectively
    <Wrapper content={match || <NotFound />}></Wrapper>
  );
}

export default App;
