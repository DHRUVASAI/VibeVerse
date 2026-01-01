import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>VibeVerse</h1>
          <p>Your mood. Your movie.</p>
        </header>
        
        <main className="app-main">
          {/* Your components will go here */}
          <p>Welcome to VibeVerse!</p>
        </main>
      </div>
    </Provider>
  );
}

export default App;
