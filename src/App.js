
import './App.css';
import Routes from './routes'
import { Provider } from "react-redux";
import initStore from "./redux/store";
import Theme from './styles/theme';
import 'react-perfect-scrollbar/dist/css/styles.css';

export const store = initStore({});

const App = () => {
  return (
    <Provider store={store}>
        <Theme>
            <Routes />
        </Theme>
    </Provider>
  );
}

export default App;
