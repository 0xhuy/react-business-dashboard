# Dashly — Business Dashboard

[English](README.md) | Tiếng Việt

Dashly là ứng dụng quản lý sản phẩm, tồn kho, đơn nhập hàng và người dùng. Dự án sử dụng React, TypeScript và Supabase, hỗ trợ tiếng Việt và tiếng Anh.

## Tính năng

- Đăng ký, đăng nhập bằng email/mật khẩu hoặc Google và đăng xuất.
- Quên mật khẩu, tạo mật khẩu mới và thông báo liên kết không hợp lệ.
- Điều hướng theo vai trò Admin, Staff và Viewer.
- Dashboard hiển thị số liệu tổng quan, sản phẩm sắp hết hàng và đơn nhập gần đây.
- Xem, thêm, sửa và xóa sản phẩm.
- Chỉnh sửa sản phẩm dạng bảng tính, nhập/xuất Excel và cảnh báo dữ liệu chưa lưu.
- Quản lý đơn nhập hàng và xem chi tiết từng đơn.
- Xem người dùng, cập nhật tên, vai trò và trạng thái tài khoản.
- Cập nhật hồ sơ, mật khẩu và tùy chọn cá nhân.
- Thông báo realtime cho Admin và Staff, đánh dấu đã đọc hoặc xóa thông báo.
- Chuyển đổi EN/VI, dịch thông báo lỗi và tải trang khi cần bằng lazy loading.

## Công nghệ

| Công nghệ | Dùng để làm gì? |
| --- | --- |
| React + TypeScript | Xây dựng giao diện và kiểm tra kiểu dữ liệu |
| Vite | Chạy local và tạo bản build |
| React Router | Chuyển trang và kiểm tra quyền truy cập route |
| Redux Toolkit | Quản lý dữ liệu dùng chung và trạng thái gọi API |
| Supabase | Đăng nhập, database PostgreSQL và realtime |
| React Hook Form + Zod | Quản lý form và kiểm tra dữ liệu nhập |
| Tailwind CSS + SCSS Modules | Viết style |
| i18next | Hiển thị tiếng Việt và tiếng Anh |
| ReactGrid + SheetJS (`xlsx`) | Bảng tính sản phẩm và nhập/xuất Excel |
| Vitest + ESLint | Kiểm thử logic và kiểm tra code |
| GitHub Actions | Tự động chạy lint, test và build |

## Chạy dự án trên máy

### 1. Chuẩn bị

- Node.js 22.12 trở lên trong nhánh 22.
- pnpm 8.15.9, cùng phiên bản đang dùng trong CI.
- Project Supabase có database và cấu hình Auth phù hợp.

**Lưu ý:** repository hiện chưa có script SQL/migration để tạo database từ đầu. Chỉ tạo project Supabase trống và điền biến môi trường sẽ chưa đủ để chạy các chức năng quản lý dữ liệu.

### 2. Tải code và cài thư viện

```bash
git clone https://github.com/0xhuy/react-business-dashboard.git
cd react-business-dashboard
git checkout develop
pnpm install --frozen-lockfile
```

`--frozen-lockfile` cài theo phiên bản trong `pnpm-lock.yaml`, giúp môi trường local và CI nhất quán.

### 3. Tạo file cấu hình

Sao chép `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Điền thông tin project Supabase:

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

- `VITE_SUPABASE_URL`: địa chỉ project Supabase.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: khóa publishable dành cho frontend.

Biến có tiền tố `VITE_` được đưa vào code phía trình duyệt. Không đặt Google Client Secret hoặc Supabase service-role key ở đây. File `.env` đã được loại khỏi Git.

### 4. Khởi động

```bash
pnpm dev
```

Mở địa chỉ terminal hiển thị, thường là `http://localhost:5173`. Giữ terminal chạy trong lúc sử dụng ứng dụng. Sau khi sửa `.env`, khởi động lại server.

## Backend cần có gì?

Ứng dụng đang gọi các bảng sau:

| Bảng | Dữ liệu |
| --- | --- |
| `profiles` | Hồ sơ, vai trò và trạng thái tài khoản |
| `user_settings` | Tùy chọn cá nhân |
| `products` | Sản phẩm và tồn kho |
| `purchase_orders` | Đơn nhập hàng |
| `purchase_order_items` | Sản phẩm trong từng đơn |
| `notifications` | Thông báo của người dùng |

