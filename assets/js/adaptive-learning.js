// ====================================
// نظام التعلم التكيفي المتقدم
// Adaptive Learning System
// ====================================

class AdaptiveLearningSystem {
    constructor() {
        this.studentProfile = {
            id: '',
            name: '',
            level: 'beginner', // beginner, intermediate, advanced
            subject: '',
            lesson: '',
            
            // مقاييس الأداء
            totalAttempts: 0,
            correctAnswers: 0,
            averageScore: 0,
            masteryPercentage: 0,
            
            // تحليل الأخطاء
            commonErrors: {},
            topicsMastered: [],
            topicsToImprove: [],
            
            // سرعة التعلم
            learningSpeed: 1,
            estimatedTimePerQuestion: 60, // بالثواني
            
            // التفاعل
            lastActive: new Date(),
            totalTimeSpent: 0,
            engagementScore: 0
        };
        
        this.difficultyLevels = {
            easy: { bloomLevel: 'remembering', multiplier: 0.6 },
            moderate: { bloomLevel: 'understanding', multiplier: 0.8 },
            standard: { bloomLevel: 'applying', multiplier: 1.0 },
            challenging: { bloomLevel: 'analyzing', multiplier: 1.2 },
            expert: { bloomLevel: 'evaluating/creating', multiplier: 1.5 }
        };
    }

    // ====================================
    // 1️⃣ تحميل ملف الطالب
    // ====================================
    loadStudentProfile(studentId) {
        const saved = localStorage.getItem(`student_${studentId}`);
        if (saved) {
            this.studentProfile = JSON.parse(saved);
            return this.studentProfile;
        }
        this.studentProfile.id = studentId;
        return this.studentProfile;
    }

    // ====================================
    // 2️⃣ حفظ ملف الطالب
    // ====================================
    saveStudentProfile() {
        localStorage.setItem(
            `student_${this.studentProfile.id}`,
            JSON.stringify(this.studentProfile)
        );
    }

    // ====================================
    // 3️⃣ تحليل مستوى الطالب بناءً على الأداء
    // ====================================
    assessStudentLevel() {
        const score = this.studentProfile.averageScore;
        
        if (score >= 85) {
            this.studentProfile.level = 'advanced';
            return 'متقدم';
        } else if (score >= 70) {
            this.studentProfile.level = 'intermediate';
            return 'متوسط';
        } else {
            this.studentProfile.level = 'beginner';
            return 'مبتدئ';
        }
    }

    // ====================================
    // 4️⃣ تحديد مستوى صعوبة السؤال التالي
    // Adaptive Difficulty Algorithm
    // ====================================
    getNextExerciseDifficulty() {
        const { correctAnswers, totalAttempts, averageScore } = this.studentProfile;
        
        if (totalAttempts < 3) {
            return 'easy'; // ابدأ بسهل
        }
        
        const successRate = correctAnswers / totalAttempts;
        
        if (successRate >= 0.85) {
            return 'expert'; // نجاح ممتاز → مستوى متقدم
        } else if (successRate >= 0.75) {
            return 'challenging'; // نجاح جيد → صعب
        } else if (successRate >= 0.60) {
            return 'standard'; // نجاح متوسط → معياري
        } else if (successRate >= 0.40) {
            return 'moderate'; // نجاح ضعيف → متوسط
        } else {
            return 'easy'; // فشل → سهل
        }
    }

    // ====================================
    // 5️⃣ توليد تمرين مخصص حسب المستوى
    // ====================================
    generateAdaptiveExercise(exerciseTemplate, difficulty) {
        const config = this.difficultyLevels[difficulty];
        
        return {
            ...exerciseTemplate,
            difficulty: difficulty,
            bloomLevel: config.bloomLevel,
            timeLimit: Math.round(this.studentProfile.estimatedTimePerQuestion * config.multiplier),
            hints: this.generateHints(exerciseTemplate, difficulty),
            complexity: config.multiplier
        };
    }

