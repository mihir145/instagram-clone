import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/avatar";
import "./Post.css";
import { db } from "../firebase";
import { Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import firebase from "firebase";

const Post = ({ username, user, imageUrl, caption, postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    var unsubscribe;
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

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="post_image" src={imageUrl} alt={username} />
      <h3 className="post_text">
        <strong>{username}</strong> {caption}
      </h3>

      <div className="comment_list">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="comment_form">
          <input
            type="text"
            value={comment}
            className="comment_box"
            onChange={(e) => setComment(e.target.value)}
            placeholder="Post Comment...."
          />
          <Button type="submit" disabled={!comment} onClick={postComment}>
            <SendIcon />
          </Button>
        </form>
      )}
    </div>
  );
};

export default Post;
