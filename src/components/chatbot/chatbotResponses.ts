
// Categorías de mensajes y respuestas predeterminadas
const responses = {
  en: {
    greeting: [
      "Hello! How can I help you today?",
      "Welcome to Terreta Hub! What would you like to know?",
      "Hi there! I'm the Terreta Assistant. How can I assist you?"
    ],
    domains: [
      "Terreta Hub offers various domains like art, legal, business, health, community, and tech. Each domain focuses on different areas of interest.",
      "Our domains are organized by categories. Some are available for claiming, others are already in use by projects.",
      "You can explore available domains in the /dominio section. Each domain has a specific purpose within the Terreta ecosystem."
    ],
    projects: [
      "Terreta Hub hosts various projects created by community members. You can explore them in the projects section.",
      "Projects in Terreta Hub cover many topics, from art and technology to business and health.",
      "Are you interested in starting your own project? You can register and propose one in the projects section!"
    ],
    about: [
      "Terreta Hub is a community platform that connects people with similar interests in various domains.",
      "Our mission is to create a space where people can collaborate, share knowledge, and develop projects together.",
      "Terreta Hub was created to foster collaboration and innovation across different domains and interests."
    ],
    help: [
      "You can navigate Terreta Hub using the top menu. Check out domains, projects, and resources!",
      "If you're looking for specific content, use the search bar at the top of the page.",
      "Need more help? You can visit our forum to ask questions to the community."
    ],
    fallback: [
      "I'm sorry, I don't have enough information about that yet. Would you like to know about domains or projects instead?",
      "I'm still learning about Terreta Hub. Can I help you with something else?",
      "That's beyond my current knowledge. Would you like to know about our domains or projects?"
    ]
  },
  es: {
    greeting: [
      "¡Hola! ¿En qué puedo ayudarte hoy?",
      "¡Bienvenido a Terreta Hub! ¿Qué te gustaría saber?",
      "¡Hola! Soy el Asistente de Terreta. ¿Cómo puedo ayudarte?"
    ],
    domains: [
      "Terreta Hub ofrece varios dominios como arte, legal, negocios, salud, comunidad y tecnología. Cada dominio se enfoca en diferentes áreas de interés.",
      "Nuestros dominios están organizados por categorías. Algunos están disponibles para reclamar, otros ya están en uso por proyectos.",
      "Puedes explorar los dominios disponibles en la sección /dominio. Cada dominio tiene un propósito específico dentro del ecosistema de Terreta."
    ],
    projects: [
      "Terreta Hub alberga varios proyectos creados por miembros de la comunidad. Puedes explorarlos en la sección de proyectos.",
      "Los proyectos en Terreta Hub cubren muchos temas, desde arte y tecnología hasta negocios y salud.",
      "¿Estás interesado en iniciar tu propio proyecto? ¡Puedes registrarte y proponer uno en la sección de proyectos!"
    ],
    about: [
      "Terreta Hub es una plataforma comunitaria que conecta a personas con intereses similares en varios dominios.",
      "Nuestra misión es crear un espacio donde las personas puedan colaborar, compartir conocimientos y desarrollar proyectos juntos.",
      "Terreta Hub fue creado para fomentar la colaboración y la innovación en diferentes dominios e intereses."
    ],
    help: [
      "Puedes navegar por Terreta Hub usando el menú superior. ¡Consulta dominios, proyectos y recursos!",
      "Si buscas contenido específico, usa la barra de búsqueda en la parte superior de la página.",
      "¿Necesitas más ayuda? Puedes visitar nuestro foro para hacer preguntas a la comunidad."
    ],
    fallback: [
      "Lo siento, aún no tengo suficiente información sobre eso. ¿Te gustaría saber sobre dominios o proyectos?",
      "Todavía estoy aprendiendo sobre Terreta Hub. ¿Puedo ayudarte con algo más?",
      "Eso está más allá de mi conocimiento actual. ¿Te gustaría saber sobre nuestros dominios o proyectos?"
    ]
  }
};

// Determinar la categoría del mensaje
const categorizeMessage = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hola') || message.includes('saludos')) {
    return 'greeting';
  } else if (message.includes('domain') || message.includes('dominio') || message.includes('categoría') || message.includes('category')) {
    return 'domains';
  } else if (message.includes('project') || message.includes('proyecto') || message.includes('collaborate') || message.includes('colaborar')) {
    return 'projects';
  } else if (message.includes('about') || message.includes('acerca') || message.includes('what is') || message.includes('qué es')) {
    return 'about';
  } else if (message.includes('help') || message.includes('ayuda') || message.includes('support') || message.includes('soporte')) {
    return 'help';
  } else {
    return 'fallback';
  }
};

// Obtener una respuesta aleatoria según la categoría y el idioma
export const getRandomBotResponse = (message: string, language: string = 'es'): string => {
  const category = categorizeMessage(message);
  const lang = language === 'en' ? 'en' : 'es';
  const categoryResponses = responses[lang][category as keyof typeof responses.en];
  
  // Seleccionar una respuesta aleatoria de la categoría
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
};
