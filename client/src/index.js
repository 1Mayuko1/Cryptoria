import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import UserStore from "./store/UserStore";
import CryptocurrencyStore from "./store/CryptocurrencyStore";

export const Context = createContext(null)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          cryptocurrency: new CryptocurrencyStore()
      }}>
        <App />
      </Context.Provider>
  </React.StrictMode>
);
