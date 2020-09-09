import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import "./imageUpload.css";
import { db, storage } from "./firebase";
import firebase from "firebase";

const ImageUpload = ({userName}) => {

  const [image, setImage] = useState("");
  const [progress, setProgress] = useState('');
  const [caption, setCaption] = useState('');

  const handleChange = (e) => {
    if (e.target.value[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image).

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
            })
          })
        }

      )
  }



  return (
    <div className="imageUpload">
      {/* Caption Input */}

      {/* File Picker */}

      {/* Post Button */}

      <Input type="text" placeholder="Enter a caption" onChange={e => setCaption(e.target.value)} value={caption}/>
      <Input type="file" onChange={handleChange}/>
      <Button onClick={handleUpload} className="imageUpload__button">
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload

