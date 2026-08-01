import en, { type Dictionary } from './en';

/**
 * Spanish dictionary.
 *
 * The structure is inherited from the English dictionary, so the site never
 * renders an empty string while translation is in progress. To translate a
 * section, add its key to the object below — it overrides the English fallback.
 *
 * Still inherited from English (TODO): `technology.cards[].body`, `specs.groups`.
 */
const es: Dictionary = {
  ...structuredClone(en),

  meta: {
    title: 'AUREON S5 — Excavadora de Precisión Inteligente',
    description:
      'Miniexcavadora de 5 toneladas con radar de penetración terrestre y posicionamiento GNSS de precisión centimétrica. Fabricada en Türkiye para obra urbana europea.',
    ogAlt: 'AUREON S5 Excavadora de Precisión Inteligente',
  },

  nav: {
    positioning: 'Posicionamiento',
    technology: 'Tecnología',
    specifications: 'Ficha técnica',
    fieldMap: 'Mapa de obras',
    export: 'Exportación',
    contact: 'Contacto',
    menu: 'Menú',
    close: 'Cerrar',
    languageLabel: 'Idioma',
  },

  loader: {
    label: 'Cargando escena',
    hint: 'Preparando la secuencia de escaneo',
  },

  hero: {
    ...structuredClone(en.hero),
    subtitle: 'Excavadora de Precisión Inteligente',
    scrollHint: 'Desplazar',
    tags: {
      weight: '5.000 kg',
      gnss: 'GNSS ±2,5 cm',
      noise: '94 dB (LwA)',
      gpr: 'GPR 4,0 m',
    },
    tagNames: {
      weight: 'Peso operativo',
      gnss: 'Precisión de posición',
      noise: 'Nivel de potencia acústica',
      gpr: 'Profundidad de escaneo',
    },
    sonarLabel: 'Radar de Penetración Terrestre — Activo',
    scanState: {
      idle: 'En espera',
      scanning: 'Escaneando',
      resolved: 'Objetivos detectados',
    },
    detectionFields: { depth: 'Profundidad', diameter: 'Ø', risk: 'Riesgo' },
    risk: { low: 'Bajo', medium: 'Medio', high: 'Alto' },
    detections: [
      { id: 'water', label: 'Tubería de agua PE-100', depth: '2,40 m', diameter: 'Ø160 mm', risk: 'low' },
      { id: 'power', label: 'Cable de media tensión', depth: '1,15 m', diameter: 'Ø90 mm', risk: 'high' },
      { id: 'fiber', label: 'Haz de fibra óptica', depth: '0,85 m', diameter: 'Ø48 mm', risk: 'medium' },
      { id: 'sewer', label: 'Colector de hormigón', depth: '3,20 m', diameter: 'Ø400 mm', risk: 'low' },
    ],
    message: {
      headline: 'Ve antes de excavar.',
      sub: 'Radar de penetración terrestre, de serie en cada S5.',
    },
    chapters: {
      arrival: 'Llegada',
      recognition: 'Reconocimiento',
      scan: 'Escaneo del subsuelo',
      message: 'Mensaje',
    },
  },

  positioning: {
    eyebrow: 'Posicionamiento',
    manifesto: 'El error más caro de la excavación urbana es golpear lo que no se veía.',
    body:
      'La S5 se construyó alrededor de una sola pregunta: qué hay bajo el suelo antes de que entre el cazo. Todo lo demás — la hidráulica, la cabina, el nivel sonoro — se deriva de trabajar en una calle que ya está llena.',
    stats: [
      { value: '€ 54.900', label: 'Precio neto de venta' },
      { value: '5.000 kg', label: 'Peso operativo' },
      { value: '±2,5 cm', label: 'Precisión de posición' },
    ],
  },

  technology: {
    ...structuredClone(en.technology),
    eyebrow: 'Tecnología',
    title: 'Cuatro sistemas, un propósito',
    intro: 'Nada de esto es un paquete opcional. Cada S5 sale de fábrica con los cuatro.',
  },

  specs: {
    ...structuredClone(en.specs),
    eyebrow: 'Ficha técnica',
    title: 'Datos técnicos',
    note: 'Valores para la configuración estándar con orugas de goma y cazo de 0,16 m³.',
    columns: { parameter: 'Parámetro', value: 'Valor' },
  },

  map: {
    eyebrow: 'Mapa de obras de referencia',
    title: 'Vea una AUREON trabajando',
    subtitle: 'Mire una obra, no un folleto. Visite la AUREON más cercana.',
    nearestPrefix: 'AUREON más cercana',
    locating: 'Localizando',
    locationFallback: 'Punto de referencia por defecto: Madrid, España',
    distanceUnit: 'km',
    listView: 'Lista',
    globeView: 'Globo',
    dragHint: 'Arrastre para girar · seleccione un marcador',
    selectPrompt: 'Seleccione un marcador para ver la ficha de la obra.',
    emptyRegion: 'Todavía no hay ninguna AUREON en esta región —',
    emptyRegionCta: 'sea el primero',
    disclaimer: 'La información de las obras de referencia es representativa.',
    sectors: {
      'urban-renewal': 'Renovación de infraestructura urbana',
      'road-sewer': 'Viales y saneamiento',
      landscaping: 'Paisajismo y espacio público',
      fiber: 'Infraestructura de fibra y telecom',
      rebuild: 'Reconstrucción urbana',
      energy: 'Líneas de infraestructura energética',
      'urban-dig': 'Excavación urbana y servicios',
      municipal: 'Obras de infraestructura municipal',
      water: 'Redes de agua y drenaje',
      'road-urban': 'Viales e infraestructura urbana',
    },
    countries: {
      slovenia: 'Eslovenia',
      romania: 'Rumanía',
      bulgaria: 'Bulgaria',
      sweden: 'Suecia',
      ukraine: 'Ucrania',
      azerbaijan: 'Azerbaiyán',
      georgia: 'Georgia',
      tunisia: 'Túnez',
      libya: 'Libia',
      algeria: 'Argelia',
    },
    panel: {
      sector: 'Sector',
      inField: 'En obra',
      months: 'meses',
      hours: 'horas de operación',
      certificate: 'Certificado de autenticidad',
      serial: 'N.º de serie',
      production: 'Fabricación',
      verified: 'Verificado',
      cta: 'Ver esta máquina en obra',
      photoPlaceholder: 'Imagen de obra',
      close: 'Cerrar panel',
    },
    modal: {
      titlePrefix: 'Solicitud de visita a obra',
      body:
        'Su solicitud se envía a AUREON. Le contactaremos una vez que la empresa anfitriona haya aprobado la visita.',
      privacyNote: 'Los datos de contacto de la empresa anfitriona nunca se publican en este sitio.',
      fields: {
        name: 'Nombre y apellidos',
        company: 'Empresa',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        date: 'Fecha preferida',
        note: 'Nota',
      },
      submit: 'Enviar solicitud',
      sending: 'Enviando',
      success: 'Solicitud recibida. Responderemos en un plazo de 24 horas.',
      error: 'Algo ha fallado. Inténtelo de nuevo.',
      close: 'Cerrar',
    },
  },

  exportSection: {
    ...structuredClone(en.exportSection),
    eyebrow: 'Exportación y documentación',
    title: 'De la línea a su parque de maquinaria',
    body:
      'Cada unidad sale con el expediente aduanero completo. La entrega en un parque español es de 12–16 días desde la carga.',
    steps: [
      { id: 'production', label: 'Producción' },
      { id: 'qc', label: 'Control de calidad' },
      { id: 'atr', label: 'Emisión A.TR' },
      { id: 'loading', label: 'Carga (CMR)' },
      { id: 'customs', label: 'Aduana' },
      { id: 'delivery', label: 'Entrega' },
    ],
    badges: ['CE', 'Stage V', 'ISO 9001', 'Certificado de circulación A.TR', 'Unión Aduanera'],
    gtipLabel: 'Código arancelario',
  },

  contact: {
    eyebrow: 'Contacto',
    title: 'Solicite una oferta',
    body:
      'Díganos dónde trabajará la máquina y qué va a excavar. Respondemos con una oferta por escrito, un plazo de entrega y la obra de referencia más cercana.',
    responseNote: 'Respuesta por escrito en un día laborable.',
    form: {
      name: 'Nombre y apellidos',
      company: 'Empresa',
      country: 'País',
      countryPlaceholder: 'Seleccione un país',
      selectPlaceholder: 'Seleccione',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      interest: 'Interés',
      message: 'Mensaje',
      submit: 'Enviar',
      sending: 'Enviando',
      success: 'Mensaje recibido. Responderemos en un día laborable.',
      error: 'Algo ha fallado. Inténtelo de nuevo.',
      required: 'Obligatorio',
      invalidEmail: 'Introduzca una dirección de correo válida',
    },
    interests: [
      { id: 'purchase', label: 'Compra' },
      { id: 'dealership', label: 'Distribución' },
      { id: 'visit', label: 'Visita a obra' },
    ],
  },

  footer: {
    ...structuredClone(en.footer),
    quickLinks: 'Secciones',
    legal: 'Legal',
    rights: 'Todos los derechos reservados.',
  },

  a11y: {
    skipToContent: 'Ir al contenido',
    scrollProgress: 'Progreso de desplazamiento',
    logoAlt: 'Logotipo escudo AUREON',
    heroCanvasAlt:
      'Vista tridimensional de la excavadora AUREON S5 escaneando conducciones enterradas con radar de penetración terrestre.',
    globeAlt: 'Globo interactivo con las obras de referencia AUREON.',
  },
};

export default es;
