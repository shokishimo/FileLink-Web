import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, List, ListItem, Button, LinearProgress } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useCallback, useMemo } from "react";
import { useGetObjectWithKeyQuery } from "@/services/base";
import { APIErrorAlert } from "@/components/APIErrorAlert";

const DownloadObjectPage: NextPage = () => {
  const router = useRouter();
  const objectKey = router.query.url_key as string;
  console.log(router.query)
  const { data, isLoading, isError, error } = useGetObjectWithKeyQuery({ objectKey: objectKey });

  if (isLoading) {
    return <LinearProgress />;
  }
  if (isError || !data) {
    return <APIErrorAlert error={error} />;
  }

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
        {data}
      </Stack>
    </>
  );
};

export default DownloadObjectPage;