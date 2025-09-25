import { Filesystem, Directory } from "@capacitor/filesystem"
import { Browser } from "@capacitor/browser"

class FileService {
  constructor() {
    this.downloadDirectory = "downloads"
  }

  // Initialize the downloads directory
  async initializeDirectory() {
    try {
      await Filesystem.mkdir({
        path: this.downloadDirectory,
        directory: Directory.Documents,
        recursive: true,
      })
    } catch (error) {
      // Directory might already exist, which is fine
      console.log("Directory initialization:", error.message)
    }
  }

  // Download file from URL and save locally
  async downloadFile(url, filename, onProgress) {
    try {
      await this.initializeDirectory()

      // Start download with progress tracking
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentLength = response.headers.get("content-length")
      const total = Number.parseInt(contentLength, 10)
      let loaded = 0

      const reader = response.body.getReader()
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        loaded += value.length

        if (onProgress && total) {
          onProgress(Math.round((loaded / total) * 100))
        }
      }

      // Convert chunks to base64
      const blob = new Blob(chunks)
      const base64Data = await this.blobToBase64(blob)

      // Save file to local storage
      const filePath = `${this.downloadDirectory}/${filename}`
      await Filesystem.writeFile({
        path: filePath,
        data: base64Data,
        directory: Directory.Documents,
      })

      // Get file info
      const fileInfo = await this.getFileInfo(filename)

      return {
        id: Date.now().toString(),
        filename,
        path: filePath,
        size: blob.size,
        type: this.getFileType(filename),
        downloadedAt: new Date().toISOString(),
        ...fileInfo,
      }
    } catch (error) {
      console.error("Download error:", error)
      throw new Error(`Failed to download file: ${error.message}`)
    }
  }

  // Get file information
  async getFileInfo(filename) {
    try {
      const filePath = `${this.downloadDirectory}/${filename}`
      const stat = await Filesystem.stat({
        path: filePath,
        directory: Directory.Documents,
      })
      return {
        size: stat.size,
        modifiedTime: stat.mtime,
      }
    } catch (error) {
      return { size: 0, modifiedTime: null }
    }
  }

  // Get list of downloaded files
  async getDownloadedFiles() {
    try {
      await this.initializeDirectory()

      const result = await Filesystem.readdir({
        path: this.downloadDirectory,
        directory: Directory.Documents,
      })

      const files = await Promise.all(
        result.files.map(async (file) => {
          const fileInfo = await this.getFileInfo(file.name)
          return {
            id: file.name,
            filename: file.name,
            path: `${this.downloadDirectory}/${file.name}`,
            type: this.getFileType(file.name),
            ...fileInfo,
          }
        }),
      )

      return files.filter((file) => file.filename !== ".DS_Store")
    } catch (error) {
      console.error("Error getting files:", error)
      return []
    }
  }

  // Delete a file
  async deleteFile(filename) {
    try {
      const filePath = `${this.downloadDirectory}/${filename}`
      await Filesystem.deleteFile({
        path: filePath,
        directory: Directory.Documents,
      })
      return true
    } catch (error) {
      console.error("Delete error:", error)
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }

  // Open file with Capacitor Browser
  async openFile(filename) {
    try {
      const filePath = `${this.downloadDirectory}/${filename}`
      const file = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Documents,
      })

      // Create blob URL for viewing
      const blob = this.base64ToBlob(file.data, this.getMimeType(filename))
      const blobUrl = URL.createObjectURL(blob)

      await Browser.open({
        url: blobUrl,
        windowName: "_blank",
      })
    } catch (error) {
      console.error("Open file error:", error)
      throw new Error(`Failed to open file: ${error.message}`)
    }
  }

  // Get file content as base64 for preview
  async getFileContent(filename) {
    try {
      const filePath = `${this.downloadDirectory}/${filename}`
      const file = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Documents,
      })
      return file.data
    } catch (error) {
      console.error("Get file content error:", error)
      throw new Error(`Failed to get file content: ${error.message}`)
    }
  }

  // Utility methods
  getFileType(filename) {
    const extension = filename.split(".").pop().toLowerCase()
    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"]
    const documentTypes = ["pdf", "doc", "docx", "txt"]

    if (imageTypes.includes(extension)) return "image"
    if (documentTypes.includes(extension)) return "document"
    return "other"
  }

  getMimeType(filename) {
    const extension = filename.split(".").pop().toLowerCase()
    const mimeTypes = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    }
    return mimeTypes[extension] || "application/octet-stream"
  }

  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}

export default new FileService()
