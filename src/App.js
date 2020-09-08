import React, { useState, useEffect } from 'react';
import './App.css';
import Logo from './media/logo.png'
import Post from './Post';
import { db } from './firebase'

function App() {

  console.log("db", db);
  const [posts, setPosts] = useState([])


  // useEffect runs a piece of code based on a specific condiction

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => doc.data()))
    })
  }, []);


  return (
    <div className="app">
      {/* HEADER */}
      <div className="app__header">
        <img className="app__headerImage" src={Logo} />
      </div>

      {posts.map(post => 
          <Post userName={post.userName} imageUrl={post.imageUrl} caption={post.caption}/>
      )}


    </div>
  );
}

export default App;
