// ====================================
// نظام الإحالة - Referral System
// ====================================

const SUBSCRIPTION_PRICE = 10; // دينار تونسي
const COMMISSION_RATE = 0.20; // 20%
const COMMISSION_AMOUNT = SUBSCRIPTION_PRICE * COMMISSION_RATE; // 2 د.ت

// ====================================
// 1. توليد كود إحالة فريد
// ====================================
function generateReferralCode(username) {
    // إنشاء كود فريد: REF + أول 3 أحرف من الاسم + رقم عشوائي
    const namePrefix = username.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `REF-${namePrefix}${randomNum}`;
}

// ====================================
// 2. حفظ كود الإحالة من الرابط
// ====================================
function captureReferralFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
        // حفظ الكود في localStorage لمدة 30 يوم
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        localStorage.setItem('referral_code', refCode);
        localStorage.setItem('referral_expiry', expiryDate.toISOString());
        
        console.log('✅ تم حفظ كود الإحالة:', refCode);
        return refCode;
    }
    
    return null;
}

// ====================================
// 3. التحقق من صلاحية كود الإحالة المحفوظ
// ====================================
function getStoredReferralCode() {
    const refCode = localStorage.getItem('referral_code');
    const expiry = localStorage.getItem('referral_expiry');
    
    if (!refCode || !expiry) {
        return null;
    }
    
    // التحقق من انتهاء الصلاحية
    const expiryDate = new Date(expiry);
    const now = new Date();
    
    if (now > expiryDate) {
        // انتهت صلاحية الكود
        localStorage.removeItem('referral_code');
        localStorage.removeItem('referral_expiry');
        return null;
    }
    
    return refCode;
}

// ====================================
// 4. إنشاء حساب مستخدم جديد مع الإحالة
// ====================================
function createUserWithReferral(username, email, password) {
    // توليد كود إحالة خاص بالمستخدم الجديد
    const userReferralCode = generateReferralCode(username);
    
    // الحصول على كود المحيل (إن وجد)
    const referredBy = getStoredReferralCode();
    
    // إنشاء بيانات المستخدم
    const userData = {
        id: Date.now().toString(),
        username: username,
        email: email,
        password: password, // ⚠️ في التطبيق الحقيقي، يجب تشفيره
        referralCode: userReferralCode,
        referredBy: referredBy || null,
        joinDate: new Date().toISOString(),
        subscriptionStatus: 'active',
        subscriptionPrice: SUBSCRIPTION_PRICE,
        referrals: [], // قائمة المحالين منه
        totalEarnings: 0 // إجمالي الأرباح
    };
    
    // حفظ بيانات المستخدم
    saveUserData(userData);
    
    // إذا كان هناك محيل، نضيفه إلى قائمة محاليه
    if (referredBy) {
        addReferralToUser(referredBy, userData);
    }
    
    // مسح كود الإحالة المحفوظ
    localStorage.removeItem('referral_code');
    localStorage.removeItem('referral_expiry');
    
    return userData;
}

// ====================================
// 5. حفظ بيانات المستخدم
// ====================================
function saveUserData(userData) {
    // الحصول على جميع المستخدمين
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // إضافة المستخدم الجديد
    users.push(userData);
    
    // حفظ القائمة المحدثة
    localStorage.setItem('users', JSON.stringify(users));
    
    // حفظ بيانات المستخدم الحالي
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    console.log('✅ تم حفظ بيانات المستخدم');
}

// ====================================
// 6. إضافة محال جديد للمحيل
// ====================================
function addReferralToUser(referralCode, newUserData) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // البحث عن المحيل
    const referrerIndex = users.findIndex(u => u.referralCode === referralCode);
    
    if (referrerIndex !== -1) {
        // إضافة المحال إلى قائمة المحيل
        const referralInfo = {
            id: newUserData.id,
            username: newUserData.username,
            email: newUserData.email,
            joinDate: newUserData.joinDate,
            monthlyCommission: COMMISSION_AMOUNT,
            status: 'active'
        };
        
        users[referrerIndex].referrals.push(referralInfo);
        
        // حفظ التحديث
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('✅ تم إضافة المحال إلى حساب المحيل');
        return true;
    }
    
    return false;
}

