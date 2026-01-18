from PIL import Image, ImageDraw, ImageFont
import os

# 建立圖標目錄
icons_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(icons_dir, exist_ok=True)

# 需要生成的尺寸
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    # 建立圖片
    img = Image.new('RGB', (size, size), color='#8B5CF6')
    draw = ImageDraw.Draw(img)

    # 繪製白色圓角矩形背景
    margin = size // 8
    draw.rounded_rectangle(
        [(margin, margin), (size - margin, size - margin)],
        radius=size // 6,
        fill='#7C3AED'
    )

    # 繪製文字 "L"
    try:
        # 嘗試使用系統字體
        font_size = int(size * 0.5)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # 如果沒有 arial，使用預設字體
        font = ImageFont.load_default()

    text = "L"
    # 取得文字大小
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # 置中文字
    x = (size - text_width) // 2
    y = (size - text_height) // 2

    draw.text((x, y), text, fill='#FFFFFF', font=font)

    # 儲存圖標
    filename = f'icon-{size}x{size}.png'
    filepath = os.path.join(icons_dir, filename)
    img.save(filepath, 'PNG')
    print(f'✓ 已生成: {filename}')

print('\n所有 PWA 圖標已生成完成！')
