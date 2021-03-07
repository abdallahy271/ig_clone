import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle);

  const [ posts, setPosts ] = useState([])
  const [ open, setOpen ] = useState(false)
  const [ openSignIn, setOpenSignIn ] = useState(false)

  const [ username, setUsername ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in
        console.log(authUser)
        setUser(authUser)

      }else{
        //user has logged out
        setUser(null)

      }
    })
    return () => {
      //perform clean up
      unsubscribe()
    }
  }, [ user, username])
  //runs a piece of code bsed on a specific condition
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //everytime a change happens, fire this
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  },[])

  const signUp = (e) => {
    e.preventDefault()
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile(
        {
          displayName: username
        }
      )
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (e) => {
    e.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="app">
    
      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>

        <form className="app__signup">
          <center>
          <img
            className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""/>
          </center>
         <Input 
          placeholder="username"
          type="text"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          />
          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <Input 
          placeholder="password"
          type="text"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <Button onClick={signUp}> Sign Up </Button>
        </form>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>

        <form className="app__signup">
          <center>
          <img
            className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""/>
          </center>
         
          <Input 
          placeholder="email"
          type="text"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <Input 
          placeholder="password"
          type="text"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <Button onClick={signIn}> Sign In </Button>
        </form>

      </div>
      </Modal>

      <div className="app_header">
        <img
        className="app_headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
        {user ? ( 
          <Button onClick={() => auth.signOut()}> Logout</Button>
          ):(
          <div className="app__logincontainer">
          <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
          <Button onClick={() => setOpen(true)}> Sign Up </Button>
          </div>
        )
          }
      </div>

       {/* ctrl + spacebar */}
      <div className="app__posts">
      {
        posts.map(({post, id}) => 
          (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
          )
        )
      }
      <InstagramEmbed
        url='https://www.instagram.com/fatherdmw55/'
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      </div>
      

     

    {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
      <h3 className="app__upload"> Please login to upload your picture </h3>
        )
    }

    </div>
  );
}

export default App;
