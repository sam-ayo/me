"use client";

import { Nav } from "@/components/ui/nav";
import { useTheme } from "next-themes";

export default function Home() {
 const { theme, setTheme } = useTheme();

 return (
  <div>
   <Nav />
  </div>
 );
}
