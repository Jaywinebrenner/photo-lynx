import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import "./imageUpload.css";
import { db, storage } from "./firebase";
import firebase from "firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Logo from "./media/photolynx-logo.png";

const ImageUpload = ({userName, setOpenImageUpload, openImageUpload}) => {


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
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState('');
  const [caption, setCaption] = useState('');

  const handleChange = (e) => {
    if (e.target.value[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress)
        },
        (error) => {
          // Error function
          console.log(error);
          alert(error.message)
        },
        () => {
          //complete function
          storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              userName: userName
            });

            setProgress(0);
            setCaption("");
            setImage(null);
            setOpenImageUpload(false)

          })
        }

      )
  }



  return (
    <Modal open={openImageUpload} onClose={() => setOpenImageUpload(false)}>
      <div style={modalStyle} className={classes.paper}>
        <center>
          <img className="app__headerImage" src={Logo} />
          <h5>Upload a Photo</h5>
        </center>
        <div className="imageUpload">
          {progress > 0 ? <progress
            className="imageUpload__progress"
            value={progress}
            max="100"
          /> : <div></div>}
          

          <Input
            type="text"
            placeholder="Enter a caption"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          />
          <Input type="file" onChange={handleChange} />
          <Button onClick={handleUpload} className="imageUpload__button">
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ImageUpload

