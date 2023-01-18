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

function removeClass(classe) {
  const remove = document.querySelector(`.${classe}`);
  if (remove) {
    remove.classList.remove(classe);
  }
}
