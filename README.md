<div align="center">
  
# 🔮 MOKO-TOOLS 

**El buscador definitivo de herramientas IA, diseño y productividad.**  
Una colección curada y optimizada con una interfaz premium "Liquid Glass" basada en la navegación espacial.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)
![Open Source](https://img.shields.io/badge/Open_Source-❤️-red?style=for-the-badge)

</div>

---

## 🌟 Sobre el Proyecto

**MOKO-TOOLS** nace de la necesidad de tener acceso ultrarrápido a cientos de herramientas dispersas a través de la web, incluyendo URLs directas de tipo `.new` para crear documentos al instante y plataformas críticas de IA. 

Toda la recopilación, validación y categorización de este inmenso directorio ha sido **curada a mano e ideada exclusivamente para esta plataforma**. El objetivo es presentar esta colección en una UI inspirada en Apple Vision OS y diseño "Bento Grid", donde la belleza visual no compromete la rapidez de uso. 

### ✨ Características Principales

*   **Menú Bento Inmersivo**: Navegación rápida y categorizada visualmente mediante tarjetas interactivas gigantes. No más listas infinitas y desordenadas.
*   **Búsqueda textual normalizada**: Filtrado local sin tildes ni distinción de mayúsculas/minúsculas por nombre, descripción, atajo y categoría. No utiliza embeddings ni un motor vectorial.
*   **Diseño "Liquid Glass" (Glassmorphism)**: Interfaz translúcida premium, fondos modulares animados, desenfoques por hardware (blurs) y animaciones fluidas impulsadas por Framer Motion.
*   **Sistema de Favoritos Persistente**: Guarda tus herramientas de uso diario en tu navegador (LocalStorage) y accede a ellas con un solo click.
*   **Optimizaciones Modernas**: Renderizado SSR rápido vía Next.js 14 y estilado atómico sin CSS inútil.

---

## 📂 Categorías Cuidadosamente Organizadas

*   🏢 **Microsoft / Office**: Creación instantánea y gestión global.
*   📊 **Google Workspace**: Entornos colaborativos directos.
*   📝 **Notas / Documentación**: Páginas efímeras y documentadores rápidos.
*   🎨 **Diseño y Creatividad**: UI/UX, diagramas estructurales, wireframes.
*   💻 **Desarrollo y Código**: Sandboxes directos, repositorios y editores web.
*   🔍 **Inspección Forense**: Auditoría SEO de performance y seguridad integral.
*   ⚙️ **Automatización y Webhooks**: Pruebas de APIs, infraestructura viva.
*   💬 **Comunicaciones**: Videoconferencias instantáneas, chats directos.
*   💳 **Pagos / Negocio**: Conversores de cuentas, facturas express.
*   📄 **PDFs**: Utilidades rápidas de firma, partición y transformación de documentos.
*   🔗 **Utilidades**: Enlaces, acortadores y conversores a QR.
*   🤖 **IA y Machine Learning**: Accesos hiper-rápidos a los mejores LLMs.
*   🌐 **Sitios Clave**: Repositorios estándar ineludibles.

---

## 🛠️ Instalación y Despliegue (Local)

Para copiar, modificar y publicar este proyecto tú mismo:

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/manu-alvarez/MOKO-TOOLS.git
   cd MOKO-TOOLS/moko_tooling_utils/nextjs_space
   ```

2. **Instala las dependencias** (Recomendado Node.js 22 LTS)
   ```bash
   npm ci
   ```

3. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la magia.

4. **Compilación para Producción**
   ```bash
   npm run build
   npm run start
   ```

*(Nota: Este frontend Next.js lee una base de datos estática en formato JSON ubicada en `public/data/tools.json`)*.

---

## 👨‍💻 Autoría y Créditos

Este repositorio, incluyendo la extensa labor de recolección de los cientos de nodos, la categorización arquitectónica de `tools.json` y la dirección artística / requerimientos de la UI han sido **creados y organizados íntegramente de manera independiente**.

Desarrollado como iniciativa Open Source para agilizar el trabajo de desarrolladores, directores de proyecto y nómadas digitales a nivel global. ¡Úsalo y compártelo a tu gusto!

*   **Autor**: Manu Alvarez / [Alvarez Consult](https://github.com/manu-alvarez)
*   **Licencia**: MIT

---

> *"Las herramientas adecuadas no solo se usan; se disfrutan."*

## Convertir una lista de herramientas a JSON

Desde la raíz, ejecuta `python3 parse_tools.py lista.txt -o catalogo.json`. El archivo de entrada usa UTF-8 y agrupa los dominios bajo categorías numeradas.

```text
1) Documentos
docs.new — Crear un documento
```

La salida contiene las categorías y sus herramientas. Si omites `-o`, el script escribe `moko_tooling_data.json` en el directorio actual.

## Datos y límites de publicación

- Catálogo local: `moko_tooling_utils/nextjs_space/public/data/tools.json`; se actualiza en el repositorio y no verifica dinámicamente que las páginas externas sigan disponibles.
- Favoritos locales: `localStorage` con validación de datos guardados y carga previa al guardado; no existe sincronización entre dispositivos.
- El frontend usa Next.js 14 y puede ejecutarse sin configurar una base de datos externa para consultar el JSON estático; la presencia de dependencias Prisma no significa que se requiera una base de datos para la página de catálogo.
- La compilación mediante CI verifica la integridad del código, no la disponibilidad de todos los enlaces a terceros.
