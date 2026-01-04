# 琳達髮廊系統架構規劃

## 系統架構概述

建議採用**前後台分離**的架構，將系統分為三個獨立專案：

```
琳達髮廊系統
├── linda-salon-frontend (用戶端) ⭐ 目前專案
├── linda-salon-admin (管理後台)
└── linda-salon-backend (API 後端)
```

## 1. 用戶端 Frontend (目前專案)

### 專案名稱
- Repository: `beauty-salon-booking` (已建立)
- 部署網址: `https://linda-salon.com`

### 主要功能
- ✅ 服務項目展示
- ✅ 線上預約系統
- ✅ 會員登入 (Google / LINE)
- 預約記錄查詢
- 個人資料管理
- 會員點數查看
- 設計師作品集

### 技術棧
- Next.js 14
- Tailwind CSS
- NextAuth.js (OAuth)
- AWS Amplify 部署

### 目標用戶
- 一般消費者
- 會員客戶

---

## 2. 管理後台 Admin (建議新建)

### 專案名稱
- Repository: `linda-salon-admin` (待建立)
- 部署網址: `https://admin.linda-salon.com`

### 主要功能
#### 服務管理
- 新增/編輯/刪除服務項目
- 設定服務價格、時長
- 上傳服務圖片
- 管理服務分類

#### 預約管理
- 查看所有預約記錄
- 確認/取消預約
- 修改預約時間
- 預約統計報表
- 匯出預約資料

#### 設計師管理
- 新增/編輯設計師資料
- 設定設計師排班
- 管理設計師專長
- 設計師業績統計

#### 會員管理
- 查看會員列表
- 會員資料管理
- 會員點數調整
- 會員等級設定

#### 營運數據
- 預約統計圖表
- 營收報表
- 熱門服務分析
- 設計師業績排行

#### 系統設定
- 營業時間設定
- 休假日設定
- 通知訊息範本
- 優惠券管理

### 建議技術棧
**選項 A: React Admin Framework**
- Next.js 14
- React Admin / Refine
- Ant Design / Material-UI
- Chart.js (圖表)

**選項 B: Vue Admin Template** (如果想嘗試不同框架)
- Nuxt 3
- Vue Admin Templates
- Element Plus

### 目標用戶
- 店長/管理員
- 設計師（查看自己的預約）

### 權限設計
```javascript
roles: {
  SUPER_ADMIN: '超級管理員',    // 所有權限
  ADMIN: '店長',               // 管理功能
  STYLIST: '設計師',           // 查看個人預約
  STAFF: '員工'                // 基本查看
}
```

---

## 3. API 後端 Backend

### 專案名稱
- Repository: `linda-salon-api`
- API 網址: `https://api.linda-salon.com`

### 主要功能
- RESTful API 或 GraphQL
- 資料庫管理
- 認證授權
- 檔案上傳處理
- 推播通知服務

### 建議技術棧
**選項 A: Node.js**
- Express.js / Fastify
- Prisma ORM
- PostgreSQL / MySQL
- AWS S3 (檔案儲存)
- JWT 認證

**選項 B: AWS Serverless**
- AWS Lambda
- API Gateway
- DynamoDB
- Cognito (認證)
- S3 (檔案)

### API 端點規劃
```
# 服務相關
GET    /api/services              # 獲取服務列表
GET    /api/services/:id          # 獲取服務詳情
POST   /api/services              # 新增服務 (Admin)
PUT    /api/services/:id          # 更新服務 (Admin)
DELETE /api/services/:id          # 刪除服務 (Admin)

# 設計師相關
GET    /api/stylists              # 獲取設計師列表
GET    /api/stylists/:id          # 獲取設計師詳情
GET    /api/stylists/:id/schedule # 獲取設計師排班
POST   /api/stylists              # 新增設計師 (Admin)

# 預約相關
POST   /api/bookings              # 建立預約
GET    /api/bookings              # 獲取預約列表
GET    /api/bookings/:id          # 獲取預約詳情
PUT    /api/bookings/:id          # 更新預約
DELETE /api/bookings/:id          # 取消預約

# 會員相關
GET    /api/users/me              # 獲取當前用戶資料
PUT    /api/users/me              # 更新用戶資料
GET    /api/users/me/bookings     # 獲取我的預約
GET    /api/users/me/points       # 獲取我的點數

# 時段相關
GET    /api/timeslots             # 獲取可用時段
POST   /api/timeslots/check       # 檢查時段可用性

# 認證相關
POST   /api/auth/google           # Google OAuth
POST   /api/auth/line             # LINE Login
POST   /api/auth/admin            # 管理員登入
```

