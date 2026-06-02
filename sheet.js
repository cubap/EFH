const sheetRefs = {
  title: document.getElementById("sheetTitle"),
  sheet: document.getElementById("sheet"),
  printBtn: document.getElementById("printBtn"),
  toViewerBtn: document.getElementById("toViewerBtn"),
  toMacrosBtn: document.getElementById("toMacrosBtn"),
  toBuilderBtn: document.getElementById("toBuilderBtn")
}

init()

function init() {
  const saved = SD.loadSavedBuilds()
  const queryId = SD.getParam("id")
  const character = queryId ? SD.getCharacterById(saved, queryId) : SD.getCurrentCharacter(saved)

  if (!character) {
    sheetRefs.title.textContent = "Printable Character Sheet"
    sheetRefs.sheet.innerHTML = "<p>No character selected.</p>"
    return
  }

  SD.setCurrentCharacterId(character.id)
  const cls = SD.getClassById(character.classId)
  sheetRefs.title.textContent = `${character.name} - ${cls?.name ?? character.classId}`
  sheetRefs.sheet.innerHTML = SD.renderCharacterSummary(character)

  sheetRefs.printBtn.addEventListener("click", () => window.print())
  sheetRefs.toViewerBtn.addEventListener("click", () => {
    window.location.href = `characters.html?id=${encodeURIComponent(character.id)}`
  })
  sheetRefs.toMacrosBtn.addEventListener("click", () => {
    window.location.href = `macros.html?id=${encodeURIComponent(character.id)}`
  })
  sheetRefs.toBuilderBtn.addEventListener("click", () => {
    window.location.href = `index.html?load=${encodeURIComponent(character.id)}`
  })
}
