document.addEventListener('DOMContentLoaded', () => {
    const filtroSelector = document.getElementById('filtros');
    const areaCards      = document.getElementById('contenedor-propiedades');
  
    // Extraer tarjetas estáticas
    const tarjetasDOM = document.querySelectorAll('#contenedor-propiedades .col-md-4 .card');
    const staticProps = Array.from(tarjetasDOM).map(tarjeta => {
      const body = tarjeta.querySelector('.card-body');
      const direccion = body.querySelector('i.fa-map-marker-alt').closest('p').innerText.trim();
      const habBañosTxt = body.querySelector('i.fa-bed').closest('p').innerText;
      const nums = habBañosTxt.match(/\d+/g) || [0,0];
      const precioTxt = body.querySelector('i.fa-dollar-sign').closest('p').innerText;
  
      return {
        id:             tarjeta.id,
        src:            tarjeta.querySelector('img')?.src || '',
        titulo:         body.querySelector('.card-title')?.innerText || '',
        descripcion:    body.querySelector('.card-text')?.innerText || '',
        ubicacion:      direccion,
        habitaciones:   parseInt(nums[0], 10),
        baños:          parseInt(nums[1], 10),
        precio:         parseInt(precioTxt.replace(/[^\d]/g, ''), 10),
        permiteFumar:   !!body.querySelector('i.fas.fa-smoking'),
        permiteMascotas:!!body.querySelector('i.fa-paw')
      };
    });
  
    // genración de nuevas propiedades
    
    function getRandomInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
    function getRandomItem(arr){    return arr[getRandomInt(0, arr.length - 1)]; }
  
    const titulos       = ['Apartamento céntrico','Loft moderno','Casa con jardín','Estudio minimalista','Penthouse panorámico','Chalet de montaña'];
    const descripciones = ['Con acabados de lujo y vista al río.','Recientemente remodelado con estilo industrial.','Ideal para familias, amplio y luminoso.','Espacio funcional para un estilo de vida urbano.','Terraza privada con vista a la ciudad.','Decorado en madera a la montaña.'];
    const ubicaciones   = ['Av. Siempre Viva 123','Calle del Sol 45','Paseo Central 9','Camino Real 77','Ronda Norte 12','Boulevard Sur 56'];
    const imagenes      = ['./assets/img/Casa-1.jpg','./assets/img/Casa-2.jpg','./assets/img/Casa-3.jpg','./assets/img/Casa-4.jpg','./assets/img/Casa-5.jpg','./assets/img/Casa-6.jpg'];
  
    function generarRandom(n, startIndex){
      const arr = [];
      for(let i = 0; i < n; i++){
        arr.push({
          id:             `propiedad-r${startIndex + i}`,
          src:            getRandomItem(imagenes),
          titulo:         getRandomItem(titulos),
          descripcion:    getRandomItem(descripciones),
          ubicacion:      getRandomItem(ubicaciones),
          habitaciones:   getRandomInt(1, 5),
          baños:          getRandomInt(1, 3),
          precio:         getRandomInt(800, 10000),
          permiteFumar:   Math.random() < 0.5,
          permiteMascotas:Math.random() < 0.5
        });
      }
      return arr;
    }
    const randomProps = generarRandom(6, staticProps.length + 1);
  
    // Agregar tarjetas exostentes + aleatorias
    const todoProps = [...staticProps, ...randomProps];
  
    
    // Función que construye el HTML de cada tarjeta
    
    function crearCard(p) {
      const fumarHTML = p.permiteFumar
        ? `<p class="text-success"><i class="fas fa-smoking"></i> Permitido fumar</p>`
        : `<p class="text-danger"><i class="fas fa-smoking-ban"></i> No se permite fumar</p>`;
      const petsHTML = p.permiteMascotas
        ? `<p class="text-success"><i class="fas fa-paw"></i> Mascotas permitidas</p>`
        : `<p class="text-danger"><i class="fa-solid fa-ban"></i> No se permiten mascotas</p>`;
  
      return `
        <div id="${p.id}" class="card mb-4">
          ${p.src ? `<img src="${p.src}" class="card-img-top" alt="${p.titulo}">` : ''}
          <div class="card-body">
            ${p.titulo      ? `<h5 class="card-title">${p.titulo}</h5>` : ''}
            ${p.descripcion ? `<p class="card-text">${p.descripcion}</p>` : ''}
            ${p.ubicacion   ? `<p><i class="fas fa-map-marker-alt"></i> ${p.ubicacion}</p>` : ''}
            <p>
              ${p.habitaciones!=null ? `<i class="fas fa-bed"></i> ${p.habitaciones} Hab.` : ''}
              ${p.baños         !=null ? `| <i class="fas fa-bath"></i> ${p.baños} Baños` : ''}
            </p>
            ${p.precio!=null ? `<p><i class="fas fa-dollar-sign"></i> ${p.precio.toLocaleString()}</p>` : ''}
            ${fumarHTML}
            ${petsHTML}
          </div>
        </div>
      `;
    }
  
    
    // Array de propiedades en pantalla
    
    function dibujarCards(arr) {
      areaCards.innerHTML = '';
      arr.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = crearCard(p);
        areaCards.appendChild(col);
      });
    }
  
    // Render inicial con todas las propiedades
    dibujarCards(todoProps);
  
    
    // Filtrado: re-dibuja según la opción elegida
    
    filtroSelector.addEventListener('change', () => {
      const val = filtroSelector.value;
      let filtradas;
  
      switch (val) {
        case 'precio_menor_2500':
          filtradas = todoProps.filter(x => x.precio < 2500);
          break;
        case 'precio_mayor_2500':
          filtradas = todoProps.filter(x => x.precio > 2500);
          break;
        case 'permite_fumar':
          filtradas = todoProps.filter(x => x.permiteFumar);
          break;
        case 'permite_mascotas':
          filtradas = todoProps.filter(x => x.permiteMascotas);
          break;
        case 'sin_filtros':
          filtradas = todoProps;
          break;
        default:
          filtradas = todoProps;
      }
      dibujarCards(filtradas);
    });
  });
  