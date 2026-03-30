# Shopping Agent FE

Frontend cho hệ thống Shopping Research Agent, xây dựng bằng React + TypeScript + Vite.

## 1. Cấu trúc thư mục chuẩn

```text
shopping-agent-fe/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── a2ui/
│   ├── layouts/
│   ├── pages/
│   │   ├── ChatPage/
│   │   └── SettingsPage/
│   ├── services/
│   │   ├── api.ts
│   │   └── chatService.ts
│   ├── hooks/
│   │   ├── useChatSSE.ts
│   │   └── useScrollToBottom.ts
│   ├── store/
│   │   ├── chatContextInstance.ts
│   │   ├── ChatContext.tsx
│   │   └── useChatContext.ts
│   ├── types/
│   │   └── chat.types.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── global.scss
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 2. Định nghĩa vai trò từng phần

1. `assets/`

- Chứa tài nguyên tĩnh: ảnh, icon, font, file media.

2. `components/common/`

- Chứa các component UI dùng chung toàn dự án: Button, Input, Modal, Spinner, Badge...

3. `components/a2ui/`

- Chứa component chuyên render dữ liệu từ AI: ProductCard, chart kết quả, map, block trả lời thông minh.

4. `layouts/`

- Chứa khung bố cục trang: Header, Sidebar, Main content area.

5. `pages/`

- Chứa các trang chính của ứng dụng.
- `ChatPage/`: màn hình chat chính với trợ lý.
- `SettingsPage/`: màn hình cài đặt (mở rộng sau).

6. `services/`

- Tầng giao tiếp backend, tách biệt UI.
- `api.ts`: cấu hình API chung (base URL, headers, interceptor nếu cần).
- `chatService.ts`: xử lý gọi API chat/SSE.

7. `hooks/`

- Chứa custom hooks tái sử dụng logic.
- `useChatSSE.ts`: quản lý luồng chat SSE, loading, error, messages.
- `useScrollToBottom.ts`: tự động cuộn xuống cuối khi có tin nhắn mới.

8. `store/`

- Quản lý state dùng chung (Context/store).
- Phù hợp cho các trạng thái cần chia sẻ giữa nhiều trang.

9. `types/`

- Nơi định nghĩa interface/type TypeScript.
- `chat.types.ts`: định nghĩa kiểu cho Message, Product, payload request/response.

10. `utils/`

- Chứa hàm tiện ích xử lý dữ liệu.
- `formatters.ts`: format tiền tệ, ngày giờ.
- `validators.ts`: kiểm tra dữ liệu đầu vào.

11. `styles/`

- Quản lý SCSS toàn dự án.
- `_variables.scss`: màu sắc, font, spacing, breakpoints.
- `_mixins.scss`: mixin tái sử dụng.
- `global.scss`: reset và style toàn cục.

12. `App.tsx`

- Điểm lắp ghép layout + page (và routing khi mở rộng).

13. `main.tsx`

- Entry point của ứng dụng React, mount app vào DOM.

14. `vite-env.d.ts`

- Khai báo type cho môi trường Vite và biến `import.meta.env`.

## 3. Quy ước làm việc

1. UI chỉ xử lý hiển thị, không gọi API trực tiếp trong component nếu đã có service.
2. Logic dùng lại thì đưa vào hooks.
3. Kiểu dữ liệu dùng chung phải khai báo trong `types/`.
4. Biến môi trường khai báo trong `.env` (ví dụ: `VITE_API_BASE_URL=http://localhost:8000`).
5. Ưu tiên tách style vào `styles/` để đồng nhất giao diện và dễ bảo trì.

## 4. Chạy dự án

```bash
npm install
npm start
```
