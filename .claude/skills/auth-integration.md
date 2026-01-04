# 第三方登入整合規劃

## 概述
為了提升用戶體驗，系統將整合 Google 和 LINE 兩種第三方登入方式。這些登入方式特別適合手機端用戶，可以快速完成身份驗證。

## 登入方式

### 1. Google Login
**優勢**:
- 全球最廣泛使用的帳號系統
- 用戶信任度高
- 整合簡單

**技術實作**:
- 使用 Google OAuth 2.0
- Next.js 可使用 `next-auth` 套件
- 需要在 Google Cloud Console 建立 OAuth 2.0 憑證

**所需資訊**:
- Client ID
- Client Secret
- Redirect URI

### 2. LINE Login
**優勢**:
- 台灣市場普及率極高
- 適合台灣本地用戶
- 可整合 LINE 官方帳號推播

**技術實作**:
- 使用 LINE Login API
- 可透過 `next-auth` 或 LINE SDK 整合
- 需要在 LINE Developers Console 建立應用

**所需資訊**:
- Channel ID
- Channel Secret
- Callback URL

## 用戶流程

### 首次登入流程
1. 用戶點擊「Google 登入」或「LINE 登入」按鈕
2. 跳轉至第三方授權頁面
3. 用戶授權後返回網站
4. 系統建立會員資料
5. 導向至預約頁面或會員中心

### 已註冊用戶
1. 點擊登入按鈕
2. 第三方快速驗證（通常自動完成）
3. 直接進入系統

### 登入後可用功能
- 查看預約記錄
- 管理個人資料
- 取消/修改預約
- 累積會員點數
- 收藏喜愛的設計師

## 資料結構

### 用戶資料表 (Users)
```javascript
{
  id: string,              // 系統生成的唯一 ID
  email: string,           // Email
  name: string,            // 姓名
  phone: string,           // 電話號碼
  avatar: string,          // 頭像 URL
  authProvider: string,    // "google" | "line"
  providerId: string,      // 第三方提供的 User ID
  createdAt: timestamp,    // 建立時間
  lastLoginAt: timestamp,  // 最後登入時間
  memberLevel: string,     // 會員等級
  points: number           // 會員點數
}
```

### 預約記錄表 (Bookings)
```javascript
{
  id: string,
  userId: string,          // 關聯到 Users 表
  serviceId: string,
  stylistId: string,
  date: string,
  time: string,
  status: string,          // "pending" | "confirmed" | "completed" | "cancelled"
  customerInfo: {
    name: string,
    phone: string,
    email: string,
    notes: string
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 實作步驟

### Phase 1: 基礎登入功能
1. 安裝 `next-auth` 套件
2. 設定 Google OAuth 2.0
3. 設定 LINE Login
4. 建立登入頁面
5. 實作登入按鈕組件

### Phase 2: 會員系統
1. 建立用戶資料表
2. 實作會員中心頁面
3. 整合預約系統與會員資料
4. 實作登出功能

### Phase 3: 進階功能
1. 預約記錄查詢
2. 個人資料編輯
3. 會員點數系統
4. 推播通知整合

## UI/UX 設計

### 登入按鈕設計
- **Google 按鈕**: 白底 + Google 標準配色
- **LINE 按鈕**: LINE 綠色 (#06C755) + LINE Logo
- 按鈕大小: 至少 44x44px（適合觸控）
- 圓角: rounded-lg
- 陰影: shadow-md

### 登入頁面位置
1. **首頁 Header**: 右上角顯示「登入」按鈕
2. **預約流程**: 在步驟4（填寫資訊）前，提示「登入可快速填寫資料」
3. **會員中心**: 需要登入才能訪問

### 已登入狀態顯示
- Header 顯示用戶頭像 + 名稱
- 點擊可展開選單：
  - 我的預約
  - 個人資料
  - 會員點數
  - 登出

## 安全考量

### 資料保護
- 敏感資料加密存儲
- 使用 HTTPS
- Token 定期更新
- 實作 CSRF 防護

### 隱私權
- 明確告知收集的資料
- 提供隱私權政策
- 允許用戶刪除帳號
- 符合 GDPR 規範

## 測試計劃

### 功能測試
- [ ] Google 登入流程
- [ ] LINE 登入流程
- [ ] 首次登入建立用戶
- [ ] 已註冊用戶登入
- [ ] 登出功能
- [ ] Token 過期處理

### 裝置測試
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 桌面瀏覽器
- [ ] 平板裝置

## 相關連結

### 文件
- [Google OAuth 2.0 文件](https://developers.google.com/identity/protocols/oauth2)
- [LINE Login 文件](https://developers.line.biz/en/docs/line-login/)
- [NextAuth.js 文件](https://next-auth.js.org/)

### 申請平台
- [Google Cloud Console](https://console.cloud.google.com/)
- [LINE Developers Console](https://developers.line.biz/console/)

## 預估時程

- **基礎登入功能**: 1-2 週
- **會員系統整合**: 1 週
- **測試與優化**: 1 週

**總計**: 約 3-4 週完成完整登入系統
