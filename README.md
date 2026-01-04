# 琳達髮廊預約系統 (Linda Hair Salon Booking)

一個現代化的美容院線上預約系統，專為手機端優化設計。

## 功能特色

- 📱 手機端優化的響應式設計
- 💇‍♀️ 多種美容服務選擇（服務項目將從後台 API 取得）
- 👨‍💼 專業設計師團隊介紹
- 📅 即時預約系統
- ⏰ 彈性時間選擇
- ✅ 預約確認與詳情查看

## 技術棧

- **框架**: Next.js 14
- **樣式**: Tailwind CSS
- **部署**: AWS Amplify
- **語言**: JavaScript/React

## 本地開發

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

## 專案結構

```
beauty-salon-booking/
├── pages/              # Next.js 頁面
│   ├── index.js       # 首頁 - 服務展示
│   ├── booking.js     # 預約頁面 - 多步驟預約流程
│   └── confirmation.js # 預約確認頁面
├── components/         # React 元件
│   ├── ServiceCard.js # 服務卡片元件
│   └── StylistCard.js # 設計師卡片元件
├── data/              # 模擬資料
│   ├── services.js    # 服務項目資料
│   └── stylists.js    # 設計師資料
├── styles/            # 全域樣式
│   └── globals.css    # Tailwind CSS 配置
└── public/            # 靜態資源
```

## 預約流程

1. **選擇服務** - 從後台提供的服務項目中選擇
2. **選擇設計師** - 根據專長選擇適合的設計師
3. **選擇時間** - 選擇預約日期與時段
4. **填寫資訊** - 輸入聯絡資訊完成預約

## 資料來源

- **服務項目**: 將從後台 API 動態取得（目前使用假資料）
- **設計師資料**: 將從後台 API 動態取得（目前使用假資料）
- **預約時段**: 將從後台 API 取得可用時段（目前使用假資料）

## 部署到 AWS Amplify

1. 將專案推送到 GitHub
2. 登入 AWS Amplify Console
3. 選擇「New app」→「Host web app」
4. 連接 GitHub repository
5. 設定建置設定（自動偵測 Next.js）
6. 部署

## 未來規劃

- [ ] 串接真實 API
- [ ] 用戶登入系統
- [ ] 預約管理功能
- [ ] 推播通知
- [ ] 會員積分系統
- [ ] 線上付款整合

## 授權

MIT License