---

## 資料庫設計

### 主要資料表

#### users (會員)
```sql
id, email, name, phone, avatar,
auth_provider, provider_id,
member_level, points,
created_at, updated_at
```

#### services (服務項目)
```sql
id, name, category, description,
duration, price, image_url,
is_active, sort_order,
created_at, updated_at
```

#### stylists (設計師)
```sql
id, name, description, avatar,
experience_years, rating,
is_active, created_at, updated_at
```

#### stylist_specialties (設計師專長)
```sql
stylist_id, category
```

#### bookings (預約)
```sql
id, user_id, service_id, stylist_id,
booking_date, booking_time,
status, customer_name, customer_phone,
customer_email, notes,
created_at, updated_at
```

#### working_hours (營業時間)
```sql
id, day_of_week, start_time, end_time, is_closed
```

#### holidays (休假日)
```sql
id, date, reason
```

---

## 部署架構

### AWS Amplify 部署方案

```
用戶端 Frontend
├── AWS Amplify Hosting
├── CloudFront CDN
├── Route 53 DNS: linda-salon.com
└── 自動從 GitHub 部署

管理後台 Admin
├── AWS Amplify Hosting
├── CloudFront CDN
├── Route 53 DNS: admin.linda-salon.com
├── 認證限制
└── 自動從 GitHub 部署

API 後端
├── AWS Lambda + API Gateway (Serverless)
或
├── AWS ECS / EC2 (容器化)
├── RDS PostgreSQL (資料庫)
├── S3 (檔案儲存)
└── Route 53 DNS: api.linda-salon.com
```

### 環境變數管理
```
Frontend (.env.local):
NEXT_PUBLIC_API_URL=https://api.linda-salon.com
NEXTAUTH_URL=https://linda-salon.com
GOOGLE_CLIENT_ID=xxx
LINE_CHANNEL_ID=xxx

Admin (.env.local):
NEXT_PUBLIC_API_URL=https://api.linda-salon.com
NEXTAUTH_URL=https://admin.linda-salon.com
ADMIN_SECRET_KEY=xxx

Backend (.env):
DATABASE_URL=postgresql://...
JWT_SECRET=xxx
AWS_S3_BUCKET=linda-salon-uploads
GOOGLE_CLIENT_SECRET=xxx
LINE_CHANNEL_SECRET=xxx
```

---

## 開發順序建議

### Phase 1: 完善用戶端 (2-3週)
- [x] 基礎 UI 完成
- [ ] 整合第三方登入
- [ ] 串接 API (先用 mock data)
- [ ] 會員中心頁面
- [ ] 預約記錄查詢

### Phase 2: 建立後端 API (3-4週)
- [ ] 設計資料庫架構
- [ ] 實作核心 API
- [ ] 認證授權系統
- [ ] 檔案上傳功能
- [ ] API 文件

### Phase 3: 開發管理後台 (3-4週)
- [ ] 選擇 Admin 框架
- [ ] 管理員登入系統
- [ ] 服務項目管理
- [ ] 預約管理功能
- [ ] 統計報表

### Phase 4: 整合與測試 (2週)
- [ ] 前後端整合
- [ ] 功能測試
- [ ] 效能優化
- [ ] 上線部署

---

## 安全考量

### 用戶端安全
- 使用 HTTPS
- XSS 防護
- CSRF Token
- 敏感資料不存 localStorage

### 管理後台安全
- 管理員專用認證
- IP 白名單（選用）
- 操作日誌記錄
- 權限分級管理

### API 安全
- JWT Token 認證
- Rate Limiting
- 輸入驗證
- SQL Injection 防護
- CORS 設定

---

## 成本估算 (AWS)

### 月費用預估
- Amplify Hosting (2個): ~$5-10/月
- RDS PostgreSQL: ~$25-50/月
- Lambda + API Gateway: ~$5-20/月 (視流量)
- S3 儲存: ~$5/月
- CloudFront CDN: ~$5-15/月

**總計**: 約 $45-100 USD/月 (視流量而定)

---

## 總結建議

✅ **強烈建議**: 分離前後台
- 專業、安全、易維護
- 長期發展更有利
- 可獨立擴展功能

❌ **不建議**: 單一前端包含管理功能
- 代碼混亂
- 安全風險
- bundle 過大
