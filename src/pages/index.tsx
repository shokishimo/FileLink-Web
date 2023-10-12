import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, Button, LinearProgress } from "@mui/material";
import { APIErrorAlert } from "../components/APIErrorAlert";
import Head from "next/head";
import Link from "next/link";

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
        <Link href={`/share`}>
          <Button size="large" variant="contained">Start</Button>
        </Link>
      </Stack>
    </>
  );
};

export default Home;