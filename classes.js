const refs = {
  stage: document.getElementById("classStage"),
  index: document.getElementById("classIndex"),
  prevBtn: document.getElementById("prevClassBtn"),
  nextBtn: document.getElementById("nextClassBtn"),
  toBuilderBtn: document.getElementById("toBuilderFromClassBtn")
}

let currentIndex = 0

init()

function init() {
  const classParam = SD.getParam("class")
  if (classParam) {
    const idx = CLASS_DATA.findIndex(cls => cls.id === classParam)
    if (idx >= 0) currentIndex = idx
  }

  refs.prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + CLASS_DATA.length) % CLASS_DATA.length
    render()
  })

  refs.nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % CLASS_DATA.length
    render()
  })

  refs.toBuilderBtn.addEventListener("click", () => {
    const cls = CLASS_DATA[currentIndex]
    window.location.href = `index.html?class=${encodeURIComponent(cls.id)}`
  })

  render()
}

function render() {
  const cls = CLASS_DATA[currentIndex]
  refs.index.textContent = `${currentIndex + 1} / ${CLASS_DATA.length}`

  const talents = cls.talents
    .map(t => `<tr><td>${SD.escapeHtml(t.roll)}</td><td>${SD.escapeHtml(t.effect)}</td></tr>`)
    .join("")

  const features = cls.features
    .map(item => `<li><strong>${SD.escapeHtml(item.title)}:</strong> ${SD.escapeHtml(item.text)}</li>`)
    .join("")

  refs.stage.innerHTML = `
    <article class="class-card class-card--hero">
      <img src="${SD.escapeHtml(cls.image)}" alt="${SD.escapeHtml(cls.name)} reference art">
      <div class="class-card__body">
        <h3>${SD.escapeHtml(cls.name)}</h3>
        <p>${SD.escapeHtml(cls.summary)}</p>
        <p><strong>Weapons:</strong> ${SD.escapeHtml(cls.weapons)}</p>
        <p><strong>Armor:</strong> ${SD.escapeHtml(cls.armor)}</p>
        <p><strong>Hit Points:</strong> ${SD.escapeHtml(cls.hitPoints)}</p>
        ${cls.alignment ? `<p><strong>Alignment:</strong> ${SD.escapeHtml(cls.alignment)}</p>` : ""}
        <h4>Features</h4>
        <ul>${features}</ul>
        <h4>Talents (2d6)</h4>
        <table>
          <thead><tr><th>Roll</th><th>Effect</th></tr></thead>
          <tbody>${talents}</tbody>
        </table>
      </div>
    </article>
  `
}
