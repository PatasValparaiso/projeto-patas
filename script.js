const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?output=csv";

async function fetchData() {
  const response = await fetch(CSV_URL);
  const data = await response.text();
  const rows = data.split("\n").slice(1);
  return rows.map(row => {
    const cols = row.split(",");
    return {
      nome: cols[0],
      especie: cols[1],
      idade: cols[2],
      sexo: cols[3],
      raca: cols[4],
      chip: cols[5],
      vacRaiva: cols[6],
      vacVirus: cols[7],
      castrado: cols[8],
      responsavel: cols[9],
      endereco: cols[10],
      telefone: cols[11],
    };
  });
}

function renderList(animals) {
  const list = document.getElementById("animal-list");
  list.innerHTML = "";
  animals.forEach(a => {
    const item = document.createElement("div");
    item.className = "animal";
    item.innerHTML = `
      <strong>NOME:</strong> ${a.nome}<br/>
      <strong>ESPÉCIE:</strong> ${a.especie}<br/>
      <strong>IDADE:</strong> ${a.idade}<br/>
      <strong>SEXO:</strong> ${a.sexo}<br/>
      <strong>RAÇA:</strong> ${a.raca}<br/>
      <strong>CHIP Nr:</strong> ${a.chip}<br/>
      <strong>VALID. VAC. RAIVA:</strong> ${a.vacRaiva}<br/>
      <strong>VALID. VAC. VÍRUS:</strong> ${a.vacVirus}<br/>
      <strong>CASTRADO:</strong> ${a.castrado}<br/>
      <strong>RESPONSÁVEL:</strong> ${a.responsavel}<br/>
      <strong>ENDEREÇO:</strong> ${a.endereco}<br/>
      <strong>TELEFONE:</strong> ${a.telefone}
    `;
    list.appendChild(item);
  });
}

function updateCharts(animals) {
  document.getElementById("total-animals").textContent = `Animais: ${animals.length}`;

  const castrados = animals.filter(a => a.castrado.trim().toLowerCase() === "sim").length;
  const naoCastrados = animals.length - castrados;

  new Chart(document.getElementById("chart-castration"), {
    type: "bar",
    data: {
      labels: ["Castrados", "Não Castrados"],
      datasets: [{
        data: [castrados, naoCastrados],
        backgroundColor: ["#FFD700", "#333333"],
      }]
    }
  });

  const vacRaiva = animals.filter(a => /\d{2}\/\d{2}\/\d{4}/.test(a.vacRaiva)).length;
  const vacVirus = animals.filter(a => /\d{2}\/\d{2}\/\d{4}/.test(a.vacVirus)).length;

  new Chart(document.getElementById("chart-vaccines"), {
    type: "bar",
    data: {
      labels: ["Raiva", "Vírus"],
      datasets: [{
        data: [vacRaiva, vacVirus],
        backgroundColor: ["#FFD700", "#333333"],
      }]
    }
  });
}

function setupSearch(animals) {
  const input = document.getElementById("search");
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    const filtered = animals.filter(a => a.nome.toLowerCase().includes(query));
    renderList(filtered);
  });
}

fetchData().then(animals => {
  renderList(animals);
  updateCharts(animals);
  setupSearch(animals);
});
