// ====================================
// منشئ الدروس التكيفي
// Adaptive Lesson Builder
// ====================================

class LessonBuilder {
    constructor() {
        this.currentLesson = null;
        this.exercisesShown = 0;
        this.startTime = null;
    }

    // ====================================
    // بناء درس كامل حسب مستوى الطالب
    // ====================================
    buildAdaptiveLesson(lesson, studentLevel) {
        this.currentLesson = lesson;
        this.startTime = Date.now();

        return {
            summary: this.buildSummary(lesson),
            video: this.buildVideoSection(lesson, studentLevel),
            exercises: this.buildProgressiveExercises(lesson, studentLevel),
            aiSupport: this.buildAISupport(lesson, studentLevel)
        };
    }

    // ====================================
    // 1️⃣ بناء قسم الملخص
    // ====================================
    buildSummary(lesson) {
        return {
            title: '📖 ملخص الدرس',
            content: lesson.summary,
            keyPoints: lesson.learning_objectives || [],
            duration: lesson.duration,
            interactiveElements: this.createSummaryInteractive(lesson)
        };
    }

    createSummaryInteractive(lesson) {
        return [
            {
                type: 'clickable_key_point',
                description: 'انقر على كل نقطة رئيسية لتوسيع التفاصيل'
            },
            {
                type: 'vocabulary',
                description: 'معجم الكلمات الصعبة بتعريفات'
            }
        ];
    }

    // ====================================
    // 2️⃣ بناء قسم الفيديو
    // ====================================
    buildVideoSection(lesson, studentLevel) {
        let videoQuality = 'HD';
        let autoPlay = false;

        if (studentLevel === 'advanced') {
            videoQuality = 'FullHD';
            autoPlay = true;
        } else if (studentLevel === 'beginner') {
            videoQuality = 'SD';
        }

        return {
            title: '🎬 فيديو تعليمي',
            url: lesson.video_url || '',
            duration: lesson.duration,
            quality: videoQuality,
            autoPlay: autoPlay,
            subtitles: true,
            interactiveTimestamps: [
                { time: '0:30', label: 'المقدمة' },
                { time: '5:00', label: 'المفهوم الأساسي' },
                { time: '10:00', label: 'الأمثلة' }
            ],
            quizPoints: this.generateVideoQuizzes(lesson),
            playbackSpeed: studentLevel === 'advanced' ? [1, 1.25, 1.5] : [1, 1.25]
        };
    }

    generateVideoQuizzes(lesson) {
        return [
            {
                time: 60,
                question: 'ما المفهوم الرئيسي الذي تم شرحه؟',
                type: 'quick_check'
            },
            {
                time: 300,
                question: 'هل فهمت الأمثلة المعطاة؟',
                type: 'confidence_check'
            }
        ];
    }

    // ====================================
    // 3️⃣ بناء التمارين المتدرجة
    // ====================================
    buildProgressiveExercises(lesson, studentLevel) {
        const exercises = lesson.exercises || [];
        const adapted = [];

        // ترتيب التمارين من الأسهل للأصعب
        const sortedExercises = this.sortExercisesByDifficulty(exercises);

        // اختيار عدد التمارين حسب المستوى
        const exerciseCount = this.getExerciseCount(studentLevel);

        for (let i = 0; i < Math.min(exerciseCount, sortedExercises.length); i++) {
            const exercise = sortedExercises[i];
            const difficulty = this.getDifficultyForIndex(i, studentLevel);

            adapted.push({
                ...exercise,
                adaptedDifficulty: difficulty,
                sequence: i + 1,
                hints: this.generateContextualHints(exercise, difficulty),
                timeLimit: this.calculateTimeLimit(difficulty),
                rewardPoints: this.calculateRewardPoints(i, difficulty)
            });
        }

        return {
            title: '✍️ التمارين المتدرجة',
            totalExercises: adapted.length,
            estimatedTime: adapted.reduce((sum, ex) => sum + ex.timeLimit, 0),
            exercises: adapted,
            progressBar: true,
            adaptiveFlow: true
        };
    }

