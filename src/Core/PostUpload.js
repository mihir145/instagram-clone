import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import "./PostUpload.css";
import { storage, db } from "../firebase";
import firebase from "firebase";

const PostUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setImage(null);
            setCaption("");
            setProgress(0);
            alert("Post Uploaded Succesfully!");
          });
      }
    );
  };

  return (
    <div>
      <form className="postUpload_form">
        <center style={{ marginBottom: "20px" }}>
          <h2>Upload A Post</h2>
        </center>

        <progress max="100" value={progress}></progress>
        <Input
          className="postUpload__inputField"
          type="text"
          value={caption}
          placeholder="Enter Caption"
          onChange={(e) => setCaption(e.target.value)}
        />
        <Input
          type="file"
          className="postUpload__inputField"
          onChange={handleChange}
        />
        <Button onClick={handleUpload}>Upload</Button>
      </form>
    </div>
  );
};

export default PostUpload;
