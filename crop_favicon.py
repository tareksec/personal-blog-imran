import base64
import re
from PIL import Image
from io import BytesIO

# 1. Read the SVG file
with open('c:/Users/bird/Documents/imranvai/favicon.svg', 'r', encoding='utf-8') as f:
    svg_data = f.read()

# 2. Extract base64 png
match = re.search(r'data:image/png;base64,([^"]+)', svg_data)
if not match:
    print("Could not find base64 image in SVG")
    exit(1)

b64_data = match.group(1)
img_data = base64.b64decode(b64_data)

# 3. Open with Pillow
img = Image.open(BytesIO(img_data))
img = img.convert("RGBA")

# 4. Crop transparent borders
bbox = img.getbbox()
if bbox:
    cropped_img = img.crop(bbox)
else:
    cropped_img = img

# 5. Add a 5% margin (aiming for ~90% fill as requested)
width, height = cropped_img.size
margin = int(max(width, height) * 0.05)
new_size = (width + 2*margin, height + 2*margin)
# Create new transparent image
padded_img = Image.new("RGBA", new_size, (255, 255, 255, 0))
# Paste cropped image into center
padded_img.paste(cropped_img, (margin, margin))

# 6. Save new 96x96 PNG
png_96 = padded_img.resize((96, 96), Image.Resampling.LANCZOS)
png_96.save('c:/Users/bird/Documents/imranvai/favicon-96x96.png', format="PNG")

# 7. Create ICO with multiple sizes (16, 32, 48, 64, 128)
sizes = [(16,16), (32,32), (48,48), (64,64), (128,128)]
padded_img.save('c:/Users/bird/Documents/imranvai/favicon.ico', format='ICO', sizes=sizes)

# 8. Create new SVG with cropped base64
buffered = BytesIO()
padded_img.save(buffered, format="PNG")
new_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
svg_out = f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="{new_size[0]}" height="{new_size[1]}" viewBox="0 0 {new_size[0]} {new_size[1]}"><image width="{new_size[0]}" height="{new_size[1]}" xlink:href="data:image/png;base64,{new_b64}" /></svg>'
with open('c:/Users/bird/Documents/imranvai/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_out)

print("Successfully cropped and generated new favicon files!")