    sortExercisesByDifficulty(exercises) {
        return [...exercises].sort((a, b) => {
            const order = { true_false: 1, fill_blank: 2, multiple_choice: 3, essay: 4 };
            return (order[a.type] || 0) - (order[b.type] || 0);
        });
    }

    getExerciseCount(studentLevel) {
        const counts = {
            beginner: 3,
            intermediate: 5,
            advanced: 7
        };
        return counts[studentLevel] || 5;
    }

    getDifficultyForIndex(index, studentLevel) {
        if (studentLevel === 'beginner') {
            return index === 0 ? 'easy' : index === 1 ? 'moderate' : 'standard';
        } else if (studentLevel === 'intermediate') {
            return ['easy', 'moderate', 'standard', 'challenging', 'challenging'][index] || 'expert';
        } else {
            return ['moderate', 'standard', 'challenging', 'challenging', 'expert', 'expert', 'expert'][index] || 'expert';
        }
    }

    generateContextualHints(exercise, difficulty) {
        const hintMap = {
            easy: [
                '💡 اقرأ السؤال بانتباه',
                '📖 راجع الملخص',
                '🎬 شاهد الفيديو مرة أخرى'
            ],
            moderate: [
                '💡 فكر في المفاهيم الأساسية',
                '📝 اكتب ملاحظاتك',
                '🤔 ما العلاقة بين الأفكار؟'
            ],
            standard: [
                '💭 فكر خارج الصندوق',
                '🔍 ابحث عن الأنماط',
                '⚡ ربط مع معارف سابقة'
            ],
            challenging: [
                '🧠 حلل المشكلة خطوة بخطوة',
                '🎯 ما الهدف الحقيقي؟',
                '🔬 جرب نهج مختلف'
            ]
        };

        return hintMap[difficulty] || hintMap.standard;
    }

    calculateTimeLimit(difficulty) {
        const timeLimits = {
            easy: 30,
            moderate: 45,
            standard: 60,
            challenging: 90,
            expert: 120
        };
        return timeLimits[difficulty] || 60;
    }

    calculateRewardPoints(index, difficulty) {
        const basePoints = {
            easy: 10,
            moderate: 15,
            standard: 20,
            challenging: 30,
            expert: 50
        };
        return basePoints[difficulty] || 20 * (index + 1);
    }

    // ====================================
    // 4️⃣ دعم المساعد الذكي
    // ====================================
    buildAISupport(lesson, studentLevel) {
        return {
            alwaysAvailable: true,
            aiTutor: {
                name: '🤖 معلمك الذكي',
                capabilities: [
                    'شرح المفاهيم بطرق مختلفة',
                    'تقديم أمثلة إضافية',
                    'تصحيح الأخطاء الفورية',
                    'نصائح شخصية'
                ],
                responseTime: '⚡ فوري',
                languages: ['عربي', 'فرنسي', 'إنجليزي']
            },
            contextAwareness: {
                understands: 'الدرس الحالي والمفاهيم السابقة',
                adapts: 'يتعديل بناءً على ردود الطالب',
                personalizes: 'يركز على نقاط ضعفك'
            }
        };
    }

    // ====================================
    // الحصول على إحصائيات الدرس
    // ====================================
    getLessonStatistics() {
        const timeSpent = (Date.now() - this.startTime) / 1000; // بالثواني

        return {
            exercisesCompleted: this.exercisesShown,
            timeSpent: Math.round(timeSpent),
            averageTimePerExercise: Math.round(timeSpent / (this.exercisesShown || 1)),
            engagementLevel: this.calculateEngagement(timeSpent)
        };
    }

    calculateEngagement(timeSpent) {
        if (timeSpent < 60) return 'منخفض - اتضح أنك متأخر عن الجدول!';
        if (timeSpent < 300) return 'متوسط - استمر في المحاولة';
        if (timeSpent < 600) return 'جيد - تركيز ممتاز';
        return 'ممتاز - أنت مركز جداً!';
    }
}

// إنشاء نسخة
const lessonBuilder = new LessonBuilder();

// تصدير
window.LessonBuilder = LessonBuilder;
window.lessonBuilder = lessonBuilder;
