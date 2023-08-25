import prismadb from "@/lib/prismadb";
import {CompanionForm} from "@/app/(root)/(routes)/companion/[companionId]/components/companionForm";
import {auth, redirectToSignIn} from "@clerk/nextjs";

interface CompanionProps{
   params:{
      companionId:string
   }
}


const CompanionIdPage = async ({params}:CompanionProps) =>{

   const {userId} = auth()

   if(!userId){
      return redirectToSignIn()
   }

   const companion = await prismadb.companion.findUnique({
      where:{
         userId,
         id:params.companionId
      }
   })

   const categories = await prismadb.category.findMany()


   return(
      <CompanionForm categories={categories} initialData={companion}/>
   )
}
export default CompanionIdPage