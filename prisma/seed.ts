import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  // await prisma.admin.create({
  //   data: {
  //     id: "admin1",
  //     username: "admin1",
  //   },
  // });
  // await prisma.admin.create({
  //   data: {
  //     id: "admin2",
  //     username: "admin2",
  //   },
  // });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i.toString(),
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics & Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER (modified to remove initial class connection)
  // await prisma.teacher.create({
  //   data: {
  //     id: "teacher1",
  //     username: "teacher1",
  //     name: "TName1",
  //     surname: "TSurname1",
  //     email: "teacher1@example.com",
  //     phone: "123-456-7891",
  //     address: "Address1",
  //     bloodType: "A_PLUS",
  //     sex: Sex.MALE,
  //     subjects: { connect: [{ id: 1 }] },
  //     birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
  //   },
  // });

  // CLASS
  // await prisma.class.create({
  //   data: {
  //     name: "1A",
  //     gradeId: 1,
  //     capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
  //     supervisorId: "teacher1",
  //   }
  // });

  // Update teacher with class connection
  // await prisma.teacher.update({
  //   where: { id: "teacher1" },
  //   data: {
  //     classes: { connect: [{ id: 1 }] }
  //   }
  // });

  // PARENT
  // await prisma.parent.create({
  //   data: {
  //     id: "parentId1",
  //     username: "parentId1",
  //     name: "PName 1",
  //     surname: "PSurname 1",
  //     email: "parent1@example.com",
  //     phone: "123-456-7891",
  //     address: "Address1",
  //   },
  // });

  // // STUDENT
  // await prisma.student.create({
  //   data: {
  //     id: "student1", 
  //     username: "student1", 
  //     name: "SName1",
  //     surname: "SSurname 1",
  //     email: "student1@example.com",
  //     phone: "987-654-3211",
  //     address: "Address1",
  //     bloodType: "O_MINUS",
  //     sex: Sex.MALE,
  //     parentId: "parentId1", 
  //     gradeId: 1, 
  //     classId: 1, 
  //     birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
  //   },
  // });

  // // LESSON
  // for (let i = 1; i <= 15; i++) {
  //   await prisma.lesson.create({
  //     data: {
  //       name: `Lesson${i}`, 
  //       day: Day[
  //         Object.keys(Day)[
  //           Math.floor(Math.random() * Object.keys(Day).length)
  //         ] as keyof typeof Day
  //       ], 
  //       startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
  //       endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
  //       subjectId: (i % 10) + 1, 
  //       classId: 1, 
  //       teacherId: "teacher1", 
  //     },
  //   });
  // }

  // // EXAM
  // for (let i = 1; i <= 5; i++) {
  //   await prisma.exam.create({
  //     data: {
  //       title: `Exam ${i}`, 
  //       startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
  //       endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
  //       lessonId: (i % 15) + 1, 
  //     },
  //   });
  // }

  // // ASSIGNMENT
  // for (let i = 1; i <= 5; i++) {
  //   await prisma.assignment.create({
  //     data: {
  //       title: `Assignment ${i}`, 
  //       startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
  //       dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
  //       lessonId: (i % 15) + 1, 
  //     },
  //   });
  // }

  // // RESULT
  // await prisma.result.create({
  //   data: {
  //     score: 90, 
  //     studentId: "student1", 
  //     examId: 1,
  //   },
  // });

  // // ATTENDANCE
  // await prisma.attendance.create({
  //   data: {
  //     date: new Date(), 
  //     present: true, 
  //     studentId: "student1", 
  //     lessonId: 1, 
  //   },
  // });

  // // EVENT
  // await prisma.event.create({
  //   data: {
  //     title: "Event 1", 
  //     description: "Description for Event 1", 
  //     startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
  //     endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
  //     classId: 1, 
  //   },
  // });

  // // ANNOUNCEMENT
  // await prisma.announcement.create({
  //   data: {
  //     title: "Announcement 1", 
  //     description: "Description for Announcement 1", 
  //     date: new Date(), 
  //     classId: 1, 
  //   },
  // });

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });