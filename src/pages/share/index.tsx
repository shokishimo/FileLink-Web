import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, Button } from "@mui/material";
import Head from "next/head";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>FileLink Share</title>
      </Head>
      <Stack
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ minHeight: "100vh" }}
        spacing={5}
      >
        <Typography variant="h3">Share Page</Typography>
      </Stack>
    </>
  );
};

export default Home;