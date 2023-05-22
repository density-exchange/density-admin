import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import fs from "fs";
import dns from "dns";
import EnvironmentPlugin from "vite-plugin-environment";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 3000,
    https:false
    // https: {
    //   key: fs.readFileSync("./localhost-key.pem"),
    //   cert: fs.readFileSync("./localhost.pem"),
    // }
  },
  plugins: [react(), mkcert(), EnvironmentPlugin(["VITE_BUILD_TYPE"])],
});



