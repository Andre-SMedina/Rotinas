let banco = JSON.parse(localStorage.getItem("banco"));
const btnSalvar = document.querySelector("#btnSalvar");
const atividadesLista = document.querySelector("#atividadesLista");
const iniciado = document.querySelector("#iniciado");
const registroDia = document.querySelector("#registroDia");
const historicoDiv = document.querySelector("#historicoDiv");
const historicoLista = document.querySelector("#historicoLista");
const total = document.querySelector("#total");

async function bancoCreate() {
  await localStorage.setItem(
    "banco",
    JSON.stringify({
      atividades: ["ocioso"],
      ativo: "",
      registro: { ocioso: [] },
    })
  );
  banco = JSON.parse(localStorage.getItem("banco"));
}

if (!banco) {
  bancoCreate();
}

function removeClass(classe) {
  const remove = document.querySelector(`.${classe}`);
  if (remove) {
    remove.classList.remove(classe);
  }
}

function pegarData() {
  const time = new Date();
  const dias = ("0" + time.getDate()).slice(-2);
  const mes = ("0" + (time.getMonth() + 1)).slice(-2);
  const ano = time.getFullYear();
  const dataAtual = `${dias}/${mes}/${ano}`;
  // const dataAtual = "04/01/2023";
  const horaAtual = `${("0" + time.getHours()).slice(-2)}:${(
    "0" + time.getMinutes()
  ).slice(-2)}`;
  // const horaAtual = "06:10";

  return [dataAtual, horaAtual];
}

//somar o tempo total do dia
function somarTempo(registro) {
  let totMin = 0;

  for (const i of registro.registros) {
    if (i.fim) {
      totMin +=
        parseInt(i.total.split(":")[0]) * 60 + parseInt(i.total.split(":")[1]);
    }
  }

  const horaTotal = parseInt(totMin / 60);
  const minTotal = totMin - horaTotal * 60;
  const total = `Total: ${("0" + horaTotal).slice(-2)}:${("0" + minTotal).slice(
    -2
  )}`;

  registro.total = total;

  return total;
}

//adiciona um registro na lista de registros do dia atual
function registro(reg, data) {
  registroDia.innerHTML = "";

  reg.map((e) => {
    if (e.data == data || e.aberto) {
      total.innerText = somarTempo(e);
      for (const i of e.registros) {
        if (!i.fim) {
          iniciado.innerText = `${banco.ativo} iniciado ${i.inicio}`;
        } else {
          const p = document.createElement("p");
          p.innerHTML = `<span>Início:</span> ${i.inicio} <span>Fim:</span> ${i.fim} <span>Total:</span> ${i.total}`;
          registroDia.appendChild(p);
          registroDia.appendChild(document.createElement("hr"));
        }
      }
    }
  });
}

function tempoFinal(registro, data, hora) {
  registro.map((e) => {
    if (e.data == data || e.aberto == true) {
      e.aberto = false;
      e.registros.map((f) => {
        if (!f.fim) {
          const dataCalcIni = `${e.data.split("/").reverse().join("-")}T${
            f.inicio
          }:00`;
          const dataCalcFim = `${data
            .split("/")
            .reverse()
            .join("-")}T${hora}:00`;
          const totMin =
            (new Date(dataCalcFim) - new Date(dataCalcIni)) / 60000;

          if (totMin > 1440) {
            // mensagem para o usuário
            f.fim = "Max24h";
            f.total = "00:00";
          } else {
            const horaTotal = parseInt(totMin / 60);
            const minTotal = totMin - horaTotal * 60;

            const totalFinal = `${("0" + horaTotal).slice(-2)}:${(
              "0" + minTotal
            ).slice(-2)}`;

            f.fim = hora;
            f.total = totalFinal;
          }
        }
      });
      somarTempo(e);
    }
  });
}

