import Head from 'next/head'

import { Toolbar, AppBar, Typography, CircularProgress, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import axios from 'axios';

import List from '../components/List'

const useStyles = makeStyles({
  root: {
    padding: 10
  }
});

export default function Home() {

  const [notices, setNotices] = React.useState([])

  React.useEffect(() => {
    axios.get('https://swdbphc.ml/api/notices/feed?start=0&limit=10').then((response) => {
      // console.log(response.data.data)
      setNotices(response.data.data)
    })
  }, [])

  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>SWD Notices</title>
        <meta name="description" content="SWD Inductions App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            SWD
          </Typography>
        </Toolbar>
      </AppBar>
      </header>
      <br />
      <main className={classes.root}>
        <center>
          {notices ? <List notices={notices} /> : <CircularProgress/>}
        </center>
      </main>
      <Divider />
      <footer>
        <center>
          <Button href="#text-buttons" color="primary">
            <a href="https://github.com/sanchitkalra/swd-inductions-2-1" rel="noreferrer" target="_blank">GitHub</a>
          </Button>
        </center>
      </footer>
      <br />

    </div>
  )
}
