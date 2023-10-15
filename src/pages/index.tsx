import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, Button, LinearProgress } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

const Home: React.FC<void> = () => {

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
          <Button size="large" variant="contained" sx={{ backgroundColor: "#406671", ":hover": { backgroundColor: "#264d5b" } }}>Start</Button>
        </Link>
      </Stack>
    </>
  );
};

export default Home;