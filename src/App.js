import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // لتنسيق المظهر

function App() {
  // متغيرات الحالة (State) لإدارة بيانات التطبيق
  const [prompt, setPrompt] = useState(''); // لتخزين النص الذي يكتبه المستخدم
  const [videoUrl, setVideoUrl] = useState(''); // لتخزين رابط الفيديو المُنشأ
  const [isLoading, setIsLoading] = useState(false); // لعرض مؤشر التحميل
  const [error, setError] = useState(''); // لعرض رسائل الخطأ

  // وظيفة يتم استدعاؤها عند ضغط المستخدم على زر "توليد"
  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setError('الرجاء كتابة وصف للفيديو أولاً.');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideoUrl('');

    try {
      // إرسال طلب POST إلى النهاية الخلفية
      const response = await axios.post('http://127.0.0.1:8000/generate-video/', {
        prompt: prompt
      });

      // عند نجاح الطلب، احفظ رابط الفيديو
      setVideoUrl(response.data.video_url);

    } catch (err) {
      // في حالة حدوث خطأ، اعرض رسالة مناسبة
      setError('فشل توليد الفيديو. تأكد من أن الخادم الخلفي يعمل.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

        {error && <p className="error-message">{error}</p>}

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

export default App;
