const viewerRefs = {
  list: document.getElementById("characterList"),
  summary: document.getElementById("characterSummary"),
  toBuilder: document.getElementById("toBuilderBtn"),
  toMacros: document.getElementById("toMacrosBtn"),
  toSheet: document.getElementById("toSheetBtn")
}

let saved = SD.loadSavedBuilds()
let current = null

init()

function init() {
  const idFromQuery = SD.getParam("id")
  current = idFromQuery ? SD.getCharacterById(saved, idFromQuery) : SD.getCurrentCharacter(saved)
  if (current?.id) SD.setCurrentCharacterId(current.id)

  renderList()
  renderSummary()
  bindEvents()
}

function bindEvents() {
  viewerRefs.toBuilder.addEventListener("click", () => {
    if (current?.id) {
      window.location.href = `index.html?load=${encodeURIComponent(current.id)}`
      return
    }
    window.location.href = "index.html"
  })

  viewerRefs.toMacros.addEventListener("click", () => {
    if (current?.id) {
      window.location.href = `macros.html?id=${encodeURIComponent(current.id)}`
      return
    }
    window.location.href = "macros.html"
  })

  viewerRefs.toSheet.addEventListener("click", () => {
    if (current?.id) {
      window.location.href = `sheet.html?id=${encodeURIComponent(current.id)}`
      return
    }
    window.location.href = "sheet.html"
  })
}

function renderList() {
  if (!saved.length) {
    viewerRefs.list.innerHTML = "<p>No saved characters yet. Build one first.</p>"
    return
  }

  viewerRefs.list.innerHTML = saved
    .map(item => {
      const cls = SD.getClassById(item.classId)
      const active = item.id === current?.id ? "true" : "false"
      return `
        <article class="saved-item" data-active="${active}">
          <div class="saved-item__meta">
            <strong>${SD.escapeHtml(item.name)}</strong><br>
            ${SD.escapeHtml(cls?.name ?? item.classId)} - Level ${item.level} - HP ${item.hp}/${item.maxHp}
          </div>
          <div class="saved-item__actions">
            <button class="btn btn--paper" type="button" data-load="${item.id}">View</button>
            <button class="btn btn--ink" type="button" data-delete="${item.id}">Delete</button>
          </div>
        </article>
      `
    })
    .join("")

  viewerRefs.list.querySelectorAll("button[data-load]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-load")
      current = SD.getCharacterById(saved, id)
      if (current?.id) SD.setCurrentCharacterId(current.id)
      renderList()
      renderSummary()
    })
  })

  viewerRefs.list.querySelectorAll("button[data-delete]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-delete")
      saved = SD.deleteBuild(saved, id)
      current = SD.getCurrentCharacter(saved)
      renderList()
      renderSummary()
    })
  })
}

function renderSummary() {
  if (!current) {
    viewerRefs.summary.innerHTML = "<p>Select or create a character to view details.</p>"
    return
  }
  viewerRefs.summary.innerHTML = SD.renderCharacterSummary(current)
}
