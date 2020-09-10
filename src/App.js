import React, { useState, useEffect } from 'react';
import Logo from './media/photolynx-logo.png'
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import SignUpModal from './SignUpModal';
import SignInModal from "./SignInModal";
import { faCamera, faHome, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [userName, setUserName] = useState('');

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('')

  
  // useEffect runs a piece of code based on a specific condiction
  
  useEffect(() => {
    // Getting User
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user loggin in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    })
      return () => {
        // perform clean up
        unsubscribe();
      }

  }, [user, userName]);

  useEffect(() => {

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })

  }, []);


  return (
    <div className="app">
      {user?.displayName ? (
        <ImageUpload userName={user.displayName} />
      ) : (
        <h3>Please Login to upload photos</h3>
      )}

      <SignUpModal open={open} setOpen={setOpen} />
      <SignInModal openSignIn={openSignIn} setOpenSignIn={setOpenSignIn} />

      {/* HEADER */}
      <div className="app__header">
        <img className="app__headerImage" src={Logo} />
        <p className="app__subheader">An image sharing social media site</p>
        {user ? (
          <Button type="submit" onClick={() => auth.signOut()}>
            Log Out
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app__subheader">
        <FontAwesomeIcon onClick={() => alert("hi")}style={{ color: "lightgray", marginRight: "30px" }} size="2x" icon={faCamera} />
        <FontAwesomeIcon style={{ color: "lightgray", marginRight: "30px" }}  size="2x" icon={faHome} />
        <FontAwesomeIcon style={{ color: "lightgray", marginRight: "30px" }}  size="2x" icon={faHeart} />
        <FontAwesomeIcon style={{ color: "lightgray", marginRight: "30px" }}  size="2x" icon={faUser} />
      </div>

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          userName={post.userName}
          imageUrl={post.imageUrl}
          caption={post.caption}
        />
      ))}
    </div>
  );
}

export default App;
