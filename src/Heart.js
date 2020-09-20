import React, { useState, useEffect } from "react";
import "./heart.css"
import {
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db, auth } from "./firebase";


const Heart = () => {

    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState("");

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
      });
      return () => {
        // perform clean up
        unsubscribe();
      };
    }, [user, userName]);

    useEffect(() => {
      db.collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            })),
          );
        });
    }, []);

    console.log("posts on HEART", posts);



      // const renderPost = posts.map(({ id, post }) => (
      //   <Post
      //     postId={id}
      //     key={id}
      //     user={user}
      //     userName={post.userName}
      //     imageUrl={post.imageUrl}
      //     caption={post.caption}
      //     thumbnail={correctThumb}
      //     setLocalLikes={setLocalLikes}
      //     localLikes={localLikes}
      //   />
      // ));

     


  return (
    <div className="heart">
      <h5 className="heart__text">
        You have accumulated this many hearts. This many people love you.
      </h5>

      <FontAwesomeIcon
        className="heart__icon"
        size="6x"
        icon={faHeart}
      />
    </div>
  );
}

export default Heart