// === الخطوة 1: استيراد الأدوات اللازمة ===
// React هي المكتبة التي نبني بها واجهة المستخدم
import React, { useState } from 'react';
// Axios هي أداة تساعدنا على إرسال طلبات إلى النهاية الخلفية (المطبخ)
import axios from 'axios';
// استيراد ملف CSS لتنسيق المظهر
import './App.css';

// === الخطوة 2: إنشاء المكون الرئيسي للتطبيق ===
function App() {
  // === الخطوة 3: إنشاء "متغيرات حالة" لتخزين المعلومات ===
  // `prompt` لتخزين النص الذي يكتبه المستخدم
  const [prompt, setPrompt] = useState('');
  // `videoUrl` لتخزين رابط الفيديو بعد توليده
  const [videoUrl, setVideoUrl] = useState('');
  // `isLoading` لمعرفة ما إذا كان الفيديو قيد التوليد (لعرض مؤشر التحميل)
  const [isLoading, setIsLoading] = useState(false);
  // `error` لعرض أي رسائل خطأ تحدث
  const [error, setError] = useState('');

  // === الخطوة 4: بناء الوظيفة التي تنفذ عند ضغط الزر ===
  const handleGenerateVideo = async () => {
    // التحقق من أن المستخدم كتب شيئًا
    if (!prompt.trim()) {
      setError('الرجاء كتابة وصف للفيديو أولاً.');
      return;
    }

    // بدء عملية التحميل
    setIsLoading(true);
    setError(''); // مسح أي أخطاء قديمة
    setVideoUrl(''); // مسح أي فيديو قديم

    try {
      // === هذه هي أهم خطوة: إرسال الطلب إلى "المطبخ" (النهاية الخلفية) ===
      // تأكد من أن الرابط هنا هو رابط Render الخاص بك
      const response = await axios.post('https://mindforge-api.onrender.com/generate-video/', {
        prompt: prompt
      });

      // عند نجاح الطلب، احفظ رابط الفيديو الجديد
      setVideoUrl(response.data.video_url);

    } catch (err) {
      // في حالة حدوث خطأ، اعرض رسالة مناسبة
      setError('فشل توليد الفيديو. تأكد من أن الخادم الخلفي يعمل.');
      console.error(err);
    } finally {
      // في النهاية، توقف عن عرض مؤشر التحميل
      setIsLoading(false);
    }
  };

  // === الخطوة 5: تصميم واجهة المستخدم (ما يراه المستخدم) ===
  return (
    <div className="App">
      <header className="App-header">
        <h1>MindForge AI</h1>
        <p>حول أفكارك إلى فيديوهات مذهلة بالذكاء الاصطناعي</p>
      </header>
      <main>
        <div className="input-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="اكتب وصفاً للفيديو الذي تريد إنشاءه... (مثال: أسد يركض ببطء في السافانا عند الغروب)"
            rows="6"
            cols="50"
          />
          <button onClick={handleGenerateVideo} disabled={isLoading}>
            {isLoading ? 'جاري التوليد... فضلاً انتظر' : 'ولّد الفيديو'}
          </button>
        </div>

        {/* عرض رسالة الخطأ إذا وجدت */}
        {error && <p className="error-message">{error}</p>}

        {/* عرض الفيديو إذا تم توليده بنجاح */}
        {videoUrl && (
          <div className="video-container">
            <h2>الفيديو المُنشأ:</h2>
            <video controls width="600">
              <source src={videoUrl} type="video/mp4" />
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
          </div>
        )}
      </main>
    </div>
  );
}

// === الخطوة 6: تصدير المكون لاستخدامه في التطبيق ===
export default App;
