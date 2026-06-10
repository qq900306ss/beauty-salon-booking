# Linda Salon — 質感美學沙龍預約網站

🔗 **線上展示:https://d1mfjxqwxt860l.cloudfront.net**

> 整套系統:本預約網站 + [管理後台](https://github.com/qq900306ss/linda-salon-admin)([線上展示](https://d3arpt1ou620zv.cloudfront.net/login/))+ [Go Serverless API](https://github.com/qq900306ss/linda-salon-api)(AWS Lambda + DynamoDB,全套月費約 $0–1 美元)

以 Next.js 14(App Router)打造的高質感美容沙龍預約網站，首頁採用 React Three Fiber 全螢幕 3D 動畫（珍珠光澤流動球體、粉彩光暈、滑鼠視差），搭配 Framer Motion 捲動動畫，支援靜態輸出部署至 S3 + CloudFront。

## 技術棧

- **Next.js 14**（App Router、`output: 'export'` 靜態輸出）+ TypeScript
- **Tailwind CSS** — 奶油色 / 腮紅粉底色 + 玫瑰金點綴的訂製色票
- **three + @react-three/fiber + @react-three/drei** — 3D 場景（皆以 `next/dynamic` 關閉 SSR 動態載入）
- **framer-motion** — 捲動進場、步驟轉場、磁吸按鈕等動畫
- **lucide-react** — 圖示
- 字體：Noto Serif TC（標題）+ Noto Sans TC（內文），由 `next/font/google` 載入

## 頁面

| 路徑 | 說明 |
| --- | --- |
| `/` | 3D 主視覺、服務項目、設計師團隊、關於我們 |
| `/booking/` | 五步驟線上預約（服務 → 設計師 → 日期時段 → 資料 → 確認），支援 `?serviceId=` 預選 |
| `/lookup/` | 以電話查詢預約紀錄（時間軸卡片 + 狀態標籤） |

## 開發環境

```bash
# 1. 安裝相依套件
npm install

# 2. 設定環境變數
cp .env.local.example .env.local
# 編輯 .env.local，設定後端 API 位址

# 3. 啟動開發伺服器
npm run dev
```

### 環境變數

| 變數 | 說明 | 預設值 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | 後端 API 位址（不含結尾斜線） | `http://localhost:4000` |

## 建置與部署

```bash
npm run build        # 靜態輸出至 out/
npm run typecheck    # TypeScript 檢查
```

建置完成後，`out/` 目錄即為完整靜態網站，可直接上傳至 S3 並透過 CloudFront 提供服務。

> 完整的 AWS（S3 + CloudFront）部署流程，請參考後端 API 儲存庫中的 **AWS-DEPLOYMENT-GUIDE.md**。

部署重點：

1. 將 `out/` 內容同步至 S3 bucket（例：`aws s3 sync out/ s3://<bucket> --delete`）
2. CloudFront 指向該 bucket，並設定預設根文件 `index.html`
3. 因啟用 `trailingSlash: true`，子頁面輸出為 `booking/index.html` 等目錄形式，CloudFront 建議搭配 CloudFront Function 將 `/path/` 重寫為 `/path/index.html`
4. 建置時請以 `NEXT_PUBLIC_API_URL` 指向正式 API 網域

## API 介接

所有 API 回應皆為 `{ success, data }` / `{ success: false, error: { code, message } }` 信封格式，由 `lib/api.ts` 集中解包：

- `GET /api/services` — 服務項目
- `GET /api/stylists` — 設計師
- `GET /api/timeslots?stylistId=&date=YYYY-MM-DD&serviceId=` — 可預約時段
- `POST /api/bookings` — 建立預約（免登入）
- `GET /api/bookings/lookup?phone=` — 以電話查詢預約
