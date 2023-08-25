import {Menu} from "lucide-react"
import { Sheet,SheetContent,SheetTrigger} from "@/components/ui/sheet";
import {Sidebar} from "@/components/Sidebar"

export  const MobileSidebar =()=>{
   return(
      <Sheet>
         <SheetTrigger className="md:hidden pr-4">
            <Menu/>
         </SheetTrigger>
         <SheetContent side="left" className="p-0 bg-gradient-to-b via-black from-purple-950 pt-10 w-32">
            <Sidebar/>
         </SheetContent>
      </Sheet>
   )
}