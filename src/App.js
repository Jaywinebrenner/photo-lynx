import React from 'react';
import './App.css';
import Logo from './media/logo.png'
import Post from './Post'

function App() {
  return (
    <div className="app">
    
      {/* HEADER */}
      <div className="app__header">
        <img className="app__headerImage" src={Logo} />
      </div>


      {/* POSTS */}
      <Post/>


      {/* POSTS */}

    </div>
  );
}

export default App;
