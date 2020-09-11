import { db, auth } from "./firebase";
import React, { useState, useEffect } from "react";
import Post from './Post';
import "./Home.css";

const Home = () => {

    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState("");

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


  console.log("home posts", posts);
  return (
    <div className="home__wrapper">
      {posts.map(({ id, post }) => (
        <Post
          postId={id}
          key={id}
          user={user}
          userName={post.userName}
          imageUrl={post.imageUrl}
          caption={post.caption}
        />
      ))}
    </div>
  );
}

export default Home