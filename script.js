const SUPPORTED_TRANSLATION_LANGUAGES = ['es', 'en', 'fr', 'de'];
const GOOGLE_TRANSLATE_ELEMENT_ID = 'google_translate_element';
const DEFAULT_LANGUAGE = 'es';

function setGoogleTranslateCookie(language) {
    const lang = SUPPORTED_TRANSLATION_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    const cookieValue = `/es/${lang}`;
    document.cookie = `googtrans=${cookieValue};path=/`;
}

function createGoogleTranslateElement() {
    let container = document.getElementById(GOOGLE_TRANSLATE_ELEMENT_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = GOOGLE_TRANSLATE_ELEMENT_ID;
        container.style.display = 'none';
        document.body.appendChild(container);
    }
}

function applyGoogleTranslateStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .goog-te-banner-frame.skiptranslate, .goog-logo-link, .goog-te-gadget-icon {
            display: none !important;
        }
        body {
            top: 0 !important;
        }
    `;
    document.head.appendChild(style);
}

function loadGoogleTranslateScript() {
    createGoogleTranslateElement();
    applyGoogleTranslateStyles();
    const translateScript = document.createElement('script');
    translateScript.type = 'text/javascript';
    translateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    translateScript.async = true;
    document.body.appendChild(translateScript);
}

function googleTranslateElementInit() {
    if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
        new google.translate.TranslateElement({
            pageLanguage: 'es',
            includedLanguages: 'en,fr,de',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, GOOGLE_TRANSLATE_ELEMENT_ID);
    }
}

function initializeTranslation() {
    const selector = document.getElementById('selector-idioma');
    const storedLanguage = localStorage.getItem('language') || DEFAULT_LANGUAGE;
    setGoogleTranslateCookie(storedLanguage);
    if (selector) {
        selector.value = storedLanguage;
        selector.addEventListener('change', () => {
            const selectedLanguage = selector.value;
            localStorage.setItem('language', selectedLanguage);
            setGoogleTranslateCookie(selectedLanguage);
            window.location.reload();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeTranslation();
    loadGoogleTranslateScript();

    // Esto es más eficiente que buscarlos cada vez que se usa la función.
    const inputHero = document.getElementById("input-busqueda");
    const inputFlotante = document.getElementById("input-busqueda-flotante");
    const buscadorFlotante = document.getElementById("buscador-flotante");
    
    // Obtener los botones de búsqueda
    const botonesBusqueda = document.querySelectorAll(".btn");
    
    // Función de búsqueda genérica
    const buscar = (inputElement) => {
        const consulta = inputElement.value.trim().toLowerCase();
        
        if (!consulta) {
            alert("Por favor, escribe algo para buscar.");
            return;
        }
        
        // Aquí puedes agregar la lógica real de búsqueda, por ahora se mantiene el alert
        alert(`Buscarías: ${consulta} (luego puedes conectar esto a un buscador real)`);
        
        // Limpiar el campo de entrada después de la búsqueda
        inputElement.value = "";
    };

    // Escuchar el evento 'keydown' en los campos de búsqueda
    if (inputHero) {
        inputHero.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                buscar(inputHero);
            }
        });
    }

    if (inputFlotante) {
        inputFlotante.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                buscar(inputFlotante);
            }
        });
    }

    // Añadir event listeners a todos los botones con la clase 'btn'
    botonesBusqueda.forEach(button => {
        button.addEventListener("click", () => {
            const inputAsociado = button.closest(".buscador-hero") ? inputHero : inputFlotante;
            if (!inputAsociado) return;
        });
    });

    // Función para mostrar el buscador flotante cuando se hace scroll
    const mostrarBuscadorFlotante = () => {
        const heroSection = document.querySelector(".hero");
        const scrollPos = window.scrollY;
        
        // Si la posición de desplazamiento es mayor que la altura de la sección hero,
        // muestra el buscador flotante.
        if (scrollPos > heroSection.offsetHeight) {
            buscadorFlotante.classList.add("activo");
        } else {
            buscadorFlotante.classList.remove("activo");
        }
    };

// ===========================================
// 6. LÓGICA DEL CONTADOR DE ESTADÍSTICAS
// ===========================================

const actualizarContadores = () => {
    // 1. Artículos (Usando la lista de artículos de QUÍMICA como total)
    // Si tienes otra lista de artículos destacados, suma ambas longitudes.
    const totalArticulos = articulosQuimica.length; 
    const contadorArticulos = document.getElementById('contador-articulos');
    if (contadorArticulos) {
        contadorArticulos.textContent = totalArticulos;
    }

    // 2. Videos
    const totalVideos = videosDeQuimica.length;
    const contadorVideos = document.getElementById('contador-videos');
    if (contadorVideos) {
        contadorVideos.textContent = totalVideos;
    }

    // 3. Colaboradores (Necesitas definir un array para los colaboradores)
    // Por ahora, lo pondremos fijo, pero si defines la lista, usa su .length
    const colaboradores = [
        { nombre: "Colab A" },
        { nombre: "Colab B" },
        { nombre: "Colab C" },
        { nombre: "Colab D" }
        // ... (Añade tu lista real de colaboradores aquí)
    ];
    const totalColaboradores = colaboradores.length; 
    const contadorColaboradores = document.getElementById('contador-colaboradores');
    if (contadorColaboradores) {
        contadorColaboradores.textContent = totalColaboradores;
    }
};

// Llama a la función al cargar la página
actualizarContadores();


    // Escuchar el evento 'scroll' de la ventana
    window.addEventListener("scroll", mostrarBuscadorFlotante);
});

// Dentro de tu evento DOMContentLoaded en script.js
const db = firebase.firestore();
const articlesRef = db.collection("articles");

document.addEventListener("DOMContentLoaded", () => {
    // ... tu código existente ...

    const renderizarVideos = (videoIds) => {
        const contenedorVideos = document.querySelector(".subapartado .contenedor-elementos");
        if (!contenedorVideos) return; // Salir si no se encuentra el contenedor

        contenedorVideos.innerHTML = ''; // Limpia el contenedor

        videoIds.forEach(video => {
            const videoCard = document.createElement('a');
            videoCard.href = `https://www.youtube.com/watch?v=${video.id}`;
            videoCard.target = "_blank";
            videoCard.classList.add("video-card");
            videoCard.innerHTML = `
                <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="Miniatura del video de YouTube: ${video.title}">
                <div class="video-overlay">
                    <i class="fas fa-play"></i>
                </div>
                <h4>${video.title}</h4>
            `;
            contenedorVideos.appendChild(videoCard);
        });
    };

    // Esta sería tu lista de videos
    const videosDeQuimica = [
        { id: "eB7K7V3-g-w", title: "La Tabla Periódica Explicada" },
        { id: "PPZfaO3TPf0", title: "Experimentos de Laboratorio en Casa" },
        // Añade más videos aquí
    ];

    renderizarVideos(videosDeQuimica);
});



