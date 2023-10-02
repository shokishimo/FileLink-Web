import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography } from "@mui/material";
import Head from "next/head";

const SharesUrlKey: NextPage = () => {
  return (
    <>
      <Head>
        <title>FileLink Shares UrlKey</title>
      </Head>
      <Stack
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ minHeight: "100vh" }}
        spacing={5}
      >
        <Typography variant="h3">FileLink Shares UrlKey</Typography>
      </Stack>
    </>
  );
};

export default SharesUrlKey;