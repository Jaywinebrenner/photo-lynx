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
  const [openImageUpload, setOpenImageUpload] = useState(false)
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
        <ImageUpload
          userName={user.displayName}
          openImageUpload={openImageUpload}
          setOpenImageUpload={setOpenImageUpload}
        />
      ) : (
        <div>
          {console.log("Please Login to Upload photos")}
          {/* {alert("Please Login to upload Photos")} */}
        </div>
      )}

      <SignUpModal open={open} setOpen={setOpen} />
      <SignInModal openSignIn={openSignIn} setOpenSignIn={setOpenSignIn} />

      {/* HEADER */}
      <div className="app__header">
        <img className="app__headerImage" src={Logo} />
        <p className="app__subheaderText">An image sharing social media site</p>
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
        <FontAwesomeIcon
          className="app__icon"
          size="2x"
          icon={faHome}
        />
        <FontAwesomeIcon
          className="app__icon"
          onClick={() => setOpenImageUpload(true)}
          size="2x"
          icon={faCamera}
        />
        <FontAwesomeIcon
          className="app__icon"
          size="2x"
          icon={faHeart}
        />
        <FontAwesomeIcon
          className="app__icon"
          size="2x"
          icon={faUser}
        />
      </div>

      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            userName={post.userName}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