// ====================================
// 7. حساب إجمالي أرباح المستخدم
// ====================================
function calculateTotalEarnings(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return 0;
    
    // حساب العمولة من جميع المحالين النشطين
    const activeReferrals = user.referrals.filter(r => r.status === 'active');
    const totalEarnings = activeReferrals.length * COMMISSION_AMOUNT;
    
    return totalEarnings;
}

// ====================================
// 8. الحصول على معلومات الإحالة للمستخدم الحالي
// ====================================
function getCurrentUserReferralInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        console.error('❌ لا يوجد مستخدم مسجل دخول');
        return null;
    }
    
    const totalEarnings = calculateTotalEarnings(currentUser.id);
    
    // تحديث بيانات المستخدم
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].totalEarnings = totalEarnings;
        localStorage.setItem('users', JSON.stringify(users));
        
        // تحديث المستخدم الحالي
        currentUser.totalEarnings = totalEarnings;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return {
        referralCode: currentUser.referralCode,
        referralLink: `${window.location.origin}/register.html?ref=${currentUser.referralCode}`,
        totalReferrals: currentUser.referrals.length,
        activeReferrals: currentUser.referrals.filter(r => r.status === 'active').length,
        monthlyEarnings: totalEarnings,
        yearlyEarnings: totalEarnings * 12,
        referralsList: currentUser.referrals
    };
}

// ====================================
// 9. نسخ رابط الإحالة
// ====================================
function copyReferralLink() {
    const info = getCurrentUserReferralInfo();
    
    if (!info) return false;
    
    // نسخ الرابط
    navigator.clipboard.writeText(info.referralLink).then(() => {
        alert('✅ تم نسخ رابط الإحالة!');
        return true;
    }).catch(err => {
        console.error('❌ خطأ في النسخ:', err);
        return false;
    });
}

// ====================================
// 10. عرض معلومات الإحالة في الصفحة
// ====================================
function displayReferralInfo() {
    const info = getCurrentUserReferralInfo();
    
    if (!info) return;
    
    // تحديث عناصر HTML
    document.getElementById('referral-code')?.textContent = info.referralCode;
    document.getElementById('referral-link')?.textContent = info.referralLink;
    document.getElementById('total-referrals')?.textContent = info.totalReferrals;
    document.getElementById('active-referrals')?.textContent = info.activeReferrals;
    document.getElementById('monthly-earnings')?.textContent = `${info.monthlyEarnings} د.ت`;
    document.getElementById('yearly-earnings')?.textContent = `${info.yearlyEarnings} د.ت`;
    
    // عرض قائمة المحالين
    const referralsList = document.getElementById('referrals-list');
    if (referralsList && info.referralsList.length > 0) {
        referralsList.innerHTML = info.referralsList.map(ref => `
            <div class="referral-item">
                <span>👤 ${ref.username}</span>
                <span>${ref.monthlyCommission} د.ت/شهر</span>
                <span class="status-${ref.status}">${ref.status === 'active' ? 'نشط' : 'غير نشط'}</span>
            </div>
        `).join('');
    }
}

// ====================================
// 11. تهيئة النظام عند تحميل الصفحة
// ====================================
function initReferralSystem() {
    // التقاط كود الإحالة من الرابط (في صفحة التسجيل)
    if (window.location.pathname.includes('register.html')) {
        const refCode = captureReferralFromURL();
        if (refCode) {
            // عرض رسالة للمستخدم
            const referralMsg = document.getElementById('referral-message');
            if (referralMsg) {
                referralMsg.style.display = 'block';
                referralMsg.textContent = `🎉 لديك كود إحالة: ${refCode}`;
            }
        }
    }
    
    // عرض معلومات الإحالة (في لوحة التحكم)
    if (window.location.pathname.includes('dashboard.html')) {
        displayReferralInfo();
    }
}

// تشغيل النظام عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', initReferralSystem);

// ====================================
// تصدير الدوال للاستخدام في صفحات أخرى
// ====================================
window.ReferralSystem = {
    createUserWithReferral,
    copyReferralLink,
    displayReferralInfo,
    getCurrentUserReferralInfo,
    SUBSCRIPTION_PRICE,
    COMMISSION_AMOUNT
};
