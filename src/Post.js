import React from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar"

const Post = () => {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src="media/dracula.png" />
      <h3>Username</h3>
      </div>
      <img
        className="post__image"
        src="https://www.inspiredtaste.net/wp-content/uploads/2018/10/Homemade-Vegetable-Soup-Recipe-2-1200.jpg"
      />
    
      <h4 className="post__text">
        <strong>Count Dracula:</strong> Check out my soup!
      </h4>


    </div>
  );
}

export default Post