#!/bin/bash

echo "🔍 KIỂM TRA DỰ ÁN TRƯỚC KHI DEPLOY"
echo "=================================="
echo ""

# Check required files
echo "📁 Kiểm tra files cần thiết..."
files=("Procfile" "composer.json" "package.json" ".env.example" "vite.config.ts")
all_files_exist=true

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - THIẾU!"
        all_files_exist=false
    fi
done
echo ""

# Check Laravel files
echo "🏗️ Kiểm tra Laravel files..."
laravel_files=(
    "app/Models/Reservation.php"
    "app/Http/Controllers/ReservationController.php"
    "routes/web.php"
    "database/migrations/2024_10_07_000000_create_reservations_table.php"
)

for file in "${laravel_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - THIẾU!"
        all_files_exist=false
    fi
done
echo ""

# Check React pages
echo "🎨 Kiểm tra React pages..."
react_files=(
    "resources/js/pages/Reservations/Index.tsx"
    "resources/js/pages/Reservations/Form.tsx"
)

for file in "${react_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - THIẾU!"
        all_files_exist=false
    fi
done
echo ""

# Check if build works
echo "🔨 Test build assets..."
if npm run build > /dev/null 2>&1; then
    echo "  ✅ Build thành công"
else
    echo "  ❌ Build THẤT BẠI - Kiểm tra lỗi!"
fi
echo ""

# Check if manifest exists
if [ -f "public/build/manifest.json" ]; then
    echo "  ✅ Manifest.json đã tạo"
else
    echo "  ❌ Manifest.json không tồn tại"
fi
echo ""

# Check composer dependencies
echo "📦 Kiểm tra dependencies..."
if [ -d "vendor" ]; then
    echo "  ✅ Vendor folder exists"
else
    echo "  ⚠️  Vendor folder không tồn tại - Chạy: composer install"
fi

if [ -d "node_modules" ]; then
    echo "  ✅ Node_modules exists"
else
    echo "  ⚠️  Node_modules không tồn tại - Chạy: npm install"
fi
echo ""

# Check .env
echo "⚙️ Kiểm tra .env..."
if [ -f ".env" ]; then
    echo "  ✅ .env exists"

    # Check important variables
    if grep -q "APP_KEY=base64:" .env; then
        echo "  ✅ APP_KEY đã được generate"
    else
        echo "  ⚠️  APP_KEY chưa generate - Chạy: php artisan key:generate"
    fi

    if grep -q "DB_CONNECTION=" .env; then
        echo "  ✅ DB_CONNECTION configured"
    else
        echo "  ⚠️  DB_CONNECTION chưa cấu hình"
    fi
else
    echo "  ⚠️  .env không tồn tại - Copy từ .env.example"
fi
echo ""

# Summary
echo "=================================="
if [ "$all_files_exist" = true ]; then
    echo "✅ TẤT CẢ FILES CẦN THIẾT ĐÃ CÓ!"
    echo ""
    echo "🚀 DỰ ÁN SẴN SÀNG DEPLOY LÊN ZEABUR!"
    echo ""
    echo "Các bước tiếp theo:"
    echo "1. git add ."
    echo "2. git commit -m 'Ready for deployment'"
    echo "3. git push origin main"
    echo "4. Deploy trên Zeabur: https://zeabur.com"
else
    echo "❌ CÒN THIẾU MỘT SỐ FILES!"
    echo "Kiểm tra lại các files bị thiếu ở trên."
fi
echo "=================================="
