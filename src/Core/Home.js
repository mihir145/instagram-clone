import React, { useState, useEffect } from "react";
import Post from "./Post";
import Modal from "@material-ui/core/Modal";
import { makeStyles, Button, Input } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Avatar from "@material-ui/core/avatar";
import { db, auth } from "../firebase";
import PostUpload from "./PostUpload";

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  menu: {
    position: "absolute",
    width: 200,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[10],
    borderRadius: "10px",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));
const Home = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [openSignedIn, setOpenSignedIn] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);
  const [openPostUpload, setOpenPostUpload] = useState(false);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
      setEmail("");
      setPassword("");
    });

    setOpenSignedIn(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        console.log(authuser);
        setUser(authuser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={classes.paper} style={modalStyle}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                alt="instagram clone"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
            </center>
            <Input
              className="signup_input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="signup_input"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="signup_input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignedIn} onClose={() => setOpenSignedIn(false)}>
        <div className={classes.paper} style={modalStyle}>
          <form className="app__signin">
            <center>
              <img
                className="app__headerImage"
                alt="instagram clone"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
            </center>
            <Input
              className="signup_input"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="signup_input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign in</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          alt="instagram clone"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />
        {user ? (
          <div className="app__logoutContainer">
            <Modal open={openMenuModal} onClose={() => setOpenMenuModal(false)}>
              <div className={classes.menu} style={modalStyle}>
                <Button
                  onClick={() => {
                    setOpenPostUpload(true);
                    setOpenMenuModal(false);
                  }}
                >
                  Upload Post
                </Button>
                <Button onClick={() => auth.signOut()}>Logout</Button>
              </div>
            </Modal>
            <Modal
              open={openPostUpload}
              onClose={() => setOpenPostUpload(false)}
            >
              <div className={classes.menu} style={modalStyle}>
                <Button
                  onClick={() => setOpenPostUpload(false)}
                  style={{ marginBottom: "10px" }}
                >
                  <ArrowBackIcon />
                  Back
                </Button>
                <PostUpload username={user.displayName} />
              </div>
            </Modal>
            <Avatar
              className="post_avatar"
              alt={user.displayName}
              src="/static/images/avatar/1.jpg"
              onClick={() => setOpenMenuModal(true)}
            />
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpen(true)}>Sign up</Button>
            <Button onClick={() => setOpenSignedIn(true)}>Sign in</Button>
          </div>
        )}
      </div>

      <div className="app__postContainer">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))}
      </div>
      <footer>
        <h3>
          Made by -{" "}
          <a href="https://www.instagram.com/mihir_muchhadiya_1202/">
            Mihir Muchhadiya
          </a>
        </h3>
        <div className="socials__container">
          <a href="https://github.com/mihir145" target="blank">
            <i className="fa fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/mihir-muchhadiya-66970116a/"
            target="blank"
          >
            <i className="fa fa-linkedin"></i>
          </a>
          <a href="https://twitter.com/MuchhadiyaMihir" target="blank">
            <i className="fa fa-twitter"></i>
          </a>
          <a href="mailto:mihirmuchhadiya145@gmail.com" target="blank">
            <i className="fa fa-envelope"></i>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
