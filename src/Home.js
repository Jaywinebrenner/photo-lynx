import { db, auth } from "./firebase";
import React, { useState, useEffect } from "react";
import Post from './Post';
import "./Home.css";

const Home = ({ setLocalLikes , localLikes, disliked, setDisliked}) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [posts, setPosts] = useState([]);
  const [allThumbnails, setAllThumbnails] = useState([]);
  // const [thumbnail, setThumbnail] = useState(null);
  const [userName, setUserName] = useState("");

  // useEffect runs a piece of code based on a specific condiction

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

  // // Get Profile Photos
  // useEffect(() => {
  //   db.collection("profiles").onSnapshot((snapshot) => {
  //     setAllThumbnails(snapshot.docs.map((doc) => doc.data()));
  //   });
  // }, []);

  let correctThumb = null;
  if (allThumbnails) {
    correctThumb = allThumbnails.find((x) => x.userName === user?.displayName);
  }
  // console.log("correct thumbnail", correctThumb);

  console.log("user", user);
  posts && console.log("posts", posts[0]);

  const renderPost = posts.map(({ id, post }) => (
    <Post
      postId={id}
      key={id}
      user={user}
      userName={post.userName}
      imageUrl={post.imageUrl}
      caption={post.caption}
      thumbnail={correctThumb}
      setLocalLikes={setLocalLikes}
      localLikes={localLikes}
      disliked={disliked}
      setDisliked={setDisliked}
    />
  ));

  // console.log("home posts", allThumbnails);

  return <div className="home__wrapper">{renderPost}</div>;
};

export default Home