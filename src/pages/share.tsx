import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, LinearProgress } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useCallback, useMemo } from "react";
import { useGeneratePresignedUrlMutation } from "@/services/base";
import { APIErrorAlert } from "@/components/APIErrorAlert";
import axios from "axios";
import { PresignedStruct } from "@/features/url.type";

const SharesUrlKey: NextPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [generatePresignedUrl, { data, isLoading: isPosting, error, isSuccess, isError }] 
    = useGeneratePresignedUrlMutation();

  const HandleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, [file]);

  const UploadFile = useCallback((data: PresignedStruct) => {
    const { url, objectKey } = data;
    axios.put(url, file, {
      headers: {
        "Content-Type": file?.type,
      }})
      .then(() => {
        alert('Successfully uploaded to S3!  Key is here: ' + objectKey);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to upload file. Please try again.');
      });

    }, [file]);

  const HandleSubmit = useCallback(() => {
    if (!file) return;
    generatePresignedUrl()
  }, [generatePresignedUrl, file]);

  if (isPosting) {
    return <LinearProgress />;
  }
  if (isError) {
    return <APIErrorAlert error={error} />;
  }
  if (isSuccess) {
    if (data) {
      UploadFile(data)
      // return (
      //   <>
      //     <Typography>data is here: </Typography>
      //     <div>{data.url}</div>
      //     <div>{data.objectKey}</div>
      //   </>
      // )
    } else {
      return (
        <Typography>data not found </Typography>
      )
    }
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
        <div>
          <input type="file" onChange={HandleFileChange} />
          <input type="button" value="Upload" onClick={HandleSubmit} disabled={!file} />
        </div>
      </Stack>
    </>
  );
};

export default SharesUrlKey;