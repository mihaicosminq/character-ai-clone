   "use client";

   import * as z from "zod";
   import axios from "axios";
   import {useForm} from "react-hook-form";
   import {zodResolver} from "@hookform/resolvers/zod";
   import {useRouter} from "next/navigation";
   import {Wand2} from "lucide-react";
   import {Category, Companion} from "@prisma/client";

   import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
   import {Input} from "@/components/ui/input";
   import {Textarea} from "@/components/ui/textarea";
   import {Button} from "@/components/ui/button";
   import {Separator} from "@/components/ui/separator";
   import {Select, SelectContent, SelectItem, SelectValue, SelectTrigger} from "@/components/ui/select";
   import {ImageUpload} from "@/components/imageUpload";
   import {useToast} from "@/components/ui/use-toast";

   const PREAMBLE = `Ada was an Umbrella Corporation researcher named Linda during the early development stages of the canceled sequel (popularly known as Resident Evil 1.5). She makes her first on-screen appearance in Resident Evil 2 (1998), set two months after the events of the first game. In the game, she is an spy for an unnamed rival company who is sent to recover a sample of the deadly G-virus from Umbrella's lab in the zombie-infested Raccoon City. Her secret agenda is exposed, and she is seriously wounded by Annette Birkin in an attempt to save Leon.She reprises her role in the 2019 remake of Resident Evil 2.
   `;

   const SEED_CHAT = `*You hear the sound of footsteps behind you and turn around to see a woman wearing a red clothes, holding a pistol in her hand. She looks at you with a curious expression.*
   
   "Excuse me, Who are you? By the way, my name's "Ada Wong" or called me "Ada", and I'm here on a mission to collect some very important data and a few samples of a virus. I see that you're here as well. May I ask what brings you to this place and what your objectives are?"
   `;

   const formSchema = z.object({
      name: z.string().min(1, {
         message: "Name is required.",
      }),
      description: z.string().min(1, {
         message: "Description is required.",
      }),
      instructions: z.string().min(200, {
         message: "Instructions require at least 200 characters."
      }),
      seed: z.string().min(200, {
         message: "Seed requires at least 200 characters."
      }),
      src: z.string().min(1, {
         message: "Image is required."
      }),
      categoryId: z.string().min(1, {
         message: "Category is required",
      }),
   });

   interface CompanionFormProps {
      categories: Category[];
      initialData: Companion | null;
   }

   export const CompanionForm = ({
                                    categories,
                                    initialData
                                 }: CompanionFormProps) => {
      const router = useRouter();

      const { toast } = useToast()

      const form = useForm<z.infer<typeof formSchema>>({
         resolver: zodResolver(formSchema),
         defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
         },
      });

      const isLoading = form.formState.isSubmitting;

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
         try {
            if(initialData){
               await axios.patch(`/api/companion/${initialData.id}`,values)
            } else{
               await axios.post("/api/companion",values)
            }
            toast({
               variant:"destructive",
               description:"Success"
            })
            router.refresh();
            router.push("/")
         } catch (e) {
            toast({
               variant:"destructive",
               description:"Something went wrong"
            })
         }
      };

      return (
         <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                  <div className="space-y-2 w-full col-span-2">
                     <div>
                        <h3 className="text-lg font-medium">General Information</h3>
                        <p className="text-sm text-muted-foreground">
                           General information about your AI
                        </p>
                     </div>
                     <Separator className="bg-primary/10"/>
                  </div>
                  <FormField
                     name="src"
                     render={({field}) => (
                        <FormItem className="flex flex-col items-center justify-center space-y-4 col-span-2">
                           <FormControl>
                              <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value}/>
                           </FormControl>
                           <FormMessage/>
                        </FormItem>
                     )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        name="name"
                        control={form.control}
                        render={({field}) => (
                           <FormItem className="col-span-2 md:col-span-1">
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input disabled={isLoading} placeholder="Ada Wong" {...field} />
                              </FormControl>
                              <FormDescription>
                                 This is how your AI will be named.
                              </FormDescription>
                              <FormMessage/>
                           </FormItem>
                        )}
                     />
                     <FormField
                        name="description"
                        control={form.control}
                        render={({field}) => (
                           <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                 <Input disabled={isLoading} placeholder="Resident Evil Character" {...field} />
                              </FormControl>
                              <FormDescription>
                                 Short description for your AI
                              </FormDescription>
                              <FormMessage/>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="categoryId"
                        render={({field}) => (
                           <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}
                                      defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger className="bg-background">
                                       <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {categories.map((category) => (
                                       <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              <FormDescription>
                                 Select a category for your AI
                              </FormDescription>
                              <FormMessage/>
                           </FormItem>
                        )}
                     />
                  </div>
                  <div className="space-y-2 w-full">
                     <div>
                        <h3 className="text-lg font-medium">Configuration</h3>
                        <p className="text-sm text-muted-foreground">
                           Detailed instructions for AI Behaviour
                        </p>
                     </div>
                     <Separator className="bg-primary/10"/>
                  </div>
                  <FormField
                     name="instructions"
                     control={form.control}
                     render={({field}) => (
                        <FormItem>
                           <FormLabel>Instructions</FormLabel>
                           <FormControl>
                              <Textarea disabled={isLoading} rows={7} className="bg-background resize-none"
                                        placeholder={PREAMBLE} {...field} />
                           </FormControl>
                           <FormDescription>
                              Describe in detail your AI&apos;s backstory and relevant details.
                           </FormDescription>
                           <FormMessage/>
                        </FormItem>
                     )}
                  />
                  <FormField
                     name="seed"
                     control={form.control}
                     render={({field}) => (
                        <FormItem>
                           <FormLabel>Example Conversation</FormLabel>
                           <FormControl>
                              <Textarea disabled={isLoading} rows={7} className="bg-background resize-none"
                                        placeholder={SEED_CHAT} {...field} />
                           </FormControl>
                           <FormDescription>
                              Write couple of examples of a human chatting with your AI , write expected answers.
                           </FormDescription>
                           <FormMessage/>
                        </FormItem>
                     )}
                  />
                  <div className="w-full flex justify-center">
                     <Button size="lg" disabled={isLoading}>
                        {initialData ? "Edit your companion" : "Create your companion"}
                        <Wand2 className="w-4 h-4 ml-2"/>
                     </Button>
                  </div>
               </form>
            </Form>
         </div>
      );
   };