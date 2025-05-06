
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?output=csv";

function loadData() {
  fetch(sheetUrl)
    .then(response => response.text())
    .then(csv => {
      const lines = csv.split("\n").slice(1);
      const animals = lines.map(l => l.split(",")).filter(x => x.length >= 7);
      const list = document.getElementById("animal-list");
      const searchInput = document.getElementById("search");

      function renderList(filter = "") {
        list.innerHTML = "";
        let total = 0;
        animals.forEach(([nome, especie, sexo, vacRaiva, vacVirus, castrado]) => {
          if (nome.toLowerCase().includes(filter.toLowerCase())) {
            total++;
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded shadow";
            card.innerHTML = `
              <h3 class="font-bold text-lg">${nome}</h3>
              <p>Espécie: ${especie}</p>
              <p>Sexo: ${sexo}</p>
              <p>Raiva: ${vacRaiva}</p>
              <p>Vírus: ${vacVirus}</p>
              <p>Castrado: ${castrado}</p>
            `;
            list.appendChild(card);
          }
        });
        document.getElementById("total-animals").innerText = total;
      }

      searchInput.addEventListener("input", e => renderList(e.target.value));
      renderList();

      // Gráficos
      const castrados = animals.filter(x => x[5].toLowerCase() === "sim").length;
      const naoCastrados = animals.length - castrados;

      new Chart(document.getElementById("castrationChart"), {
        type: "bar",
        data: {
          labels: ["Castrados", "Não Castrados"],
          datasets: [{
            label: "Quantidade",
            data: [castrados, naoCastrados],
            backgroundColor: ["#064e3b", "#b91c1c"]
          }]
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { enabled: true } }
        }
      });

      const raivaSim = animals.filter(x => x[3].toLowerCase() === "sim").length;
      const virusSim = animals.filter(x => x[4].toLowerCase() === "sim").length;

      new Chart(document.getElementById("vaccinationChart"), {
        type: "bar",
        data: {
          labels: ["Raiva", "Vírus"],
          datasets: [{
            label: "Vacinados",
            data: [raivaSim, virusSim],
            backgroundColor: ["#78350f", "#4b5563"]
          }]
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { enabled: true } }
        }
      });
    });
}

window.onload = loadData;
