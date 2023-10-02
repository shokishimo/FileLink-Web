import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography } from "@mui/material";
import Head from "next/head";

const SharesHome: NextPage = () => {
  return (
    <>
      <Head>
        <title>FileLink Shares Home</title>
      </Head>
      <Stack
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ minHeight: "100vh" }}
        spacing={5}
      >
        <Typography variant="h3">Shares Home</Typography>
      </Stack>
    </>
  );
};

export default SharesHome;