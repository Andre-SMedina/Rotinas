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
