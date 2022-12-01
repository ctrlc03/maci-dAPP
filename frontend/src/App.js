import './App.css';
import Home from './pages/home';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import NavBarMACI from './components/navbar/navbar';

import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import React from 'react'
 
const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <NavBarMACI />
        <Home />
      </WagmiConfig>
    </div>
  );
}

export default App;
