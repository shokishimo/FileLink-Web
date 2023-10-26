import * as React from "react";
import { Stack, Typography, LinearProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useGetPresignedUrlsMutation } from "@/services/base";
import { useRouter } from "next/router";
import { APIErrorAlert } from "@/components/APIErrorAlert";

const DownloadPage: React.FC<void> = () => {
  const router = useRouter();
  const keys = router.query.keys as string[];
  const filenames = router.query.filenames as string[];
  const [getPresignedUrls, { data: getData, isLoading: isGetLoading, error: getError, isSuccess: isGetSuccess, isError: isGetError }]
    = useGetPresignedUrlsMutation();
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    getPresignedUrls({ keys });
  }, [getPresignedUrls, keys]);
  
  if (isGetLoading) {
    return <LinearProgress />
  }
  if (isGetError) {
    return <APIErrorAlert error={getError} />;
  }
  if (isGetSuccess && !getData) {
    return <Typography>data not found </Typography>;
  }
  if (isGetSuccess && getData) {
    if (urls.length === 0) {
      const urlsSet = new Set(getData.urls);
      setUrls(Array.from(urlsSet));
    }
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
        <Typography sx={{ color: "#264d5b" }}>Here are the urls of your files uploaded</Typography>
        <Typography sx={{ color: "#264d5b" }}>The urls are available for 24 hours</Typography>
        <ul>
          {urls.map((url, index) => (
            <li key={filenames[index]}>
              <a href={url}>{filenames[index]}</a>
            </li>
          ))}
        </ul>
      </Stack>
    </>
  );
};

export default DownloadPage;