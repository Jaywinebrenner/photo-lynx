import React from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar"

const Post = ({imageUrl, userName, caption}) => {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src="media/dracula.png" />
        <h3>{userName}</h3>
      </div>
      <img className="post__image" src={imageUrl} />

      <h4 className="post__text">
        <strong>{userName}:</strong> {caption}
      </h4>
    </div>
  );
}

export default Post