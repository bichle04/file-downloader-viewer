const config = {
  appId: "com.filedownloader.app",
  appName: "File Downloader & Viewer",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Filesystem: {
      iosDatabaseLocation: "Documents",
    },
    Browser: {
      presentationStyle: "popover",
    },
  },
}

export default config
