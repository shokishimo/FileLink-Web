import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, List, ListItem, Button, LinearProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderZipIcon from "@mui/icons-material/FolderZipTwoTone";
import FolderUploadIcon from "@mui/icons-material/DriveFolderUploadTwoTone";
import Head from "next/head";
import { useRouter } from "next/router";
import {useDropzone} from "react-dropzone";
import { useState, useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useUploadZipFilesMutation } from "@/services/base";
import { APIErrorAlert } from "@/components/APIErrorAlert";

const SharesUrlKey: NextPage = () => {
  const router = useRouter();
  const urlKey = router.query.url_key as string;
  const [postZipFiles, { data, isLoading: isPosting, error, isSuccess, isError }] 
    = useUploadZipFilesMutation();
  const [filesMap, setFilesMap] = useState(new Map<string, File>());

  const addFiles = useCallback((newFiles: File[]) => {
    setFilesMap((preMap) => {
      const newMap = new Map(preMap);
      newFiles.forEach(file => {
        newMap.set(uuid(), file);
        // const ext = file.name.split(".").pop()?.toLowerCase();
        // if (ext === "zip") {
        //   newMap.set(uuid(), file);
        // }
      });
      return newMap;
    });
  }, [filesMap]);

  const removeFile = useCallback((uuidKey: string) => {
    setFilesMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(uuidKey);
      return newMap;
    });
  }, [filesMap]);

  const filesList = useMemo(() => Array.from(filesMap.keys()), [filesMap]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const uploadFiles = useCallback(() => {
    const formData = new FormData();
    filesMap.forEach((file, key, map) => {
      formData.append("zip-file", file, file.name);
    });
    
    // HTTP Post
    postZipFiles({
      urlKey: urlKey,
      formData: formData,
    });
  }, [filesMap]);

  if (isPosting) {
    return <LinearProgress />;
  }
  if (isError) {
    return <APIErrorAlert error={error}/>
  }
  if (isSuccess) {
    if (data) {
      return (
        <>
          <Typography>Uploaded successfully</Typography>
          <Typography>{data}</Typography>
        </>
      )
    }
    return (
      <>
        <Typography>No data is returned</Typography>
        <Typography>{data}</Typography>
      </>
    )
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
        <Typography sx={{ fontSize: "20px", color: "#ffae42" }} >
          Zip file is only supported for now
        </Typography>
        <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", textAlign: "center", backgroundColor: "#B2BEB5", borderRadius: "10px" }}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop zip files here ...</p> :
              <p>Drag & drop / select zip files here</p>
          }
        </div>

        <div>
          {filesList.length > 0 && (
            <Typography sx={{ fontSize: "16px" }}>
              Uploaded Files:
            </Typography>
          )}
          <List>
            {filesList.map((key) => {
              const file = filesMap.get(key);
              if (!file) return null;

              return (
                <ListItem key={key} sx={{ display: "flex", alignItems: "center" }}>
                  <FolderZipIcon color="primary" />
                  <Typography sx={{ marginLeft: "10px", fontSize: "18px" }}>{file.name}</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon sx={{ color: "#CD5C5C" }} />}
                    onClick={() => removeFile(key)}
                    size="small"
                    sx={{ marginLeft: "10px", textTransform: "none", fontSize: "14px", padding: "1px 7px", color: "#CD5C5C", borderColor: "#CD5C5C"}}
                  >
                    remove
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div style={{ marginLeft: "160px" }}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<FolderUploadIcon color="primary" />}
            onClick={() => uploadFiles()}
            disabled={filesList.length === 0}
          >
            Upload
          </Button>
        </div>
      </Stack>
    </>
  );
};

export default SharesUrlKey;