import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Há um package-lock.json placeholder na pasta-pai; fixamos o root do
  // Turbopack neste projeto para evitar a inferência ambígua de workspace.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