document.addEventListener("DOMContentLoaded", () => {
    // ... tu código existente ...

    const renderizarVideos = (videos) => {
        const contenedorVideos = document.querySelector(".subapartado .contenedor-elementos");
        if (!contenedorVideos) return;
        contenedorVideos.innerHTML = '';

        videos.forEach(video => {
            const videoCard = document.createElement('a');
            videoCard.href = `https://www.youtube.com/watch?v=${video.id}`;
            videoCard.target = "_blank";
            videoCard.classList.add("video-card");
            videoCard.innerHTML = `
                <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="Miniatura del video de YouTube: ${video.title}">
                <div class="video-overlay"><i class="fas fa-play"></i></div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <div class="meta-data">
                        <span class="idioma" aria-label="Idioma: ${video.idioma === 'es' ? 'Español' : 'Inglés'}">${video.idioma === 'es' ? '🇪🇸' : '🇬🇧'}</span>
                        <span class="dificultad ${video.dificultad.toLowerCase()}" aria-label="Nivel: ${video.dificultad}">${video.dificultad}</span>
                        <span class="fecha-publicacion" aria-label="Publicado el">${video.fecha}</span>
                    </div>
                </div>
            `;
            contenedorVideos.appendChild(videoCard);
        });
    };

    // Ejemplo de cómo se vería tu lista de videos con los nuevos datos
    const videosDeQuimica = [
        { id: "eB7K7V3-g-w", title: "La Tabla Periódica Explicada", idioma: "es", dificultad: "Básico", fecha: "20 de febrero, 2025" },
        { id: "S6x2oH5uRGE", title: "Experimentos de Laboratorio", idioma: "en", dificultad: "Avanzado", fecha: "10 de marzo, 2025" },
    ];

    renderizarVideos(videosDeQuimica);

    // Repite lo mismo para los artículos:
    const renderizarArticulos = (articulos) => {
        const contenedorArticulos = document.querySelector(".articulos-recientes .contenedor-elementos");
        if (!contenedorArticulos) return;
        contenedorArticulos.innerHTML = '';

        articulos.forEach(articulo => {
            const articleCard = document.createElement("article");
            articleCard.classList.add("articulo-card");
            articleCard.innerHTML = `
                <img src="${articulo.imagenUrl}" alt="${articulo.alt}">
                <div class="articulo-contenido">
                    <h4>${articulo.title}</h4>
                    <p>${articulo.descripcion}</p>
                    <div class="meta-data">
                        <span class="idioma" aria-label="Idioma: ${articulo.idioma === 'es' ? 'Español' : 'Inglés'}">${articulo.idioma === 'es' ? '🇪🇸' : '🇬🇧'}</span>
                        <span class="dificultad ${articulo.dificultad.toLowerCase()}" aria-label="Nivel: ${articulo.dificultad}">${articulo.dificultad}</span>
                        <span class="fecha-publicacion" aria-label="Publicado el">${articulo.fecha}</span>
                    </div>
                    <a href="${articulo.url}" class="btn-leer-mas">Leer más</a>
                </div>
            `;
            contenedorArticulos.appendChild(articleCard);
        });
    };

    // Ejemplo de tu lista de artículos con los nuevos datos
    const articulosDestacados = [
        { title: "La magia de la tabla periódica", descripcion: "Descubre cómo los elementos químicos interactúan entre sí.", imagenUrl: "https://via.placeholder.com/400x250", alt: "Imagen", idioma: "es", dificultad: "Intermedio", fecha: "08 de septiembre, 2025" },
        // ... otros artículos
    ];

    renderizarArticulos(articulosDestacados);
});


