let banco = JSON.parse(localStorage.getItem("banco"));
const btnSalvar = document.querySelector("#btnSalvar");
const atividadesLista = document.querySelector("#atividadesLista");
const iniciado = document.querySelector("#iniciado");
const hora = document.querySelector("#hora");
const dia = document.querySelector("#dia");
const total = document.querySelector("#total");

async function bancoCreate() {
  await localStorage.setItem(
    "banco",
    JSON.stringify({
      atividades: ["nadar", "correr"],
      ativo: "nadar",
      historico: {
        nadar: [
          { data: "12/01/2023", inicio: "07:30", fim: "", total: "00:00" },
        ],
        // nadar: [],
        correr: [],
      },
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

function controle(id) {
  if (banco.ativo != id && banco.ativo) {
    const [dataAtual, horaAtual] = pegarData();

    iniciado.innerText = `${id} iniciado`;
    dia.innerText = `Dia: ${dataAtual}`;
    hora.innerText = `Hora: ${horaAtual}`;

    const historicoAnterior = banco.historico[banco.ativo];
    const historicoAtual = banco.historico[id];

    historicoAnterior.map((e) => {
      if (!e.fim && dataAtual == e.data) {
        const dataCalcIni = `${e.data.split("/").reverse().join("-")}T${
          e.inicio
        }:00`;
        const dataCalcFim = `${dataAtual
          .split("/")
          .reverse()
          .join("-")}T${horaAtual}:00`;
        const totMin = (new Date(dataCalcFim) - new Date(dataCalcIni)) / 60000;

        if (totMin > 1440) {
          // mensagem para o usuário
          console.log("excedeu");
        } else {
          const horas = parseInt(totMin / 60);
          const minutos = totMin - horas * 60;
          const totalAnterior = e.total.split("/");
          const totalAtual = `${("0" + horas).slice(-2)}:${(
            "0" + minutos
          ).slice(-2)}`.split("/");

          const totalFinal = 0;

          e.fim = horaAtual;
          // e.total = `${("0" + horas).slice(-2)}:${("0" + minutos).slice(-2)}`;
          e.total = totalFinal;
          console.log(totalAtual);
          console.log(totalAnterior);
          console.log(totalFinal);
        }
      }
    });

    historicoAtual.push({
      data: dataAtual,
      inicio: horaAtual,
      fim: "",
      total: "",
    });
  } else if (!banco.ativo) {
    const [dataAtual, horaAtual] = pegarData();
    iniciado.innerText = `${id} iniciado`;
    dia.innerText = `Dia: ${dataAtual}`;
    hora.innerText = `Hora: ${horaAtual}`;

    banco.historico[id].push({
      data: dataAtual,
      inicio: horaAtual,
      fim: "",
      total: "00:00",
    });
  }
  console.log(banco.historico);
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
    const historico = banco.historico[banco.ativo];
    document.querySelector(`#${banco.ativo}`).classList.add("ativo");
    iniciado.innerText = `${banco.ativo} iniciado`;
    historico.map((e) => {
      if (!e.fim) {
        dia.innerText = `Dia: ${e.data}`;
        hora.innerText = `Hora: ${e.inicio}`;
      }
    });
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
      addLista(inputAtividades);
      document.querySelector("#inputAtividades").value = "";
    }
    await localStorage.setItem("banco", JSON.stringify(banco));
  }
});
