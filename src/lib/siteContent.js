// Centralized site content — edit all copy, CTAs, and contact info here.

export const SITE_CONTENT = {
  brand: {
    name: 'Tacos El Pecado',
    tagline: 'El pecado nunca supo tan bien.',
  },

  hero: {
    eyebrow: 'Todo gran pecado comienza con una tentación',
    titleLine1: 'Confiesa',
    titleLine2: 'tu',
    titleAccent: 'antojo',
    subtitle: 'Carne, fuego y cero arrepentimiento.',
    ctaPrimary: { label: 'Cometer el Pecado', to: '/pedido' },
    ctaSecondary: { label: 'Ver el Códex', to: '/menu' },
    stats: [
      { value: '12+', label: 'Guisos' },
      { value: '30′', label: 'Entrega' },
      { value: '100%', label: 'Al carbón' },
    ],
  },

  manifesto: {
    eyebrow: 'El Manifiesto',
    lines: [
      { text: 'No venimos a quitarte el hambre.', emphasis: false },
      { text: 'Venimos a tentarte.', emphasis: true },
      { text: 'Aquí la gula no se perdona.', emphasis: false },
      { text: 'Resistirse también es pecado.', emphasis: true },
    ],
    closing: 'Cruza la línea.',
  },

  sins: {
    eyebrow: 'Elige tu Pecado',
    title: 'Siete tentaciones',
    titleAccent: 'una condena',
    subtitle: 'Elige la tuya.',
    cta: 'Ordenar este pecado',
    // Sin-themed names mapped to menu categories
    sinNames: {
      tacos: 'La Tentación',
      especiales: 'El Pecado Original',
      bebidas: 'La Lujuria',
      complementos: 'La Avaricia',
    },
  },

  ritual: {
    eyebrow: 'El Ritual',
    title: 'No es comida.',
    titleAccent: 'Es tentación.',
    description: 'El carbón marca el ritmo, no la prisa.',
    pillars: [
      { icon: 'flame', title: 'Al Carbón', desc: 'Cada taco pasa por las brasas.' },
      { icon: 'leaf', title: 'Ingredientes Vivos', desc: 'Salsas en metate, tortillas recién hechas.' },
      { icon: 'clock', title: 'Tiempos Lentos', desc: 'Marinados de 24 horas. La prisa arruina el ritual.' },
      { icon: 'award', title: 'Receta Confesada', desc: 'Herencia sobre el trompo.' },
    ],
  },

  gallery: {
    eyebrow: 'El Infierno en Imágenes',
    title: 'Cada detalle',
    titleAccent: 'una tentación',
    images: [
      { src: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=80', alt: 'Tacos al pastor en plena oscuridad', span: 'wide' },
      { src: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80', alt: 'Taco close-up con cilantro y salsa', span: 'tall' },
      { src: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80', alt: 'Plato de tacos con iluminación dramática', span: 'normal' },
      { src: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=900&q=80', alt: 'Carne asándose a la brasa', span: 'wide' },
      { src: 'https://media.base44.com/images/public/6a59c835542617752331b47a/2569873ef_generated_image.png', alt: 'Tacos en composición oscura', span: 'tall' },
      { src: 'https://media.base44.com/images/public/6a59c835542617752331b47a/fa6b67adf_generated_image.png', alt: 'Llamas de la parrilla', span: 'normal' },
    ],
  },

  location: {
    eyebrow: 'El Lugar del Pecado',
    title: 'Encuéntranos',
    titleAccent: 'en la oscuridad',
    address: 'C. Velázquez 445, La Estancia, 45030 Zapopan, Jal.',
    phone: '33 3949 9486',
    hours: 'Jue a Dom · 6pm – 3am',
    coords: { lat: 20.6677408, lng: -103.4272548 },
    ctaDirections: 'Cómo llegar',
    ctaWhatsApp: 'Pedir por WhatsApp',
  },

  finalCta: {
    eyebrow: 'La decisión es tuya',
    title: 'Resistirse',
    titleAccent: 'también es pecado',
    subtitle: 'Tu lugar te espera. Las brasas están encendidas.',
    cta: { label: 'Cometer el Pecado', to: '/pedido' },
    ctaSecondary: { label: 'Ver el Códex', to: '/menu' },
  },
};

// Image assets — replace with real photography
export const SITE_IMAGES = {
  logo: 'https://media.base44.com/images/public/6a59c835542617752331b47a/5ac8d1df0_image.png',
  heroBg: 'https://media.base44.com/images/public/6a59c835542617752331b47a/12ec593cd_generated_1c34ba63.png',
  ritualKitchen: 'https://media.base44.com/images/public/6a59c835542617752331b47a/b8932c5de_generated_3b2641d3.png',
};
