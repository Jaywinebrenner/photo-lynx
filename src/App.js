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
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import Home from './Home'


function App() {

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openImageUpload, setOpenImageUpload] = useState(false)

  const [userName, setUserName] = useState('');
  const [posts, setPosts] = useState([]);

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

  console.log("posts app", posts);
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
        <Link to="/Home">
          <FontAwesomeIcon className="app__icon" size="2x" icon={faHome} />
        </Link>
        <FontAwesomeIcon
          className="app__icon"
          onClick={() => setOpenImageUpload(true)}
          size="2x"
          icon={faCamera}
        />

        <FontAwesomeIcon className="app__icon" size="2x" icon={faHeart} />
        <Link to="/Profile">
          <FontAwesomeIcon className="app__icon" size="2x" icon={faUser} />
        </Link>
      </div>
      <div className="app__welcomeTextWrapper">
        {user?.displayName ? (
          <h2 className="app__welcomeText">Welcome {user.displayName}</h2>
        ) : (
          <div></div>
        )}
      </div>

      <div className="app__posts">
        {/* <Home posts={posts} /> */}
      </div>
    </div>
  );
}

export default App;
