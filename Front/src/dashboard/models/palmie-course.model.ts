export interface PalmieCourses {
  /** コースリスト */
  courses: (PalmieDailyLesson | PalmiePrimeLesson)[]
}
export interface PalmieDailyLesson {
  dailyLessons: [
    {
      id: number,
      title: string,
      description: string,
      trainingTitle: string,
      chapters: PalmieDailyLessonChapter[],
    }
  ],
  chapter: PalmieChapter,
  course: PalmieCourseDetail,
  level: string,
  note: string,
  isReviewableUser: boolean,
  currentPoint: string,
}

export interface PalmieCourseDetail {
  id: number,
  supplementUrl: string,
  supplementPdfUrl: string,
  title: string
}

export interface PalmieChapter {
  id: number,
  title: string,
  videoId: string,
  slide: {
    url: string,
    totalPages: number
  },
  dayIndex: number
}

export interface PalmieDailyLessonChapter {
  id: number,
  masterDailyLessonId: number,
  title: string,
  videoId: string,
  duration: number,
  slideBaseUrl: string,
  slideNPages: number,
  order: number,
  createdAt: string,
  updatedAt: string,
  isCompleted: boolean,
  slide: {
    url: string,
    totalPages: number
  },
  dayIndex: number
}

export interface PalmiePrimeLesson {
  video: PalmiePrimeLessonVideo,
  slide: {
    url: string,
    totalPages: number
  },
  primeLessons: [
    {
      id: number,
      title: string,
      description: string,
      videoSteps: PalmiePrimeLessonVideoStepObject[],
      isCompleted: boolean
    }
  ],
  course: PalmiePrimeLessonCourseDetail,
  level: string,
  note: string,
  title: string,
  isReviewableUser: boolean
}
export interface PalmiePrimeLessonVideoStepObject {
  id: number,
  title: string,
  description: string,
  startTime: number
}

export interface PalmiePrimeLessonVideo {
  id: number,
  vimeoVideoId: string,
  currentTime: number
}

export interface PalmiePrimeLessonCourseDetail {
  id: number,
  title: string,
  isCompleted: boolean,
  supplementUrl: string
}