Database cần có đúng cấu trúc cột, quan hệ và policy RLS. RLS là quy tắc quyết định tài khoản được đọc hoặc sửa dữ liệu nào ở database; chặn route ở frontend không thay thế được quy tắc này.

Tài khoản cần có hồ sơ phù hợp trong `profiles`. Cấu hình khởi tạo hồ sơ khi đăng ký và tạo thông báo thuộc phần backend, chưa được đóng gói thành script trong repository. Realtime cần được cấu hình cho bảng `notifications` để ứng dụng nhận thay đổi.

### Google login và đặt lại mật khẩu

Google login cần cấu hình ở Google Cloud và Supabase. Google Client ID và Client Secret được lưu trong cấu hình provider Google của Supabase.

Phân biệt hai địa chỉ:

- Callback của Supabase: `https://<project-ref>.supabase.co/auth/v1/callback`. Google trả kết quả về địa chỉ này. Lấy giá trị Callback URL từ provider Google trong Supabase.
- Địa chỉ quay về app: code dùng `<window.location.origin>/login` cho Google login và `<window.location.origin>/create-new-password` cho đặt lại mật khẩu.

Cấu hình Redirect URLs của Supabase theo địa chỉ app đang chạy. Với local cổng 5173, các địa chỉ tương ứng là:

```text
http://localhost:5173/login
http://localhost:5173/create-new-password
```

Nếu dùng cổng 4173 hoặc domain deploy, cần cấu hình địa chỉ tương ứng. Ứng dụng duy trì session theo cấu hình mặc định của Supabase. Phần Remember me được comment lại và không hiển thị.

## Các lệnh thường dùng

| Lệnh | Ý nghĩa |
| --- | --- |
| `pnpm dev` | Chạy server phát triển, cập nhật khi sửa code |
| `pnpm lint` | Kiểm tra code theo quy tắc ESLint |
| `pnpm test` | Chạy test một lần rồi kết thúc |
| `pnpm test:watch` | Chạy lại test khi file liên quan thay đổi |
| `pnpm build` | Kiểm tra TypeScript và tạo bản build trong `dist/` |
| `pnpm preview` | Xem bản build trên máy, thường tại cổng 4173 |

Trước khi tạo PR, chạy:

```bash
pnpm lint
pnpm test
pnpm build
```

Test hiện tại nằm ở `src/utils/errors/errors.test.ts`, gồm 4 trường hợp cho `normalizeError`: bản ghi trùng, thiếu quyền, lỗi mạng và lỗi server. Đây là kiểm thử logic chuyển lỗi thành thông tin hiển thị, chưa phải kiểm thử tự động toàn bộ ứng dụng.

## Cấu trúc thư mục

```text
public/locales/     Nội dung dịch EN/VI
src/
  assets/          Hình ảnh và icon
  components/      Component dùng lại và provider
  features/        API, logic và kiểu dữ liệu theo chức năng
  layouts/         Bố cục trang đăng nhập và dashboard
  pages/           Các màn hình
  redux/           Store, slice và thunk
  router/          Route, lazy loading và kiểm tra quyền
  services/        Kết nối dịch vụ, gồm Supabase client
  utils/           Hàm tiện ích, constants, enum và i18n
```

## CI và bản build

Workflow ở `.github/workflows/ci.yml` tự chạy khi push, hoặc khi tạo/cập nhật PR vào `develop` và `main`. Các bước gồm cài thư viện, lint, test và build. Workflow hiện chưa tự deploy.

Để xem bản build tại local:

```bash
pnpm build
pnpm preview
```

Khi deploy, thư mục đầu ra là `dist/`. Cần cung cấp hai biến môi trường Supabase trước khi build và cấu hình hosting trả về `index.html` cho route phía ứng dụng để refresh tại `/login` hoặc `/admin` không gặp lỗi 404. `pnpm preview` dùng để kiểm tra bản build tại local.

## Kiểm tra thủ công trước khi bàn giao

- Đăng nhập bằng mật khẩu và Google, đăng xuất rồi đăng nhập lại.
- Thử Admin, Staff và Viewer, bao gồm truy cập trực tiếp URL.
- Thử đặt lại mật khẩu bằng liên kết mới và liên kết hết hạn.
- Kiểm tra sản phẩm, bảng tính Excel, đơn nhập hàng và cập nhật người dùng.
- Kiểm tra thông báo realtime, EN/VI và giao diện trên màn hình nhỏ.

Dùng dữ liệu thử nghiệm khi kiểm tra thao tác thêm, sửa và xóa.
