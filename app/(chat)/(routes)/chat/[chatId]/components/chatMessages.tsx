"use client"

import {Companion} from "@prisma/client";
import {ChatMessage, ChatMessageProps} from "@/app/(chat)/(routes)/chat/[chatId]/components/chatMessage";
import {ElementRef, useEffect, useRef, useState} from "react";

interface ChatMessagesProps {
   messages: ChatMessageProps[],
   isLoading: boolean,
   ai: Companion
}


export const ChatMessages = ({messages = [], isLoading, ai}: ChatMessagesProps) => {

   const scrollRef = useRef<ElementRef<"div">>(null)

   const [fakeLoading, setFakeLoading] = useState(messages.length === 0)

   useEffect(() => {
      const timeout = setTimeout(() => {
         setFakeLoading(false)
      }, 1000)

      return () => {
         clearTimeout(timeout)
      }
   }, [])

   useEffect(() => {
      scrollRef?.current?.scrollIntoView({behavior: "smooth"})
   }, [messages.length]);

   return (
      <div className="flex-1 overflow-y-auto pr-4">
         <ChatMessage isLoading={fakeLoading} src={ai.src} role="system"
                      content={`Hello,i am ${ai.name},${ai.description}`}/>
         {messages.map((message) => (
            <ChatMessage
               role={message.role}
               key={message.content}
               content={message.content}
               src={ai.src}
            />
         ))}
         {isLoading && (
            <ChatMessage role="system" src={ai.src} isLoading/>
         )}
         <div ref={scrollRef}/>
      </div>
   )
}