    // ====================================
    // 6️⃣ توليد تلميحات حسب مستوى الصعوبة
    // ====================================
    generateHints(exercise, difficulty) {
        const hintLevels = {
            easy: {
                count: 3,
                detail: 'عالي جداً'
            },
            moderate: {
                count: 2,
                detail: 'عالي'
            },
            standard: {
                count: 2,
                detail: 'متوسط'
            },
            challenging: {
                count: 1,
                detail: 'قليل'
            },
            expert: {
                count: 0,
                detail: 'بدون تلميحات'
            }
        };
        
        return {
            available: hintLevels[difficulty].count,
            used: 0,
            detailLevel: hintLevels[difficulty].detail,
            hints: [
                '💡 لاحظ الكلمات الرئيسية في السؤال',
                '📖 راجع المفاهيم المتعلقة بهذا الموضوع',
                '✏️ حاول حل مثال مشابه أولاً'
            ]
        };
    }

    // ====================================
    // 7️⃣ تسجيل إجابة التمرين
    // ====================================
    recordExerciseAttempt(exerciseId, isCorrect, timeSpent, difficulty) {
        const attempt = {
            exerciseId: exerciseId,
            timestamp: new Date(),
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            difficulty: difficulty
        };

        // تحديث الإحصائيات
        this.studentProfile.totalAttempts++;
        if (isCorrect) this.studentProfile.correctAnswers++;
        
        // حساب النسبة المئوية للنجاح
        this.studentProfile.averageScore = 
            (this.studentProfile.correctAnswers / this.studentProfile.totalAttempts) * 100;
        
        // حساب نسبة الإتقان
        this.studentProfile.masteryPercentage = this.calculateMastery();
        
        // تسجيل الخطأ إذا كان
        if (!isCorrect) {
            this.trackError(exerciseId);
        }
        
        // تحديث سرعة التعلم
        this.updateLearningSpeed(timeSpent);
        
        // حفظ الملف
        this.saveStudentProfile();
        
        return attempt;
    }

    // ====================================
    // 8️⃣ حساب نسبة الإتقان (Mastery %)
    // ====================================
    calculateMastery() {
        const { correctAnswers, totalAttempts } = this.studentProfile;
        
        if (totalAttempts === 0) return 0;
        
        let masteryScore = (correctAnswers / totalAttempts) * 100;
        
        // تقليل النسبة للمحاولات الأولى
        if (totalAttempts < 5) {
            masteryScore *= (totalAttempts / 5);
        }
        
        // الحد الأقصى 100%
        return Math.min(100, Math.round(masteryScore));
    }

    // ====================================
    // 9️⃣ تتبع الأخطاء الشائعة
    // ====================================
    trackError(exerciseId) {
        if (!this.studentProfile.commonErrors[exerciseId]) {
            this.studentProfile.commonErrors[exerciseId] = 0;
        }
        this.studentProfile.commonErrors[exerciseId]++;
    }

    // ====================================
    // 🔟 تحديث سرعة التعلم
    // ====================================
    updateLearningSpeed(timeSpent) {
        const avgTime = this.studentProfile.estimatedTimePerQuestion;
        
        if (timeSpent < avgTime * 0.5) {
            this.studentProfile.learningSpeed = 1.3; // سريع جداً
        } else if (timeSpent < avgTime) {
            this.studentProfile.learningSpeed = 1.1; // سريع
        } else if (timeSpent < avgTime * 1.5) {
            this.studentProfile.learningSpeed = 1.0; // عادي
        } else if (timeSpent < avgTime * 2) {
            this.studentProfile.learningSpeed = 0.8; // بطيء
        } else {
            this.studentProfile.learningSpeed = 0.6; // بطيء جداً
        }
    }

    // ====================================
    // 1️⃣1️⃣ تحديد المواضيع التي يتقنها والمواضيع الضعيفة
    // ====================================
    identifyStrengthsAndWeaknesses() {
        const errors = this.studentProfile.commonErrors;
        
        this.studentProfile.topicsToImprove = Object.entries(errors)
            .filter(([_, count]) => count > 2)
            .map(([topic, _]) => topic)
            .slice(0, 3);

        this.studentProfile.topicsMastered = this.getTopicsMastered();
        
        return {
            strengths: this.studentProfile.topicsMastered,
            weaknesses: this.studentProfile.topicsToImprove
        };
    }

    getTopicsMastered() {
        return ['المفاهيم الأساسية', 'الحسابات البسيطة'];
    }

