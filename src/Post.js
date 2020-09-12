import React, {useState, useEffect} from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar"
import { db } from './firebase';
import {
  faHeart,
  faComment
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Logo from "./media/photolynx-logo.png";

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


//userName = Person who wrote the post. 
// user = Person who is signed in

const Post = ({ postId, imageUrl, userName, caption, user, thumbnail }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openComment, setOpenComment] = useState(false);
  // const [allThumbnails, setAllThumbnails] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      userName: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
    setOpenComment(false);
  };
 


const renderPost = 
  // return <Avatar className="post__avatar" src={thumbnail} />;
thumbnail?.thumbnail

  thumbnail && console.log("thumbnail on post", thumbnail.thumbnail);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src={imageUrl} />
        <Avatar className="post__avatar" src={renderPost} />
 
        <h3>{userName}</h3>
      </div>
      <img className="post__image" src={imageUrl} />
      <div className="app__subheader">
        <FontAwesomeIcon
          onClick={() => setOpenComment(true)}
          className="app__icon"
          size="2x"
          icon={faComment}
        />

        <FontAwesomeIcon className="app__icon" size="2x" icon={faHeart} />
      </div>

      <h4 className="post__text">
        <strong>{userName}:</strong> {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.userName}</strong> {comment.text}
          </p>
        ))}
      </div>

      <Modal open={openComment} onClose={() => setOpenComment(false)}>
        <div style={modalStyle} className={classes.paper}>
          <img className="app__headerImage" src={Logo} />
          <form className="post__commentBox">
            <input
              className="post__input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="post__button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Post