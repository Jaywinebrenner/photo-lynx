import React, { useState, useEffect } from 'react';
import Logo from './media/photolynx-logo-with-tag.png'
import './App.css';
import { auth } from './firebase';
import { Button } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import ProfileImageUpload from './ProfileImageUpload';
import SignUpModal from './SignUpModal';
import SignInModal from "./SignInModal";
import { faCamera, faHome, faHeart, faUser, faBars, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, BrowserRouter as Router } from "react-router-dom";
//dropdown
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";


//Dropdown
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
}));


function App() {

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openImageUpload, setOpenImageUpload] = useState(false)
  const [openProfileImageUpload, setOpenProfileImageUpload] = useState(false)

  const [userName, setUserName] = useState('');
  const [posts, setPosts] = useState([]);

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('')


  //DropDown
  const classes = useStyles();
  const [selection, setSelection] = useState("");
  const handleChange = (event) => {
    setSelection(event.target.value);
  };




  console.log("user app", user);

  
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
        <div>{/* {alert("Please Login to upload Photos")} */}</div>
      )}

      <SignUpModal open={open} setOpen={setOpen} />
      <SignInModal openSignIn={openSignIn} setOpenSignIn={setOpenSignIn} />

      {/* HEADER */}
      <div className="app__header">
        <img className="app__headerImage" src={Logo} />

        <div className="app__welcomeTextWrapper">
          {user?.displayName ? (
            <h2 className="app__welcomeText">Welcome {user.displayName}</h2>
          ) : (
            <div></div>
          )}
        </div>
        {user ? (
          <React.Fragment>
            <ProfileImageUpload
              userName={user.displayName}
              openProfileImageUpload={openProfileImageUpload}
              setOpenProfileImageUpload={setOpenProfileImageUpload}
            />

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                {/* <FontAwesomeIcon
                  className="app__icon"
                  size="2x"
                  icon={faBars}
                /> */}
                Options
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selection}
                onChange={handleChange}
                label="Options"
              >
                <MenuItem onClick={() => auth.signOut()}>Log Out</MenuItem>
                <MenuItem onClick={() => setOpenProfileImageUpload(true)}>
                  Add Profile Picture
                </MenuItem>
              </Select>
            </FormControl>
          </React.Fragment>
        ) : (
          // <Button type="submit" onClick={() => auth.signOut()}>
          //   Log Out
          // </Button>

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

      <div className="app__posts">{/* <Home posts={posts} /> */}</div>
    </div>
  );
}

export default App;
