import ToolsApp from './components/tools-app'
import RegisterServiceWorker from './register-sw'
import type { ToolsData } from '@/lib/types'
import { readFileSync } from 'fs'
import { join } from 'path'

// Mapeo de descripciones basado en las categorías del usuario
const categoryDescriptions: Record<string, string> = {
  "1": "Crear al instante y gestionar proyectos con las suites de Office",
  "2": "Crear al instante y colaborar con documentos, hojas y presentaciones",
  "3": "Toma rápida de notas, documentación, repositorios y páginas efímeras",
  "4": "Herramientas de diseño UI, creatividad visual, diagramas de arquitectura",
  "5": "Acceso rápido a sandboxes de código, editores online y repositorios",
  "6": "Inspección de código, auditoría performance SEO, seguridad web y forense",
  "7": "Motores de automatización rápida, testeos de webhooks y despliegues",
  "8": "Acceso directo a comunicación, reuniones instantáneas y edición de contenido",
  "9": "Plataformas de gestión de pagos online, facturas exprés y herramientas B2B",
  "10": "Crear, transformar, combinar y editar documentos en formato PDF",
  "11": "Acortadores de enlaces, conversores a QR y otras utilidades prácticas",
  "12": "Acceso a plataformas de Inteligencia Artificial (LLM, RAG y Machine Learning)",
  "13": "Sitios externos útiles sin versión 'punto new'",
  "14": "Suites y repositorios externos sin versión 'punto new'",
};

// Server component que carga los datos
export default function Home() {
  // Cargar datos del JSON en el servidor usando fs
  let toolsData: ToolsData = { categories: [] }
  
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'tools.json')
    const fileContents = readFileSync(filePath, 'utf8')
    toolsData = JSON.parse(fileContents ?? '{}')
    
    // Inyectar descripciones a las categorías
    if (toolsData.categories) {
      toolsData.categories = toolsData.categories.map(cat => ({
        ...cat,
        description: categoryDescriptions[cat.id] || "Herramientas de utilidad"
      }))
    }
  } catch (error) {
    console.error('Error loading tools data:', error)
    toolsData = { categories: [] }
  }
  
  return (
    <main className="min-h-screen w-full">
      <RegisterServiceWorker />
      <ToolsApp initialData={toolsData} />
    </main>
  )
}
