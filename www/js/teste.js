//pega o valor total em milisegundos e converte para minutos
const minTot =
  (new Date("2021-10-08T00:30:00") - new Date("2021-10-07T23:30:00")) / 60000;
//converte os minutos totais em horas, arredondando
const hrTot = parseInt(minTot / 60);
//converte as horas totais em dias, arredondando
const dias = parseInt(hrTot / 24);
//pega a quantidade de horas que sobra após subtrair os dias
const hr = hrTot - dias * 24;
//pega a quantidade de minutos que sobra após subtrair as horas
const min = minTot - hr * 60;
const ressultado = `${("0" + dias).slice(-2)}dias ${("0" + hr).slice(
  -2
)}horas ${("0" + min).slice(-2)}minutos`;

console.log(ressultado);
