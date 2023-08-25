"use client"

import {Menu, Sparkles} from "lucide-react";
import Link from "next/link";
import image from "../images/iamge.jpg"
import {Poppins} from "next/font/google"
import Image from "next/image";
import {cn} from "@/lib/utils";
import {UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/components/theme-toggle";
import React from "react";
import {MobileSidebar} from "@/components/mobile-sidebar"

const font = Poppins({
   weight: "600",
   subsets: ['latin']
})

export const Navbar = () => {
   return (
      <div
         className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-gradient-to-b via-black from-purple-950 h-16">
         <div className="flex items-center">
            <MobileSidebar/>
               <Link href="/" className="flex items-center pl-2">
               <Image src={image} alt={"loading"} height="50" className="rounded"/>
               <h1 className={cn(
                  "hidden md:block text-xl md:text-3xl font-bold text-primary",
                  font.className
               )}>AI Test</h1>
            </Link>
         </div>
         <div className="flex items-center gap-x-3">
            <Button variant="premium" size="sm">Upgrade <Sparkles
               className="h-4 w-4 fill-white text-white ml-2"/></Button>
            <ModeToggle/>
            <UserButton afterSignOutUrl="/"/>
         </div>
      </div>
   )
}