import {auth, currentUser, } from "@clerk/nextjs";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(req: Request,{params}:{params:{companionId:string}}) {
   try {
      const body = await req.json()
      const user = await currentUser()
      const {src, name, description, instructions, seed, categoryId} = body

      if(!params.companionId){
         return new NextResponse("CompanionID required",{status:400})
      }

      if (!user || !user.id || !user.firstName) {
         return new NextResponse("Unauthorized", {status: 401})
      }
      if (!src || !name || !description || !instructions || !seed || !categoryId) {
         return new NextResponse("Missing required fields", {status: 400})
      }
      const companion = await prismadb.companion.update({
         where:{
            id:params.companionId,
            userId:user.id
         },
         data: {
            categoryId,
            userId: user.id,
            userName: user.firstName,
            src,
            name,
            description,
            instructions,
            seed
         }
      })

      return NextResponse.json(companion)
   } catch (e) {
      console.log("companion patch", e)
      return new NextResponse("Internal Error", {status: 500})
   }
}

export async function DELETE(req:Request,{params}:{params:{companionId:string}}){
   try{
      const {userId} = auth()
      if (!userId){
         return new NextResponse("Unauthorized",{status:401})
      }
      const companion = await prismadb.companion.delete({
         where:{
            userId,
            id:params.companionId
         }
      })
      return NextResponse.json(companion)
   }catch (e){
      console.log(e)
      return new NextResponse("Internal error", {status:500})
   }
}