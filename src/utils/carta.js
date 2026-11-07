// Carta del restaurante. Se puede editar desde el panel de administración.

export const IMAGEN_POR_DEFECTO =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

export const CATEGORIAS = ['Entradas', 'Fondos', 'Postres', 'Bebidas'];

export const CARTA_INICIAL = [
  // Entradas
  { 
    id: 1, 
    nombre: 'Ceviche clásico', 
    desc: 'Pesca fresca del día en leche de tigre, camote glaseado, choclo desgranado y canchita serrana crocante.', 
    precio: 38, 
    categoria: 'Entradas',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 2, 
    nombre: 'Causa limeña de pollo', 
    desc: 'Suave masa de papa amarilla prensada con ají amarillo y limón, rellena de pechuga deshilachada y palta fuerte.', 
    precio: 26, 
    categoria: 'Entradas',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 3, 
    nombre: 'Papa a la huancaína', 
    desc: 'Rodajas de papa nativa bañadas en cremosa salsa tradicional de ají amarillo y queso fresco, con aceituna y huevo duro.', 
    precio: 24, 
    categoria: 'Entradas',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 4, 
    nombre: 'Anticuchos tradicionales', 
    desc: 'Brochetas de corazón de res seleccionadas, marinadas en aderezo de ají panca y especias a la parrilla, con papa dorada y choclo.', 
    precio: 32, 
    categoria: 'Entradas',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 5, 
    nombre: 'Tequeños crocantes con guacamole', 
    desc: 'Masa fina y crocante rellena de abundante queso andino fundido, acompañada de cremoso guacamole criollo.', 
    precio: 22, 
    categoria: 'Entradas',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 6, 
    nombre: 'Pulpo al olivo', 
    desc: 'Finas láminas de pulpo tierno cocido a la perfección, bañado en salsa cremosa de aceitunas negras de botija y aceite de oliva.', 
    precio: 39, 
    categoria: 'Entradas',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 7, 
    nombre: 'Tiradito al ají amarillo', 
    desc: 'Cortes finos de corvina fresca marinados en suave emulsión de ají amarillo, limón sutil y crocante maíz chulpi.', 
    precio: 36, 
    categoria: 'Entradas',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=600&q=80' 
  },

  // Fondos
  { 
    id: 8, 
    nombre: 'Lomo saltado criollo', 
    desc: 'Jugosos dados de lomo fino salteados al wok a fuego vivo con cebolla morada, tomate, ají amarillo, papas fritas y arroz blanco con choclo.', 
    precio: 44, 
    categoria: 'Fondos',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 9, 
    nombre: 'Ají de gallina especial', 
    desc: 'Hebras tiernas de pechuga en salsa aterciopelada de ají amarillo y pecanas, servido con arroz blanco, papas amarillas y huevo.', 
    precio: 34, 
    categoria: 'Fondos',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 10, 
    nombre: 'Arroz con mariscos', 
    desc: 'Arroz meloso criollo preparado en fondo concentrado marino, mariscos selectos del litoral, pimientos y salsa criolla.', 
    precio: 42, 
    categoria: 'Fondos',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 11, 
    nombre: 'Seco de res norteño', 
    desc: 'Corte selecto de res macerado en chicha de jora y culantro, cocido a fuego lento, servido con frijoles canarios y arroz blanco.', 
    precio: 40, 
    categoria: 'Fondos',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 12, 
    nombre: 'Arroz chaufa especial al wok', 
    desc: 'Arroz salteado estilo chifa con trozos de lomo, pollo crocante, langostinos, cebollita china, pimientos y aceite de ajonjolí.', 
    precio: 36, 
    categoria: 'Fondos',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 13, 
    nombre: 'Tallarines verdes con apanado', 
    desc: 'Fideos al dente bañados en cremosa salsa pesto limeña a base de albahaca fresca y espinaca, acompañados de milanesa crocante.', 
    precio: 38, 
    categoria: 'Fondos',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 14, 
    nombre: 'Tacu tacu con lomo al jugo', 
    desc: 'Generosa porción dorada de arroz y frijoles tostados al fuego, cubierta de un jugoso lomo fino flambeado en pisco Quebranta.', 
    precio: 45, 
    categoria: 'Fondos',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 15, 
    nombre: 'Pescado a lo macho', 
    desc: 'Filete de pesca blanca sellado a la plancha, bañado en contundente salsa picante de mariscos y ají panca, con guarnición de arroz.', 
    precio: 46, 
    categoria: 'Fondos',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80' 
  },

  // Postres
  { 
    id: 16, 
    nombre: 'Suspiro a la limeña', 
    desc: 'Clásico postre tradicional a base de suave manjar blanco de yemas, coronado con merengue al oporto y canela molida.', 
    precio: 18, 
    categoria: 'Postres',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 17, 
    nombre: 'Tarta de lúcuma y chocolate', 
    desc: 'Mousse esponjoso de lúcuma andina sobre base de galleta crocante y cubierta con ganache de chocolate peruano 70% cacao.', 
    precio: 22, 
    categoria: 'Postres',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 18, 
    nombre: 'Combinado: Mazamorra y Arroz con leche', 
    desc: 'El clásico dúo limeño: mazamorra de maíz morado con frutos secos junto a cremoso arroz con leche perfumado con canela y clavo.', 
    precio: 16, 
    categoria: 'Postres',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 19, 
    nombre: 'Torta tres leches clásica', 
    desc: 'Bizcochuelo esponjoso impregnado en almíbar de tres leches, decorado con chantilly casero y toques de frutas frescas.', 
    precio: 19, 
    categoria: 'Postres',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 20, 
    nombre: 'Crema volteada artesanal', 
    desc: 'Postre horneado a baño maría con textura sedosa, bañado en caramelo dorado oscuro con ligero perfume de ralladura de naranja.', 
    precio: 17, 
    categoria: 'Postres',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80' 
  },

  // Bebidas
  { 
    id: 21, 
    nombre: 'Chicha morada artesanal (Jarra 1L)', 
    desc: 'Receta de la casa hervida con maíz morado, piña golden, manzana, membrillo, canela, clavo de olor y zumo de limón fresco.', 
    precio: 18, 
    categoria: 'Bebidas',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 22, 
    nombre: 'Pisco Sour tradicional', 
    desc: 'Cóctel emblemático con pisco Quebranta selecto, zumo fresco de limón sutil, jarabe de goma, clara de huevo y gotas de amargo de angostura.', 
    precio: 26, 
    categoria: 'Bebidas',
    popular: true, 
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 23, 
    nombre: 'Maracuyá Sour', 
    desc: 'Versión frutal elaborada con pulpa pura de maracuyá madura, pisco acholado artesanal y toque refrescante de limón.', 
    precio: 26, 
    categoria: 'Bebidas',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 24, 
    nombre: 'Limonada de hierbaluisa y menta', 
    desc: 'Refrescante jarra o vaso largo preparado con infusión fría de hierbaluisa natural, hojas de menta maceradas y hielo.', 
    precio: 14, 
    categoria: 'Bebidas',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 25, 
    nombre: 'Chilcano clásico de pisco', 
    desc: 'Bebida larga con pisco Quebranta, gotas de zumo de limón, amargo de angostura y ginger ale bien frío con hielo en cubos.', 
    precio: 24, 
    categoria: 'Bebidas',
    popular: false, 
    img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80' 
  }
];

const KEY_CARTA = 'cartaPlatos';

// Devuelve la carta guardada. Si es la primera vez, guarda la carta inicial.
export const getPlatos = () => {
  try {
    const guardados = localStorage.getItem(KEY_CARTA);
    if (!guardados) {
      localStorage.setItem(KEY_CARTA, JSON.stringify(CARTA_INICIAL));
      return [...CARTA_INICIAL];
    }

    const lista = JSON.parse(guardados);
    return Array.isArray(lista) ? lista : [...CARTA_INICIAL];
  } catch (error) {
    return [...CARTA_INICIAL];
  }
};

export const guardarPlatos = (platos) => {
  localStorage.setItem(KEY_CARTA, JSON.stringify(platos));
  return platos;
};

export const restaurarCarta = () => {
  localStorage.setItem(KEY_CARTA, JSON.stringify(CARTA_INICIAL));
  return [...CARTA_INICIAL];
};

export const nuevoIdPlato = (platos) => {
  return platos.reduce((mayor, plato) => Math.max(mayor, Number(plato.id) || 0), 0) + 1;
};
