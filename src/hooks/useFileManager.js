"use client"

import { useState, useEffect, useCallback } from "react"
import fileService from "../services/fileService"

export const useFileManager = () => {
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFiles = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const downloadedFiles = await fileService.getDownloadedFiles()
      setFiles(downloadedFiles)
    } catch (err) {
      setError(err.message)
      console.error("Error loading files:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteFile = useCallback(async (filename) => {
    try {
      await fileService.deleteFile(filename)
      setFiles((prev) => prev.filter((file) => file.filename !== filename))
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const openFile = useCallback(async (filename) => {
    try {
      await fileService.openFile(filename)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const refreshFiles = useCallback(() => {
    loadFiles()
  }, [loadFiles])

  // Load files on mount
  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  return {
    files,
    isLoading,
    error,
    deleteFile,
    openFile,
    refreshFiles,
    loadFiles,
  }
}
