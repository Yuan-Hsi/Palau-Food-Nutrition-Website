# 網站進度查看指南

這個指南將幫助團隊成員快速查看網站開發進度和UI界面。

## 本地部署方法（使用 Docker）

### 前提條件

- 安裝 [Docker](https://docs.docker.com/get-docker/)
- 安裝 [Docker Compose](https://docs.docker.com/compose/install/)
- 從版本控制系統（如Git）獲取最新的專案代碼

### 快速啟動步驟

1. 打開終端，進入專案根目錄
2. 運行以下命令啟動所有服務：

```bash
docker-compose up
```

3. 等待所有容器啟動完成（這可能需要幾分鐘時間）
4. 在瀏覽器中訪問以下網址查看前端界面：
   - http://localhost:3000

### 常用指令

- 在後台啟動所有服務：`docker-compose up -d`
- 停止所有服務：`docker-compose down`
- 重建並啟動服務：`docker-compose up --build`
- 查看服務日誌：`docker-compose logs -f`

### 各部分訪問方式

- 前端 UI：http://localhost:3000
- 後端 API：http://localhost:3005
- MongoDB 資料庫：localhost:27017

## 故障排除

- 如果遇到端口衝突問題，請確保本地3000、3005和27017端口沒有被其他應用佔用
- 如果容器無法啟動，可以使用 `docker-compose logs 服務名稱` 查看錯誤信息

## 聯絡支援

如有任何問題，請聯繫 [您的聯繫方式]