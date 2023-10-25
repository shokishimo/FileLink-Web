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
  const [filenames, setFilenames] = useState<string[]>([]);
  const [objKeys, setObjKeys] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPostCompleted, setIsPostCompleted] = useState(false);
  const [postPresignedUrls, { data: postData, isLoading: isPostLoading, error: postError, isSuccess: isPostSuccess, isError: isPostError }] 
    = usePostPresignedUrlsMutation();

  const HandleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const newFiles: File[] = [];
    const newFilenames: string[] = [];
    const processFile = (file: File) => {
      newFiles.push(file);
      newFilenames.push(file.name);
    };

    if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach(item => {
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            if (entry.isFile) {
              const f = item.getAsFile()
              if (f) processFile(f);
            } else if (entry.isDirectory) {
              alert("Directory/folder is not supported. \nCreate a zip file instead");
            }
          }
        }
      });
    } else {
      // for older browsers
      [...e.dataTransfer.files].forEach(eachFile => {
        processFile(eachFile);
      });
    }

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setFilenames(prevFilenames => [...prevFilenames, ...newFilenames]);
  }, [setFiles, setFilenames]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      const newFilenames = Array.from(e.target.files).map(file => file.name);
      setFilenames(prevFilenames => [...prevFilenames, ...newFilenames]);
    }
  }, [setFiles, setFilenames]);

  const handleDelete = useCallback((index: number) => {
    setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
    });
    setFilenames(prevFilenames => {
      const newFilenames = [...prevFilenames];
      newFilenames.splice(index, 1);
      return newFilenames;
    });
  }, [setFiles, setFilenames]);

  const UploadFiles = useCallback(async (data: PostPresignedRes) => {
    const { urls, objectKeys } = data;
    setObjKeys(objectKeys);

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
      setIsPostCompleted(true);
    } catch (error) {
      console.error("Some uploads failed:", error);
      alert("Failed to upload files. Please try again.");
    }
  }, [files]);

  const HandleSubmit = useCallback(() => {
    if (files.length <= 0 || filenames.length <= 0 || files.length !== filenames.length) return;
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
          keys: objKeys, 
          filenames: filenames,
        },
      });
    }
  }, [filenames, isPostCompleted, objKeys, router]);

  useEffect(() => {
    if (isPostSuccess && postData) {
      UploadFiles(postData);
    }
  }, [isPostSuccess, postData, UploadFiles]);

  if (isPostError) {
    return <APIErrorAlert error={postError} />;
  }
  if (isPostSuccess && !postData) {
    return <Typography>data not found </Typography>;
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
              onDragOver={(e) => e.preventDefault()} 
              onDrop={HandleDrop}
              onClick={() => fileInputRef.current?.click()}
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