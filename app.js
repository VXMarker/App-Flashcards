// Clave para guardar en localStorage
const STORAGE_KEY = "flashcards";

// Obtener tarjetas guardadas
function getCards() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Guardar tarjetas
function saveCards(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// Escapar HTML para evitar inyección de código
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Renderizar todas las tarjetas
function renderCards(filter = "") {
  const container = document.getElementById("cards-container");
  const emptyMessage = document.getElementById("empty-message");
  const cards = getCards();

  const filtered = cards.filter(
    (card) =>
      card.question.toLowerCase().includes(filter.toLowerCase()) ||
      card.answer.toLowerCase().includes(filter.toLowerCase()),
  );

  container.innerHTML = "";
  emptyMessage.classList.toggle("hidden", filtered.length > 0);

  filtered.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "flashcard";

    cardEl.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-face flashcard-front">
          <span class="flashcard-label">Pregunta</span>
          <p class="flashcard-text">${escapeHTML(card.question)}</p>
        </div>
        <div class="flashcard-face flashcard-back">
          <span class="flashcard-label">Respuesta</span>
          <p class="flashcard-text">${escapeHTML(card.answer)}</p>
          <button class="delete-btn" data-id="${card.id}">🗑️</button>
        </div>
      </div>
    `;

    // Click en la tarjeta → mostrar respuesta (flip)
    cardEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      cardEl.classList.toggle("flipped");
    });

    // Botón eliminar
    cardEl.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCard(card.id);
    });

    container.appendChild(cardEl);
  });
}

// Agregar tarjeta
document.getElementById("card-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("answer").value.trim();
  if (!question || !answer) return;

  const cards = getCards();
  cards.push({
    id: Date.now(), // ID único simple
    question,
    answer,
  });

  saveCards(cards);
  renderCards();

  // Limpiar formulario
  e.target.reset();
  document.getElementById("question").focus();
});

// Eliminar tarjeta
function deleteCard(id) {
  const cards = getCards().filter((card) => card.id !== id);
  saveCards(cards);
  renderCards(document.getElementById("search").value);
}

// Buscador
document.getElementById("search").addEventListener("input", (e) => {
  renderCards(e.target.value);
});

// Render inicial
renderCards();
