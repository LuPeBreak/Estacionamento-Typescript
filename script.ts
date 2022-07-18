const $ = (query: string): HTMLInputElement =>
  document.querySelector(query) as HTMLInputElement;

interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

function calcTempo(milisegundos: number) {
  const min = Math.floor(milisegundos / 60000);
  const sec = Math.floor((milisegundos % 60000) / 1000);

  return `${min}m e ${sec}s`;
}

class Patio {
  static veiculos: Veiculo[] = [];
  static ler(): Veiculo[] {
    return localStorage.patio ? JSON.parse(localStorage.patio) : [];
  }
  static salvar(veiculos: Veiculo[]) {
    localStorage.setItem("patio", JSON.stringify(veiculos));
  }
  static adicionaNaTabela(veiculo: Veiculo) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      <td>
        <button onClick=Patio.remover("${veiculo.placa}") class="delete">X</button>
      </td>
    `;

    $("#patio").appendChild(row);
  }

  static adicionar(veiculo: Veiculo) {
    this.adicionaNaTabela(veiculo);
    this.salvar([...this.ler(), veiculo]);
  }

  static remover(placa: string) {
    const veiculos = this.ler();
    const { nome, entrada } = veiculos.find((veiculo) => {
      return veiculo.placa === placa;
    }) as Veiculo;

    const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
    if (!confirm(`O Veiculo ${nome} permaneceu por ${tempo}. Deseja Encerrar?`))
      return;

    const novosVeiculos = veiculos.filter((veiculo) => veiculo.placa !== placa);
    this.salvar(novosVeiculos);
    this.renderizar();
  }
  static renderizar() {
    const tbody = $("#patio");
    tbody.innerHTML = "";
    const veiculos = this.ler();
    if (veiculos.length) {
      veiculos.forEach((veiculo) => {
        this.adicionaNaTabela(veiculo);
      });
    }
  }
}

Patio.renderizar();

$("#cadastrar").addEventListener("click", () => {
  const nome = $("#nome").value;
  const placa = $("#placa").value;
  if (!nome || !placa) {
    alert("Os campos nome e placa sao obrigatorios");
    return;
  }
  const entrada = new Date().toISOString();
  Patio.adicionar({ nome, placa, entrada });

  console.log(Patio.ler());
});
