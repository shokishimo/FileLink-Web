import Link from "next/link";
import * as React from "react";
import { Stack, Typography, Button, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderTwoToneIcon from "@mui/icons-material/FolderTwoTone";
import Head from "next/head";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { usePostPresignedUrlsMutation } from "@/services/base";
import { APIErrorAlert } from "@/components/APIErrorAlert";
import axios from "axios";
import { PostPresignedRes } from "@/features/postPresignedReq.type";
import { useRouter } from "next/router";

const FileUploadPage: React.FC<void> = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [objectKeysArr, setObjectKeysArr] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPostCompleted, setIsPostCompleted] = useState(false);
  const [postPresignedUrls, { data: postData, isLoading: isPostLoading, error: postError, isSuccess: isPostSuccess, isError: isPostError }] 
    = usePostPresignedUrlsMutation();
  const filenames = useMemo(() => files.map(file => file.name), [files]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      const newFiles: File[] = [];
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) {
            newFiles.push(file);
          }
        }
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  }, []);

  const handleDropZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  }, []);

  const handleDelete = useCallback((index: number) => {
    setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
    });
  }, []);


  const UploadFiles = useCallback(async (data: PostPresignedRes) => {
    const { urls, objectKeys } = data;
    const uploadPromises = urls.map((url, index) => {
      return axios.put(url, files[index], {
        headers: {
          "Content-Type": files[index]?.type,
        }
      })
      .catch(error => {
        console.error("Error: ", error);
      });
    });

    try {
      await Promise.all(uploadPromises);
      setObjectKeysArr((prevArr) => [...prevArr, ...objectKeys]);
      setIsPostCompleted(true);
    } catch (error) {
      console.error("Some uploads failed:", error);
      alert("Failed to upload files. Please try again.");
    }
  }, [files]);

  const HandleSubmit = useCallback(() => {
    if (files.length <= 0 || filenames.length <= 0 || files.length != filenames.length) return;
    postPresignedUrls({ numOfFiles: files.length })
  }, [files, filenames, postPresignedUrls]);

  const showLoading = useCallback(() => {
    if (isPostLoading) return true;
    if (isPostSuccess && postData) return true;
    if (isPostSuccess && !isPostCompleted) return true;
    return false;
  }, [isPostLoading, postData, isPostSuccess, isPostCompleted]);

  useEffect(() => {
    if (isPostCompleted) {
      setIsPostCompleted(false);
      router.push({
        pathname: "/download",
        query: { 
          keys: objectKeysArr, 
          filenames: filenames,
        },
      });
    }
  }, [filenames, isPostCompleted, objectKeysArr, router]);

  if (isPostError) {
    return <APIErrorAlert error={postError} />;
  }
  if (isPostSuccess && !postData) {
    return <Typography>data not found </Typography>;
  }
  if (isPostSuccess && postData) {
    UploadFiles(postData);
  }

  return (
    <>
      <Head>
        <title>FileLink Shares</title>
      </Head> 
      <Stack
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ minHeight: "100vh" }}
        spacing={5}
      >
        {!isPostCompleted && (
          <>
            <div 
              onDragOver={handleDragOver} 
              onDrop={handleDrop}
              onClick={handleDropZoneClick}
              style={{
                height: "200px",
                width: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: "10px",
                backgroundColor: "#93b0b3",
                boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2)",
              }}
            >
              <Typography sx={{ color: "#264d5b" }}>Drop files here or click to upload</Typography>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                onChange={handleFileChange} 
                style={{ display: "none" }} // Hide the actual input
              />
              {showLoading() && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <CircularProgress />
                </div>
              )}
            </div>

            <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>
              {files.map((file, index) => (
                <li key={index} style={{ display: "inline-block", marginRight: "20px", color: "#264d5b" }}>
                  <FolderTwoToneIcon sx={{ fontSize: "30px", verticalAlign: "middle" }} />
                  <Typography sx={{ color: "#264d5b", display: "inline-block", marginLeft: "10px" }}>{file.name}</Typography> 
                  <DeleteIcon sx={{ fontSize: "30px", verticalAlign: "middle", marginLeft: "10px", ":hover": { cursor: "pointer" } }} onClick={() => handleDelete(index)} />
                </li>
              ))}
            </ul>

            <div>
              <input type="button" 
                value="Upload" 
                onClick={HandleSubmit} 
                hidden={files.length <= 0}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: isHovered? "#264d5b" : "#93b0b3",
                  color:  isHovered? "#e4ecf4" :"#264d5b",
                  borderRadius: "7px",
                  fontSize: "16px",
                  marginLeft: "300px",
                }}
              />
            </div>
          </>
        )}
      </Stack>
    </>
  );
};

export default FileUploadPage;