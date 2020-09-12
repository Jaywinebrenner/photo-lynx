import React, { useState, useEffect } from "react";
import "./profile.css";
import { db, auth } from "./firebase";
import Post from './Post'

const Profile = () => {

 

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

{user && console.log("userName", user.displayName);}

const ProfilePosts = 
          posts.map(({ id, post }) => {
            if (user?.displayName === post.userName) {
              return (
                <Post
                  postId={id}
                  key={id}
                  user={user}
                  userName={post.userName}
                  imageUrl={post.imageUrl}
                  caption={post.caption}
                />
              );
              
            }

          })
 
  return (
    <div className="profile__wrapper">
      <div className="profile__wrapper">

        {posts && ProfilePosts}

      </div>
    </div>
  );
}

export default Profile