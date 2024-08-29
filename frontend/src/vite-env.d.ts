interface ImportMetaEnv {
    VITE_BASE_URL: any;
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
