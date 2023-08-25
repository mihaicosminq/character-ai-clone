"use client"


import {Companion, Message} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash} from "lucide-react";
import {useRouter} from "next/navigation";
import {BotAvatar} from "@/app/(chat)/(routes)/chat/[chatId]/components/botAvatar";
import {useUser} from "@clerk/nextjs";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useToast} from "@/components/ui/use-toast";
import axios from "axios";

interface ChatHeaderProps {
   ai: Companion & {
      messages: Message[];
      _count: {
         messages: number
      }
   }
}

export const ChatHeader = ({ai}: ChatHeaderProps) => {

   const router = useRouter()

   const {user} = useUser();

   const {toast} = useToast();

   const onDelete = async () => {
      try {
         await axios.delete(`/api/companion/${ai.id}`)
         toast({
            description: "Successfully deleted AI"
         })
         router.refresh()
         router.push("/")
      } catch (error) {
         toast({
            description: "Something went wrong",
            variant: "destructive"
         })
      }
   }

   return (
      <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
         <div className="flex gap-x-2 items-center">
            <Button size="icon" variant="ghost" onClick={() => router.back()}>
               <ChevronLeft className="h-8 w-8"/>
            </Button>
            <BotAvatar src={ai.src}/>
            <div className="flex flex-col gap-y-1">
               <div className="flex items-center gap-x-2 ">
                  <p className="font-bold">{ai.name}</p>
                  <div className="flex  items-center text-xs text-muted-foreground">
                     <MessagesSquare className="w-3 h-3 mr-1"/>
                     {ai._count.messages}
                  </div>
               </div>
               <p className="text-xs text-muted-foreground">
                  Created by {ai.userName}
               </p>
            </div>
         </div>
         {user?.id === ai.userId && (
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                     <MoreVertical/>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/companion/${ai.id}`)}>
                     <Edit className="w-4 h-3 mr-2"/>
                     Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete}>
                     <Trash className="w-4 h-3 mr-2"/>
                     Delete
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )}
      </div>
   )
}