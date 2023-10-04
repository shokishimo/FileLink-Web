import type { NextPage } from "next";
import * as React from "react";
import { Stack, Typography, List, ListItem, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderZipIcon from '@mui/icons-material/FolderZipTwoTone';
import Head from "next/head";
import {useDropzone} from "react-dropzone";
import { useState, useCallback, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";

const SharesUrlKey: NextPage = () => {

  const [filesMap, setFilesMap] = useState(new Map<string, File>());

  const addFiles = useCallback((newFiles: File[]) => {
    setFilesMap((preMap) => {
      const newMap = new Map(preMap);
      newFiles.forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'zip') {
          newMap.set(uuid(), file);
        }
      });
      return newMap;
    });
  }, []);

  const removeFile = useCallback((uuidKey: string) => {
    setFilesMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(uuidKey);
      return newMap;
    });
  }, []);

  useEffect(() => {
    console.log(filesMap);
    // show files on UI

  }, [filesMap]);

  const filesList = useMemo(() => Array.from(filesMap.keys()), [filesMap]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

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
        <Typography sx={{ fontSize: "16px", color: "red" }} >
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

        {/* Display the list of dropped files */}
        <div>
          <Typography sx={{ fontSize: "16px" }}>
              Uploaded Files:
          </Typography>
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
                    startIcon={<DeleteIcon />}
                    onClick={() => removeFile(key)}
                    size="small"
                    sx={{ marginLeft: "10px", textTransform: "none", fontSize: "14px", padding: "1px 7px" }}
                  >
                    remove
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Stack>
    </>
  );
};

export default SharesUrlKey;