document.addEventListener("DOMContentLoaded", () => {
    // ... Tu código existente para renderizar videos y otros elementos ...

    // --- Lista de artículos para la sección de QUÍMICA ---
    // Esta lista se usará para el buscador de la sección de Química
    const articulosQuimica = [
        { 
            title: "La magia de la tabla periódica", 
            descripcion: "Un recorrido fascinante por la historia y secretos de los elementos...", 
            imagenUrl: "https://via.placeholder.com/400x250", 
            alt: "Imagen del artículo de Química", 
            idioma: "es", 
            dificultad: "Básico", 
            fecha: "2025-09-08", 
            url: "#" 
        },
        { 
            title: "El futuro de los polímeros inteligentes", 
            descripcion: "Descubre cómo los polímeros están revolucionando la tecnología y la medicina...", 
            imagenUrl: "https://via.placeholder.com/400x250", 
            alt: "Ejemplo de imagen de un artículo", 
            idioma: "es", 
            dificultad: "Intermedio", 
            fecha: "2025-09-08", 
            url: "#" 
        },
        { 
            title: "Biología sintética: creación de vida", 
            descripcion: "Cómo los científicos están diseñando organismos con nuevas funciones...", 
            imagenUrl: "https://via.placeholder.com/400x250", 
            alt: "Imagen de artículo de biología", 
            idioma: "en", 
            dificultad: "Avanzado", 
            fecha: "2025-06-01", 
            url: "#" 
        },
        // Añade más artículos de Química aquí
    ];

    // --- Referencias a los elementos del DOM de la sección de Química ---
    // Asegúrate de que este formulario exista en la sección de Química
    const formularioBuscador = document.getElementById("formulario-buscador-quimica");
    const filtroTitulo = document.getElementById("filtro-titulo-quimica");
    const filtroDificultad = document.getElementById("filtro-dificultad-quimica");
    const filtroFecha = document.getElementById("filtro-fecha-quimica");
    
    // Contenedor de artículos de QUÍMICA
    const contenedorArticulosQuimica = document.querySelector("#quimica .contenedor-elementos");

    // --- Función para renderizar artículos de QUÍMICA ---
    const renderizarArticulosQuimica = (articulos) => {
        if (!contenedorArticulosQuimica) return;
        contenedorArticulosQuimica.innerHTML = '';
        if (articulos.length === 0) {
            contenedorArticulosQuimica.innerHTML = "<p>No se encontraron resultados.</p>";
            return;
        }

        articulos.forEach(articulo => {
            const articleCard = document.createElement("article");
            articleCard.classList.add("articulo-card");
            articleCard.innerHTML = `
                <img src="${articulo.imagenUrl}" alt="${articulo.alt}">
                <div class="articulo-contenido">
                    <h4>${articulo.title}</h4>
                    <p>${articulo.descripcion}</p>
                    <div class="meta-data">
                        <span class="idioma" aria-label="Idioma: ${articulo.idioma === 'es' ? 'Español' : 'Inglés'}">${articulo.idioma === 'es' ? '🇪🇸' : '🇬🇧'}</span>
                        <span class="dificultad ${articulo.dificultad.toLowerCase()}" aria-label="Nivel: ${articulo.dificultad}">${articulo.dificultad}</span>
                        <span class="fecha-publicacion" aria-label="Publicado el">${articulo.fecha}</span>
                    </div>
                    <a href="${articulo.url}" class="btn-leer-mas">Leer más</a>
                </div>
            `;
            contenedorArticulosQuimica.appendChild(articleCard);
        });
    };

    // --- La función que maneja la lógica del buscador de QUÍMICA ---
    const manejarBusquedaQuimica = (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const consultaTitulo = filtroTitulo.value.trim().toLowerCase();
        const consultaDificultad = filtroDificultad.value;
        const consultaFecha = filtroFecha.value;

        let articulosFiltrados = [...articulosQuimica];

        // 1. Filtrar por título
        if (consultaTitulo) {
            articulosFiltrados = articulosFiltrados.filter(articulo => 
                articulo.title.toLowerCase().includes(consultaTitulo)
            );
        }
        
        // 2. Filtrar por dificultad
        if (consultaDificultad !== "todos") {
            articulosFiltrados = articulosFiltrados.filter(articulo => 
                articulo.dificultad === consultaDificultad
            );
        }

        // 3. Ordenar por fecha
        if (consultaFecha === "recientes") {
            articulosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        } else if (consultaFecha === "antiguos") {
            articulosFiltrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        }
        
        // Renderizar los resultados en el contenedor de QUÍMICA
        renderizarArticulosQuimica(articulosFiltrados);
    };

    // --- Escuchador de eventos del buscador de QUÍMICA ---
    if (formularioBuscador) { // Se asegura de que el formulario exista antes de añadir el listener
        formularioBuscador.addEventListener("submit", manejarBusquedaQuimica);
    }
    
    // --- Renderizar los artículos de QUÍMICA al cargar la página ---
    renderizarArticulosQuimica(articulosQuimica);
});

//formulario//


        const formularioContainer = document.getElementById('formulario-container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => 
    {
        formularioContainer.classList.add('active');
    });

loginBtn.addEventListener('click', () => 
    {
        formularioContainer.classList.remove('active');
    });