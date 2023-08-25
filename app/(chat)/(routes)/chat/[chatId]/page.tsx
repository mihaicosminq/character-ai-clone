import {auth, redirectToSignIn} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import {redirect} from "next/navigation";
import {ChatClient} from "@/app/(chat)/(routes)/chat/[chatId]/components/client";

interface ChatPageProps {
   params: {
      chatId: string,
   }
}

const chatIdPage = async ({params}: ChatPageProps) => {

   const {userId} = auth()

   if (!userId) {
      return redirectToSignIn();
   }
   const companion = await prismadb.companion.findUnique(
      {
         where:
            {id: params.chatId},
         include: {
            messages: {
               orderBy: {
                  createdAt: "asc"
               }, where: {
                  userId
               }
            },
            _count: {
               select: {
                  messages: true
               }
            }
         }
      })

   if(!companion){
      return redirect("/")
   }

   return (
      <ChatClient ai={companion}/>
   )
}

export default chatIdPage
