import React from 'react';
import './App.css';
import GameAssistant from './components/GameAssistant';
import Footer from './components/Footer';
import './styles/main.scss';


function App() {
  return (
    <div className="App">
      <main>
        <GameAssistant />
        <Footer />
      </main>
    </div>
  );
}

export default App;
