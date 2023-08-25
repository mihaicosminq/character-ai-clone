"use client"

import {Companion, Message} from "@prisma/client";
import {ChatHeader} from "@/app/(chat)/(routes)/chat/[chatId]/components/ChatHeader";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {useCompletion} from "ai/react";
import {ChatForm} from "@/app/(chat)/(routes)/chat/[chatId]/components/chatForm";
import {ChatMessages} from "@/app/(chat)/(routes)/chat/[chatId]/components/chatMessages";
import {ChatMessageProps} from "@/app/(chat)/(routes)/chat/[chatId]/components/chatMessage";

interface ChatClientProps{
   ai:Companion&{
      messages: Message[],
      _count:{
         messages:number,
      }
   },

}

export const ChatClient = ({ai}:ChatClientProps) =>{
   const router = useRouter()
   const [messages, setMessages] = useState<ChatMessageProps[]>(ai.messages)
   const {input,isLoading,handleInputChange,handleSubmit,setInput} =useCompletion({
      api:`/api/chat/${ai.id}`,
      onFinish(prompt,completion){
         const systemMessage:ChatMessageProps = {
            role:"system",
            content:completion
         };
         setMessages((current)=>[...current,systemMessage]);
         setInput("")

         router.refresh()
      }
   })

   const onSubmit = (e:FormEvent<HTMLFormElement>) =>{
      const userMessage:ChatMessageProps = {
         role:"user",
         content:input,
      }

      setMessages((current)=>[...current,userMessage])

      handleSubmit(e)
   }

   return(
      <div className="flex flex-col h-full p-4 space-y-2">
         <ChatHeader ai={ai}/>
         <ChatMessages
            ai={ai} isLoading={isLoading} messages={messages}
         />
         <ChatForm isLoading={isLoading}  input={input} handleInputChange={handleInputChange} onSubmit={onSubmit}/>
      </div>
   )
}