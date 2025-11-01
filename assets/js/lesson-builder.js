class LessonBuilder {
    constructor() {
        this.lessons = [];
        this.currentLesson = null;
    }

    createLesson(config) {
        const lesson = {
            id: `lesson_${Date.now()}`,
            title: config.title,
            chapter: config.chapter,
            duration: config.duration,
            summary: config.summary,
            video_url: config.video_url || '',
            learning_objectives: config.learning_objectives || [],
            exercises: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.lessons.push(lesson);
        this.saveLessons();
        return lesson;
    }

    addExercise(lessonId, exercise) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
            exercise.id = `ex_${Date.now()}`;
            lesson.exercises.push(exercise);
            lesson.updatedAt = new Date();
            this.saveLessons();
            return exercise;
        }
        return null;
    }

    removeExercise(lessonId, exerciseId) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson.exercises = lesson.exercises.filter(e => e.id !== exerciseId);
            lesson.updatedAt = new Date();
            this.saveLessons();
            return true;
        }
        return false;
    }

    updateLesson(lessonId, updates) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
            Object.assign(lesson, updates);
            lesson.updatedAt = new Date();
            this.saveLessons();
            return lesson;
        }
        return null;
    }

    deleteLesson(lessonId) {
        this.lessons = this.lessons.filter(l => l.id !== lessonId);
        this.saveLessons();
    }

    getLessonsBySubject(subjectId) {
        return this.lessons.filter(l => l.subjectId === subjectId);
    }

    saveLessons() {
        localStorage.setItem('lessons_builder', JSON.stringify(this.lessons));
    }

    loadLessons() {
        const saved = localStorage.getItem('lessons_builder');
        if (saved) {
            this.lessons = JSON.parse(saved);
        }
    }

    exportLessons(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.lessons, null, 2);
        }
        return this.lessons;
    }

    importLessons(data) {
        try {
            const lessons = typeof data === 'string' ? JSON.parse(data) : data;
            this.lessons = [...this.lessons, ...lessons];
            this.saveLessons();
            return true;
        } catch (error) {
            console.error('خطأ في استيراد الدروس:', error);
            return false;
        }
    }
}

const lessonBuilder = new LessonBuilder();
lessonBuilder.loadLessons();
