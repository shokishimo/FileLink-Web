import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, Button, LinearProgress } from "@mui/material";
import { APIErrorAlert } from "../components/APIErrorAlert";
import Head from "next/head";
import { useGetUrlQuery } from "../services/base";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data, isLoading, isError, error } = useGetUrlQuery();
  const router = useRouter();

  const handleSubmit = React.useCallback(() => {
    if (data) {
      router.push(`shares/${data}`);
    }
  }, [data, router]);

  if (isLoading) {
    return <LinearProgress />;
  }
  if (isError) {
    return <APIErrorAlert error={error} />;
  }

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
        <Button size="large" variant="contained" onClick={handleSubmit}>Start</Button>
      </Stack>
    </>
  );
};

export default Home;