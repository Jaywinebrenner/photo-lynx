import React, { useState, useEffect } from "react";
import { db, auth, storage } from "./firebase";
import { Button, Input } from "@material-ui/core";
import "./imageUpload.css";
import firebase from "firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Logo from "./media/photolynx-logo.png";

const ProfileImageUpload = ({
  userName,
  setOpenProfileImageUpload,
  openProfileImageUpload,
}) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Getting User
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user loggin in
        // console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    });
    return () => {
      // perform clean up
      unsubscribe();
    };
  }, [user, userName]);


  // MODAL STUFF

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [profileImage, setProfileImage] = useState("");
  const [progress, setProgress] = useState("");

  const handleChange = (e) => {
    if (e.target.value[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage
      .ref(`images/${profileImage.name}`)
      .put(profileImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref("images")
          .child(profileImage.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db

              //  db.collection("posts").doc(postId).collection("thumbnail").add({
              //    thumbnail: url,
              //  });

          
              db.collection("posts").add({
                thumbnail: url,
                userName: userName,
              });
    

            setProgress(0);
            setProfileImage(null);
            setOpenProfileImageUpload(false);
          });
      },
    );
  };

  // maybe?
  // const postComment = (event) => {
  //   event.preventDefault();

  //   db.collection("posts").doc(postId).collection("comments").add({
  //     text: comment,
  //     userName: user.displayName,
  //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //   });
  //   setComment("");
  //   setOpenComment(false);
  // };





  return (
    <Modal
      open={openProfileImageUpload}
      onClose={() => setOpenProfileImageUpload(false)}
    >
      <div style={modalStyle} className={classes.paper}>
        <center>
          <img className="app__headerImage" src={Logo} />
          <h5>Upload a Photo</h5>
        </center>
        <div className="imageUpload">
          {progress > 0 ? (
            <progress
              className="imageUpload__progress"
              value={progress}
              max="100"
            />
          ) : (
            <div></div>
          )}

          <Input type="file" onChange={handleChange} />
          <Button onClick={handleUpload} className="imageUpload__button">
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileImageUpload;
