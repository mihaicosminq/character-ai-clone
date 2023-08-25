const {PrismaClient} = require("@prisma/client")

const db = new PrismaClient()

async function main() {
   try {
      await db.category.createMany({
         data: [
            {name: "Anime Characters"},
            {name: "Game Characters"},
            {name: "Movie Characters"},
            {name: "Artists"},
         ]
      })
   } catch (error) {
      console.error("error seeding categories", error)
   } finally {
      await db.$disconnect()
   }
}

main();
