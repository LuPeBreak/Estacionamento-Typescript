"use strict";
const $ = (query) => document.querySelector(query);
function calcTempo(milisegundos) {
    const min = Math.floor(milisegundos / 60000);
    const sec = Math.floor((milisegundos % 60000) / 1000);
    return `${min}m e ${sec}s`;
}
class Patio {
    static ler() {
        return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }
    static salvar(veiculos) {
        localStorage.setItem("patio", JSON.stringify(veiculos));
    }
    static adicionaNaTabela(veiculo) {
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
    static adicionar(veiculo) {
        this.adicionaNaTabela(veiculo);
        this.salvar([...this.ler(), veiculo]);
    }
    static remover(placa) {
        const veiculos = this.ler();
        const { nome, entrada } = veiculos.find((veiculo) => {
            return veiculo.placa === placa;
        });
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
Patio.veiculos = [];
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
