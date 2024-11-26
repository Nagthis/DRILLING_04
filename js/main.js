const apiUrl = "https://swapi.dev/api/people/";
const containers = document.querySelectorAll(".div1, .div2, .div3");
const colors = ["c-red", "c-green", "c-blue"];

async function fetchPeople(limit) {
  let offset = 0;
  let allResults = [];

  try {
    while (allResults.length < limit) {
      const URL = `${apiUrl}?format=json&limit=${limit}&offset=${offset}`;
      const response = await fetch(URL);
      if (!response.ok) throw "Error en la llamada";
      const data = await response.json();
      allResults = allResults.concat(data.results);
      offset += data.results.length;
    }
  } catch (error) {
    console.log(error);
  }

  return allResults.slice(0, limit);
}

function* generateCards(characters, color, container) {
  for (const character of characters) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const characterWeight = parseInt(character.mass);
    const characterHeight = parseInt(character.height);
    const characterName = character.name;

    const cardHTML = `
      <div class="card">
        <div class="card__left">
          <div class="card__left__circle ${color}"></div>
        </div>
        <div class="card__content">
          <h5 class="card__title">${characterName}</h5>
          <p class="card__text">Estatura: ${characterHeight} cm. Peso: ${characterWeight} kg.</p>
        </div>
      </div>
    `;
    cardElement.innerHTML = cardHTML;
    container.appendChild(cardElement);

    yield; // Pausa la ejecución del generador para el siguiente card
  }
}

async function fetchAndCreateCards() {
  try {
    const limit = 15;
    const data = await fetchPeople(limit);
    for (let i = 0; i < containers.length; i++) {
      const characters = data.slice(i * 5, (i + 1) * 5);
      const color = colors[i];
      const container = containers[i];
      const generator = generateCards(characters, color, container);

      // Agrega un evento de mouseover al contenedor para generar las cards
      container.addEventListener("mouseover", () => {
        generator.next();
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

fetchAndCreateCards();
