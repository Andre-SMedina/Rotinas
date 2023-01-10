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
      atividades: [],
      ativo: "",
      historico: {
        nadar: [
          { data: "05/05/2020", inicio: "12:30", fim: "13:30", total: "" },
        ],
        correr: [],
      },
    })
  );
  banco = JSON.parse(localStorage.getItem("banco"));
}

if (!banco) {
  bancoCreate();
}

function controle(id) {
  const time = new Date();
  const dias = ("0" + time.getDate()).slice(-2);
  const mes = ("0" + (time.getMonth() + 1)).slice(-2);
  const ano = time.getFullYear();
  const dataAtual = `${dias}/${mes}/${ano}`;
  const horaAtual = `${("0" + time.getHours()).slice(-2)}:${(
    "0" + time.getMinutes()
  ).slice(-2)}`;
  const historico = banco.historico[id];

  iniciado.innerText = `${id} iniciado`;
  dia.innerText = `Dia: ${dataAtual}`;
  hora.innerText = `Hora: ${horaAtual}`;

  if (historico) {
    historico.map((e) => {
      if (e.data == dataAtual && !e.fim) {
        //
      }
    });
    historico.push({ data: dataAtual, inicio: horaAtual, fim: "", total: "" });
    console.log(historico);
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
      banco.ativo = id;
      h3.classList.add("ativo");
      controle(banco.ativo);
    } else {
      document.querySelector(`#${banco.ativo}`).classList.remove("ativo");
      h3.classList.add("ativo");
      banco.ativo = id;
      controle(banco.ativo);
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
    document.querySelector(`#${banco.ativo}`).classList.add("ativo");
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
