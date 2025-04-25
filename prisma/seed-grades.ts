import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing grades
  await prisma.grade.deleteMany()

  // Create grades
  const grades = [
    { level: '1' },
    { level: '2' },
    { level: '3' },
  ]

  for (const grade of grades) {
    await prisma.grade.create({
      data: grade
    })
  }

  console.log('Grades seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 