//executa ação ao clicar em uma atividade
function controle(id) {
  const [dataAtual, horaAtual] = pegarData();

  if (banco.ativo != id && banco.ativo) {
    removeClass("ativoHist");

    historicoLista.innerHTML = "";

    iniciado.innerText = `${id} iniciado ${horaAtual}`;

    const registroAnterior = banco.registro[banco.ativo];
    const registroAtual = banco.registro[id];
    let find = false;

    tempoFinal(registroAnterior, dataAtual, horaAtual);
    registro(registroAtual, dataAtual);

    //Se já teve registro antes, adiciona mais um
    registroAtual.map((e) => {
      if (e.data == dataAtual) {
        e.registros.push({ inicio: horaAtual, fim: "", total: "" });
        find = true;
        e.aberto = true;
      }
    });

    //se nunca houve registro, adiciona toda a estrutura
    if (!find) {
      registroAtual.push({
        data: dataAtual,
        registros: [{ inicio: horaAtual, fim: "", total: "" }],
        total: "",
        aberto: true,
      });
    }
  } else if (!banco.ativo) {
    iniciado.innerText = `${id} iniciado ${horaAtual}`;

    banco.registro[id].push({
      data: dataAtual,
      registros: [{ inicio: horaAtual, fim: "", total: "" }],
      total: "",
      aberto: true,
    });
  }
}

//adiciona as atividades e cria os elementos
function addLista(id) {
  const h3 = document.createElement("h3");
  h3.innerText = id;
  h3.classList.add("itens");
  h3.setAttribute("id", id);
  atividadesLista.appendChild(h3);
  h3.addEventListener("click", async () => {
    if (!banco.ativo) {
      h3.classList.add("ativo");
      controle(id);
      banco.ativo = id;
    } else {
      document.querySelector(`#${banco.ativo}`).classList.remove("ativo");
      h3.classList.add("ativo");
      controle(id);
      banco.ativo = id;
    }
    await localStorage.setItem("banco", JSON.stringify(banco));
  });

  const label = document.createElement("label");
  label.classList.add("itensHist");
  label.innerText = id;
  label.addEventListener("click", () => {
    historicoLista.innerHTML = "";
    removeClass("ativoHist");

    label.classList.add("ativoHist");
    const p1 = document.createElement("p");
    historicoLista.appendChild(p1);
    for (const i of banco.registro[id]) {
      const p2 = document.createElement("p");
      p2.classList.add("registros");
      p2.innerText = `${i.data} - ${i.total}`;
      p2.addEventListener("click", () => {
        historicoLista.innerHTML = "";
        for (const g of i.registros) {
          const p3 = document.createElement("p");
          p3.innerText = `Início: ${g.inicio} - Fim: ${g.fim} - Total: ${g.total}`;
          historicoLista.appendChild(p3);
        }
      });
      historicoLista.appendChild(p2);
    }
  });
  historicoDiv.appendChild(label);
}

//carrega as atividades cadastradas no painel ao iniciar o sistema
setTimeout(() => {
  if (banco.atividades.length > 0) {
    banco.atividades.map((e) => {
      addLista(e);
    });
  }
  if (banco.ativo) {
    const [dataAtual] = pegarData();
    const reg = banco.registro[banco.ativo];
    document.querySelector(`#${banco.ativo}`).classList.add("ativo");
    registro(reg, dataAtual);
  }
}, 300);

//adiciona ou remove atividades quando clica no botão salvar
btnSalvar.addEventListener("click", async () => {
  const inputAtividades = document
    .querySelector("#inputAtividades")
    .value.toLowerCase()
    .trim();
  const consulta = banco.atividades.find((e) => e == inputAtividades);

  if (inputAtividades) {
    if (consulta) {
      banco.atividades = banco.atividades.filter(
        (item) => item != inputAtividades
      );
      const remove = document.querySelector(`#${inputAtividades}`);
      atividadesLista.removeChild(remove);
      document.querySelector("#inputAtividades").value = "";
      if (banco.ativo == inputAtividades) {
        banco.ativo = "";
      }
    } else {
      banco.atividades.push(inputAtividades);
      if (!banco.registro[inputAtividades]) {
        banco.registro[inputAtividades] = [];
      }
      addLista(inputAtividades);
      document.querySelector("#inputAtividades").value = "";
    }
    await localStorage.setItem("banco", JSON.stringify(banco));
  }
});
