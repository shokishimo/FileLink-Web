import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, Button } from "@mui/material";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>FileLink Home</title>
      </Head>
      <Stack
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ minHeight: "100vh" }}
        spacing={5}
      >
        <Typography variant="h3">FileLink</Typography>
        <Button size="large" variant="contained">Start</Button>
      </Stack>
    </>
  );
};

export default Home;