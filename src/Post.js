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


//userName = Person who wrote the post. 
// user = Person who is signed in

const Post = ({postId, imageUrl, userName, caption, user}) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

    useEffect(() => {
      let unsubscribe;
      if (postId) {
        unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        })
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
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
        }

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src="media/dracula.png" />
        <h3>{userName}</h3>
      </div>
      <img className="post__image" src={imageUrl} />
      <div className="app__subheader">
  
        <FontAwesomeIcon className="app__icon" size="2x" icon={faComment} />

        <FontAwesomeIcon className="app__icon" size="2x" icon={faHeart} />
    

      </div>

      <h4 className="post__text">
        <strong>{userName}:</strong> {caption}
      </h4>
      <div className="post__comments">

          {
            comments.map((comment) => (
              <p>
                <strong>{comment.userName}</strong> {comment.text}
              </p>
            ))
          }

      </div>

      {user && 
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
      }

    </div>
  );
}

export default Post