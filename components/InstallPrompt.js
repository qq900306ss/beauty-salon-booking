import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 註冊 Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful:', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed:', err);
          }
        );
      });
    }

    // 監聽 PWA 安裝提示事件
    const handleBeforeInstallPrompt = (e) => {
      // 防止瀏覽器自動顯示安裝提示
      e.preventDefault();
      // 儲存事件，稍後手動觸發
      setDeferredPrompt(e);
      // 檢查是否已經安裝過
      const isInstalled = localStorage.getItem('pwa-installed');
      const isDismissed = localStorage.getItem('pwa-dismissed');
      if (!isInstalled && !isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 監聽安裝成功事件
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // 顯示安裝提示
    deferredPrompt.prompt();

    // 等待用戶選擇
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // 清除提示
    setDeferredPrompt(null);
    setShowPrompt(false);

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
    // 7 天後再次顯示
    setTimeout(() => {
      localStorage.removeItem('pwa-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-purple-600 text-white p-4 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-3xl">📱</div>
          <div className="flex-1">
            <p className="font-bold text-lg">安裝 Linda 髮廊 App</p>
            <p className="text-sm text-purple-100">快速預約，隨時查看預約記錄</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg text-white bg-white/20 hover:bg-white/30 transition font-medium text-sm"
          >
            稍後再說
          </button>
          <button
            onClick={handleInstallClick}
            className="px-6 py-2 rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition font-bold text-sm shadow-lg"
          >
            立即安裝
          </button>
        </div>
      </div>
    </div>
  );
}
