// ====================================
// نظام التحكم بلوحة التحكم الذكية
// Dashboard Controller System
// متوافق مع البنية الموجودة
// ====================================

class DashboardController {
    constructor() {
        this.subjects = [
            {id:'arabic',name:'اللغة العربية',levels:[3,4,5,6]},
            {id:'math',name:'الرياضيات',levels:[3,4,5,6]},
            {id:'french',name:'الفرنسية',levels:[3,4,5,6]},
            {id:'science',name:'الإيقاظ العلمي',levels:[3,4,5,6]},
            {id:'islamic',name:'التربية الإسلامية',levels:[3,4,5,6]},
            {id:'english',name:'الإنجليزية',levels:[5,6]},
            {id:'history',name:'التاريخ',levels:[5,6]},
            {id:'geography',name:'الجغرافيا',levels:[5,6]}
        ];

        this.lessons = this.loadFromStorage('lessons') || [];
        this.videos = this.loadFromStorage('videos') || [];
        this.exercises = this.loadFromStorage('exercises') || [];
        this.students = this.loadFromStorage('students') || [];
        this.subscriptions = this.loadFromStorage('subscriptions') || [];
        this.referrals = this.loadFromStorage('referrals') || [];
        this.referralSettings = this.loadFromStorage('referralSettings') || {
            referrerReward: 5,
            refereeReward: 2,
            minReferrals: 1,
            maxMonthlyRewards: 100
        };
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            console.error('خطأ في التحميل من localStorage:', e);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch(e) {
            console.error('خطأ في الحفظ في localStorage:', e);
        }
    }

    // ===== إدارة الدروس =====
    addLesson(title, subject, level, summary, aiEnabled) {
        if (!title || !subject) {
            return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' };
        }

        const lesson = {
            id: 'L' + Date.now(),
            title: title,
            subject: subject,
            level: level,
            summary: summary,
            ai: aiEnabled,
            createdAt: new Date().toLocaleString('ar-TN'),
            status: 'مفعل'
        };

        this.lessons.push(lesson);
        this.saveToStorage('lessons', this.lessons);
        return { success: true, message: 'تم إضافة الدرس بنجاح', data: lesson };
    }

    deleteLesson(lessonId) {
        this.lessons = this.lessons.filter(l => l.id !== lessonId);
        this.saveToStorage('lessons', this.lessons);
        return { success: true, message: 'تم حذف الدرس بنجاح' };
    }

    // ===== إدارة الفيديوهات =====
    addVideo(title, lessonId, url, duration) {
        if (!title || !lessonId || !url) {
            return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' };
        }

        const video = {
            id: 'V' + Date.now(),
            title: title,
            lessonId: lessonId,
            url: url,
            duration: duration || 10,
            createdAt: new Date().toLocaleString('ar-TN'),
            status: 'متاح'
        };

        this.videos.push(video);
        this.saveToStorage('videos', this.videos);
        return { success: true, message: 'تم إضافة الفيديو بنجاح', data: video };
    }

    deleteVideo(videoId) {
        this.videos = this.videos.filter(v => v.id !== videoId);
        this.saveToStorage('videos', this.videos);
        return { success: true, message: 'تم حذف الفيديو بنجاح' };
    }

    // ===== إدارة التمارين =====
    addExercise(question, lessonId, type, answer, aiEnabled) {
        if (!question || !lessonId || !answer) {
            return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' };
        }

        const exercise = {
            id: 'E' + Date.now(),
            question: question,
            lessonId: lessonId,
            type: type,
            answer: answer,
            ai: aiEnabled,
            createdAt: new Date().toLocaleString('ar-TN'),
            difficulty: 'معياري'
        };

        this.exercises.push(exercise);
        this.saveToStorage('exercises', this.exercises);
        return { success: true, message: 'تم إضافة التمرين بنجاح', data: exercise };
    }

    deleteExercise(exerciseId) {
        this.exercises = this.exercises.filter(e => e.id !== exerciseId);
        this.saveToStorage('exercises', this.exercises);
        return { success: true, message: 'تم حذف التمرين بنجاح' };
    }

    // ===== إدارة الطلاب =====
    addStudent(name, email, level) {
        if (!name || !email) {
            return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' };
        }

        const student = {
            id: 'S' + Date.now(),
            name: name,
            email: email,
            level: level,
            registeredAt: new Date().toLocaleString('ar-TN'),
            status: 'نشط',
            performance: 0,
            progress: 0
        };

        this.students.push(student);
        this.saveToStorage('students', this.students);
        return { success: true, message: 'تم إضافة الطالب بنجاح', data: student };
    }

    deleteStudent(studentId) {
        this.students = this.students.filter(s => s.id !== studentId);
        this.saveToStorage('students', this.students);
        return { success: true, message: 'تم حذف الطالب بنجاح' };
    }

    // ===== إدارة الاشتراكات =====
    addSubscription(name, price, duration, features) {
        if (!name || price === '' || !duration) {
            return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' };
        }

        const subscription = {
            id: 'SB' + Date.now(),
            name: name,
            price: parseFloat(price),
            duration: parseInt(duration),
            features: features.split('\n').filter(f => f.trim()),
            subscribers: 0,
            status: 'مفعل',
            createdAt: new Date().toLocaleString('ar-TN')
        };

        this.subscriptions.push(subscription);
        this.saveToStorage('subscriptions', this.subscriptions);
        return { success: true, message: 'تم إضافة الخطة بنجاح', data: subscription };
    }

    deleteSubscription(subscriptionId) {
        this.subscriptions = this.subscriptions.filter(s => s.id !== subscriptionId);
        this.saveToStorage('subscriptions', this.subscriptions);
        return { success: true, message: 'تم حذف الخطة بنجاح' };
    }

    // ===== الإحصائيات =====
    getStats() {
        return {
            totalSubjects: this.subjects.length,
            totalLessons: this.lessons.length,
            totalVideos: this.videos.length,
            totalExercises: this.exercises.length,
            totalStudents: this.students.length,
            activeStudents: this.students.filter(s => s.status === 'نشط').length,
            avgPerformance: this.calculateAveragePerformance(),
            totalRevenue: this.calculateTotalRevenue()
        };
    }

    calculateAveragePerformance() {
        if (this.students.length === 0) return 0;
        const sum = this.students.reduce((acc, s) => acc + (s.performance || 0), 0);
        return Math.round(sum / this.students.length);
    }

    calculateTotalRevenue() {
        return this.subscriptions.reduce((acc, s) => acc + (s.price * s.subscribers), 0);
    }

    generateAIInsights() {
        const insights = [];

        if (this.lessons.length < 10) {
            insights.push({
                type: 'تحذير',
                message: `أضف ${10 - this.lessons.length} دروس إضافية`,
                icon: '⚠️'
            });
        }

        if (this.exercises.length < 50) {
            insights.push({
                type: 'اقتراح',
                message: `أضف ${50 - this.exercises.length} تمرين إضافي`,
                icon: '💡'
            });
        }

        insights.push({
            type: 'معلومة',
            message: `لديك ${this.students.length} طالب مسجل`,
            icon: '📊'
        });

        return insights;
    }
}

// إنشاء كائن عام
window.dashboard = new DashboardController();

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardController;
}