    // ====================================
    // 1️⃣2️⃣ توصيات شخصية
    // ====================================
    getPersonalRecommendations() {
        const level = this.assessStudentLevel();
        const { topicsToImprove, learningSpeed } = this.studentProfile;
        
        const recommendations = {
            level: level,
            nextSteps: [],
            estimatedTime: 0,
            tips: []
        };

        // توصيات حسب المستوى
        if (level === 'متقدم') {
            recommendations.nextSteps = [
                'الانتقال لدروس متقدمة',
                'حل تمارين التحدي',
                'مساعدة الزملاء'
            ];
            recommendations.tips = [
                '🚀 أنت متقدم جداً! حاول حل مسائل أكثر تعقيداً',
                '💪 ركز على المواضيع التي تريد تحسينها'
            ];
        } else if (level === 'متوسط') {
            recommendations.nextSteps = [
                'مراجعة المواضيع الضعيفة',
                'حل تمارين إضافية',
                'مشاهدة فيديوهات توضيحية'
            ];
            recommendations.tips = [
                '✨ أداؤك جيد! استمر في المحاولة',
                '📚 راجع المفاهيم الأساسية مرة أخرى'
            ];
        } else {
            recommendations.nextSteps = [
                'البدء بتمارين سهلة',
                'فهم المفاهيم الأساسية',
                'اطلب المساعدة من المساعد الذكي'
            ];
            recommendations.tips = [
                '💡 ابدأ بالأساسيات ثم تقدم تدريجياً',
                '🤖 استخدم المساعد الذكي للتوضيح'
            ];
        }

        recommendations.estimatedTime = Math.round(30 / learningSpeed);

        return recommendations;
    }

    // ====================================
    // 1️⃣3️⃣ درجة الانخراط (Engagement Score)
    // ====================================
    updateEngagementScore() {
        const daysSinceActive = (new Date() - this.studentProfile.lastActive) / (1000 * 60 * 60 * 24);
        const timeSpent = this.studentProfile.totalTimeSpent;
        const attempts = this.studentProfile.totalAttempts;

        let score = 0;

        if (daysSinceActive < 1) score += 30;
        else if (daysSinceActive < 3) score += 20;
        else if (daysSinceActive < 7) score += 10;

        if (timeSpent > 300) score += 25;
        else if (timeSpent > 60) score += 15;

        if (attempts > 20) score += 25;
        else if (attempts > 5) score += 15;

        this.studentProfile.engagementScore = Math.min(100, score);
        return this.studentProfile.engagementScore;
    }

    // ====================================
    // 1️⃣4️⃣ تقرير تفصيلي عن الطالب
    // ====================================
    generateStudentReport() {
        const { 
            name, 
            level, 
            averageScore, 
            masteryPercentage, 
            totalAttempts,
            learningSpeed,
            topicsMastered,
            topicsToImprove
        } = this.studentProfile;

        return {
            studentName: name,
            currentLevel: level,
            performanceScore: Math.round(averageScore),
            masteryPercentage: masteryPercentage,
            totalAttempts: totalAttempts,
            engagementScore: this.updateEngagementScore(),
            learningSpeed: learningSpeed.toFixed(1) + 'x',
            strengths: topicsMastered,
            areasToImprove: topicsToImprove,
            recommendations: this.getPersonalRecommendations(),
            lastUpdated: new Date().toLocaleString('ar-TN')
        };
    }

    // ====================================
    // 1️⃣5️⃣ مقارنة مع متوسط الفئة
    // ====================================
    compareWithClassAverage(classStats) {
        const studentScore = this.studentProfile.averageScore;
        const classAverage = classStats.averageScore;
        const difference = studentScore - classAverage;

        return {
            studentScore: studentScore,
            classAverage: classAverage,
            difference: difference,
            percentile: classStats.getPercentile ? 
                classStats.getPercentile(studentScore) : 0,
            status: difference > 10 ? 'أعلى من المتوسط' : 
                    difference < -10 ? 'أقل من المتوسط' : 'حول المتوسط'
        };
    }
}

// ====================================
// إنشاء نسخة من النظام
// ====================================
const adaptiveSystem = new AdaptiveLearningSystem();

// تصدير
window.AdaptiveLearningSystem = AdaptiveLearningSystem;
window.adaptiveSystem = adaptiveSystem;
