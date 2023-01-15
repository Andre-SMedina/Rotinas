let banco = JSON.parse(localStorage.getItem("banco"));
const btnSalvar = document.querySelector("#btnSalvar");
const atividadesLista = document.querySelector("#atividadesLista");
const iniciado = document.querySelector("#iniciado");
const registroDia = document.querySelector("#registroDia");
const historicoDiv = document.querySelector("#historicoDiv");
const total = document.querySelector("#total");

async function bancoCreate() {
  await localStorage.setItem(
    "banco",
    JSON.stringify({
      atividades: [],
      ativo: "",
      registro: {},
    })
  );
  banco = JSON.parse(localStorage.getItem("banco"));
}

if (!banco) {
  bancoCreate();
}

function pegarData() {
  const time = new Date();
  const dias = ("0" + time.getDate()).slice(-2);
  const mes = ("0" + (time.getMonth() + 1)).slice(-2);
  const ano = time.getFullYear();
  const dataAtual = `${dias}/${mes}/${ano}`;
  const horaAtual = `${("0" + time.getHours()).slice(-2)}:${(
    "0" + time.getMinutes()
  ).slice(-2)}`;

  return [dataAtual, horaAtual];
}

function somarTempo(registro, data) {
  let totMin = 0;

  for (const e of registro) {
    if (e.data == data) {
      for (const i of e.registros) {
        if (i.fim) {
          totMin +=
            parseInt(i.total.split(":")[0]) * 60 +
            parseInt(i.total.split(":")[1]);
        }
      }
    }
  }

  const horaTotal = parseInt(totMin / 60);
  const minTotal = totMin - horaTotal * 60;
  return `Total: ${("0" + horaTotal).slice(-2)}:${("0" + minTotal).slice(-2)}`;
}

function historico(registro) {
  historicoDiv.innerHTML = "";
  const [dataAtual] = pegarData();
  registro.map((e) => {
    if (e.data != dataAtual) {
      console.log("ok");
    }
    const p = document.createElement("p");
  });
}

//adiciona um registro na lista dos iniciados do dia atual
function registro(reg, data) {
  const soma = somarTempo(reg, data);
  registroDia.innerHTML = "";
  reg.map((e) => {
    if (e.data == data) {
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

  total.innerText = soma;
}

//executa ação ao clicar em uma atividade
function controle(id) {
  if (banco.ativo != id && banco.ativo) {
    const [dataAtual, horaAtual] = pegarData();

    iniciado.innerText = `${id} iniciado ${horaAtual}`;

    const registroAnterior = banco.registro[banco.ativo];
    const registroAtual = banco.registro[id];

    registroAnterior.map((e) => {
      if (e.data == dataAtual) {
        e.registros.map((f) => {
          if (!f.fim) {
            const dataCalcIni = `${dataAtual.split("/").reverse().join("-")}T${
              f.inicio
            }:00`;
            const dataCalcFim = `${dataAtual
              .split("/")
              .reverse()
              .join("-")}T${horaAtual}:00`;
            const totMin =
              (new Date(dataCalcFim) - new Date(dataCalcIni)) / 60000;

            if (totMin > 1440) {
              // mensagem para o usuário
              console.log("excedeu");
            } else {
              const horaTotal = parseInt(totMin / 60);
              const minTotal = totMin - horaTotal * 60;

              const totalFinal = `${("0" + horaTotal).slice(-2)}:${(
                "0" + minTotal
              ).slice(-2)}`;

              f.fim = horaAtual;
              f.total = totalFinal;
            }
          }
        });
      }
    });

    registro(registroAtual, dataAtual);

    registroAtual.map((e) => {
      if (e.data == dataAtual) {
        e.registros.push({ inicio: horaAtual, fim: "", total: "" });
      }
    });

    if (registroAtual.length == 0) {
      registroAtual.push({
        data: dataAtual,
        registros: [{ inicio: horaAtual, fim: "", total: "" }],
        total: "",
      });
    }

    console.log(registroAtual[0].registros);

    // historico(registroAtual);
  } else if (!banco.ativo) {
    const [dataAtual, horaAtual] = pegarData();
    iniciado.innerText = `${id} iniciado ${horaAtual}`;

    banco.registro[id].push({
      data: dataAtual,
      registros: [{ inicio: horaAtual, fim: "", total: "" }],
      total: "",
    });
  }
}

//adiciona as atividades na lista
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
}

//carrega as atividades cadastradas, no painel
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
    .value.toLowerCase();
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
