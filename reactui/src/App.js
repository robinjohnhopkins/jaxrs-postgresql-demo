import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Numbers from './components/Numbers';

function App() {
    var smeg=process.env.REACT_APP_PUBLIC_URL;
    console.log('smeg' + smeg);
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Shinanigans
        </a>
      </header>
      <Numbers />
    </div>
  );
}

export default App;
