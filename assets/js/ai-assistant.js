// ====================================
// المساعد الذكي - AI Assistant
// ====================================

class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.learningContext = {
            currentSubject: '',
            currentLesson: '',
            studentLevel: 'beginner'
        };
    }

    // ====================================
    // الرد على الأسئلة بناءً على السياق
    // ====================================
    async getResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        let response = '';

        // تصنيف السؤال
        if (message.includes('شرح') || message.includes('اشرح')) {
            response = this.explainConcept(message);
        } else if (message.includes('مثال') || message.includes('أمثلة')) {
            response = this.provideExamples(message);
        } else if (message.includes('صعب') || message.includes('لا أفهم')) {
            response = this.simplifyExplanation(message);
        } else if (message.includes('تلميح') || message.includes('ساعد')) {
            response = this.provideHint(message);
        } else if (message.includes('الإجابة')) {
            response = this.explainAnswer(message);
        } else if (message.includes('كيف') || message.includes('كيفية')) {
            response = this.provideProcedure(message);
        } else {
            response = this.generalHelp(message);
        }

        return response;
    }

    // شرح المفاهيم
    explainConcept(question) {
        return "🎓 سأساعدك في فهم هذا المفهوم:\n\n" +
               "تأكد من:\n" +
               "✓ فهم الأساسيات أولاً\n" +
               "✓ قراءة المثال المرفق\n" +
               "✓ محاولة حل تمرين مماثل\n\n" +
               "هل تريد رؤية أمثلة عملية؟";
    }

    // تقديم أمثلة
    provideExamples(question) {
        return "📌 إليك بعض الأمثلة العملية:\n\n" +
               "مثال 1: حل بسيط\n" +
               "مثال 2: حل متوسط\n" +
               "مثال 3: حل متقدم\n\n" +
               "أي من هذه الأمثلة تريد توضيح أكثر؟";
    }

    // تبسيط الشرح
    simplifyExplanation(question) {
        return "💡 دعني أبسط الموضوع:\n\n" +
               "الفكرة الرئيسية: ...\n\n" +
               "بخطوات بسيطة:\n" +
               "1. ...\n" +
               "2. ...\n" +
               "3. ...\n\n" +
               "هل أصبح أوضح الآن؟";
    }

    // تقديم تلميحات
    provideHint(question) {
        return "🔍 تلميح مفيد:\n\n" +
               "• تذكر قاعدة ...\n" +
               "• ابدأ بـ ...\n" +
               "• لا تنسَ ...\n\n" +
               "حاول الآن وأخبرني بالنتيجة!";
    }

    // شرح الإجابة
    explainAnswer(question) {
        return "✅ شرح الإجابة:\n\n" +
               "لماذا هذه الإجابة صحيحة:\n" +
               "• السبب الأول: ...\n" +
               "• السبب الثاني: ...\n\n" +
               "الأخطاء الشائعة:\n" +
               "✗ تجنب: ...";
    }

    // شرح الطريقة
    provideProcedure(question) {
        return "📋 خطوات الحل:\n\n" +
               "الخطوة 1: اقرأ السؤال بانتباه\n" +
               "الخطوة 2: حدد المطلوب\n" +
               "الخطوة 3: اختر الطريقة المناسبة\n" +
               "الخطوة 4: تطبق الحل\n" +
               "الخطوة 5: تحقق من الإجابة";
    }

    // مساعدة عامة
    generalHelp(question) {
        return "👋 مرحباً! أنا هنا لمساعدتك\n\n" +
               "يمكنك أن تطلب مني:\n" +
               "• شرح مفهوم معين\n" +
               "• أمثلة عملية\n" +
               "• تلميحات للحل\n" +
               "• شرح الإجابة\n" +
               "• تبسيط الشرح\n\n" +
               "كيف أستطيع مساعدتك؟";
    }

    // حفظ السياق التعليمي
    setContext(subject, lesson, level) {
        this.learningContext = {
            currentSubject: subject,
            currentLesson: lesson,
            studentLevel: level
        };
    }

    // الحصول على معلومات الطالب
    getContext() {
        return this.learningContext;
    }
}

// إنشاء نسخة من المساعد الذكي
const aiAssistant = new AIAssistant();

// ====================================
// واجهة المساعد الذكي في الصفحة
// ====================================

function initAIAssistant() {
    const chatWidget = document.getElementById('ai-chat-widget');
    if (!chatWidget) return;

    // الاستماع للرسائل
    const sendButton = document.getElementById('ai-send-btn');
    const messageInput = document.getElementById('ai-message-input');

    if (sendButton) {
        sendButton.addEventListener('click', sendAIMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendAIMessage();
            }
        });
    }
}

async function sendAIMessage() {
    const messageInput = document.getElementById('ai-message-input');
    const messagesContainer = document.getElementById('ai-messages');
    const userMessage = messageInput.value.trim();

    if (!userMessage) return;

    // إضافة رسالة المستخدم
    addMessage('user', userMessage);
    messageInput.value = '';

    // محاكاة تأخير الرد
    setTimeout(async () => {
        const response = await aiAssistant.getResponse(userMessage);
        addMessage('ai', response);
    }, 500);
}

function addMessage(sender, message) {
    const messagesContainer = document.getElementById('ai-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${sender}`;
    messageDiv.innerHTML = `
        <div class="ai-message-content">
            ${sender === 'ai' ? '🤖' : '👤'} ${message}
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// تصدير الدوال
window.AIAssistant = AIAssistant;
window.aiAssistant = aiAssistant;
window.initAIAssistant = initAIAssistant;
