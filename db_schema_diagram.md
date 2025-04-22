# MongoDB 數據庫關聯圖

```
+------------------+                    +------------------+
|      USER        |                    |      POST        |
+------------------+                    +------------------+
| _id              |<---+ +             | _id              |<---+
| name             |    | |             | timestamp        |    |
| title            |    | +------------ | author [Array]   |    |
| school (String)  |    |               | title            |    |
| email            |    |               | content          |    |
| authType         |    |               | setNotice        |    |
| pwd              |    |               | forCooker        |    |
| pwdChangeAt      |    |               | forStudent       |    |
| pwdResetToken    |    |               +------------------+    |
| pwdResetExpires  |    |                                       |
| active           |    |               +------------------+    |
| favorite [String]|    |               |     COMMENT      |    |
| dislike [String] |    |               +------------------+    |
+------------------+    +---------------| user             |    |
                                        | timestamp        |    |
                                        | comment          |    |
                                        | visibility       |    |
                                        | post             |----+
                                        +------------------+

+------------------+                    +------------------+
|     CATEGORY     |                    |     SCHOOL       |
+------------------+                    +------------------+
| _id              |<---+               | _id              |<---+
| name             |    |               | school           |    |
| color            |    |               | cooker [Array]   |    |
+------------------+    |               | inventoryLink    |    |
                        |               +------------------+    |
                        |                                       |
+------------------+    |               +------------------+    |
|      FOOD        |    |               |    CALENDAR      |    |
+------------------+    |               +------------------+    |
| _id              | <--------- +       | _id              |    |
| name             |    |       |       | schoolId         |----+
| category_id      |----+       |       | date             |
| likes            |            |       | foods [ObjectId] |----+
| dislikes         |            |       +------------------+    |
+------------------+            --------------------------------+
```

## 數據模型關係說明

### 用戶相關

- **User 模型**:
  - 包含用戶基本信息（姓名、職稱、學校等）
  - `school` 是字符串，不是對 School 的引用
  - `favorite` 和 `dislike` 是字符串數組，存儲 Food 的名稱

### 貼文系統

- **Post 模型**:

  - `author` 是數組，但實際存儲的是嵌入的用戶文檔
  - 通過 middleware 將 User 信息嵌入 Post
  - 有虛擬屬性 `comments` 引用相關評論

- **Comment 模型**:
  - `user` 引用 User 模型（ObjectId）
  - `post` 引用 Post 模型（ObjectId）

### 菜單系統

- **Category 模型**:

  - 食物類別，包含名稱和顏色
  - 有虛擬屬性 `foods` 引用相關食物

- **Food 模型**:

  - `category_id` 引用 Category 模型（ObjectId）
  - `likes` 和 `dislikes` 計數由 User 的喜好更新

- **Calendar 模型**:
  - `schoolId` 引用 School 模型（ObjectId）
  - `foods` 是 Food ObjectId 的數組

### 學校相關

- **School 模型**:
  - `school` 是學校名稱（字符串）
  - `cooker` 是數組，但類型未明確定義
