import json
import re

# Leer el archivo
with open('/home/ubuntu/Uploads/user_message_2026-03-07_17-04-08.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Definir emojis para cada categoría (usando coincidencias parciales)
def get_category_icon(category_name):
    """Obtiene el emoji apropiado para una categoría"""
    category_lower = category_name.lower()
    
    # Verificar casos más específicos primero
    if "suites" in category_lower or "herramientas varias" in category_lower:
        return "🛠️"
    elif "sitios externos" in category_lower:
        return "🌐"
    elif "microsoft" in category_lower or "office" in category_lower:
        return "🏢"
    elif "google" in category_lower or "workspace" in category_lower:
        return "📊"
    elif "notas" in category_lower or "documentación" in category_lower:
        return "📝"
    elif "diseño" in category_lower or "creatividad" in category_lower or "diagramas" in category_lower:
        return "🎨"
    elif "desarrollo" in category_lower or "código" in category_lower or "sandboxes" in category_lower:
        return "💻"
    elif "inspección" in category_lower or "performance" in category_lower or "seguridad" in category_lower or "forense" in category_lower:
        return "🔍"
    elif "automatización" in category_lower or "webhooks" in category_lower or "infraestructura" in category_lower:
        return "⚙️"
    elif "comunicación" in category_lower or "reuniones" in category_lower and "contenido" in category_lower:
        return "💬"
    elif "pagos" in category_lower or "facturas" in category_lower or "negocio" in category_lower:
        return "💳"
    elif "pdf" in category_lower:
        return "📄"
    elif "enlaces" in category_lower or "qr" in category_lower or "utilidades" in category_lower:
        return "🔗"
    elif "ia" in category_lower or "ml" in category_lower:
        return "🤖"
    else:
        return "📦"

def create_id(text):
    """Convierte texto a kebab-case"""
    # Eliminar paréntesis y contenido dentro
    text = re.sub(r'\([^)]*\)', '', text)
    # Convertir a minúsculas
    text = text.lower()
    # Reemplazar caracteres especiales y espacios con guiones
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    text = text.strip('-')
    return text

def parse_tool_line(line):
    """Parsea una línea de herramienta"""
    line = line.strip()
    if not line or line.startswith('1)') or line.startswith('2)') or line.startswith('3)') or \
       line.startswith('4)') or line.startswith('5)') or line.startswith('6)') or \
       line.startswith('7)') or line.startswith('8)') or line.startswith('9)') or \
       line.startswith('10)') or line.startswith('11)') or line.startswith('12)') or \
       line.startswith('13)') or line.startswith('14)'):
        return None
    
    # Parsear formato: "nombre.new — Descripción" o "sitio.com — Descripción"
    match = re.match(r'^([\w\.-]+)\s*—\s*(.+)$', line)
    if not match:
        return None
    
    shortcut_or_domain = match.group(1)
    description = match.group(2).strip()
    
    # Determinar si es .new o no
    is_new = shortcut_or_domain.endswith('.new')
    
    tool = {
        "id": create_id(shortcut_or_domain.replace('.new', '').replace('.', '-')),
        "name": shortcut_or_domain.replace('.new', '').replace('.', ' ').title(),
        "url": f"https://{shortcut_or_domain}",
        "description": description
    }
    
    if is_new:
        tool["shortcut"] = shortcut_or_domain
    
    return tool

# Parsear por secciones
lines = content.split('\n')
categories = []
current_category = None
current_tools = []

i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # Detectar inicio de categoría
    category_match = re.match(r'^\d+\)\s*(.+)$', line)
    
    if category_match:
        # Guardar categoría anterior si existe
        if current_category and current_tools:
            categories.append({
                "id": create_id(current_category),
                "name": current_category,
                "icon": get_category_icon(current_category),
                "tools": current_tools
            })
        
        # Iniciar nueva categoría
        current_category = category_match.group(1).strip()
        current_tools = []
    else:
        # Intentar parsear como herramienta
        tool = parse_tool_line(line)
        if tool:
            current_tools.append(tool)
    
    i += 1

# Agregar última categoría
if current_category and current_tools:
    categories.append({
        "id": create_id(current_category),
        "name": current_category,
        "icon": get_category_icon(current_category),
        "tools": current_tools
    })

# Crear estructura final
output = {
    "categories": categories
}

# Guardar JSON
with open('/home/ubuntu/moko_tooling_data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ JSON creado exitosamente!")
print(f"📊 Total de categorías: {len(categories)}")
print(f"🔧 Total de herramientas: {sum(len(cat['tools']) for cat in categories)}")
print("\n📋 Resumen por categoría:")
for cat in categories:
    print(f"  • {cat['icon']} {cat['name']}: {len(cat['tools'])} herramientas")
