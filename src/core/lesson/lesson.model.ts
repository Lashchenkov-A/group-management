export interface Lesson {
  id: number;
  year: number;
  week: number;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  groupId: number;
  groupName: string;
  officeId: number;
  corpusNumber: number;
  classroomNumber: number;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacher: {
    firstName: string;
    secondName: string;
    lastName: string;
    jobRole: string;
  };
}
[];
