const data1 = new Date("2021-10-05T00:01:00");
const data2 = new Date("2021-10-05T05:00:00");

const MiliSeg = data1 - data2;

const minTot = MiliSeg / 60000;
const horasTot = parseInt(MiliSeg / 60000 / 60);
const dias = parseInt(horasTot / 24);
const horas = horasTot - dias * 24;
const min = minTot - horasTot * 60;
const res = `${dias}d ${horas}h ${min}m`;

// console.log(res);

const tot1 = { horas: 5, minutos: 35 };
const tot2 = { horas: 2, minutos: 50 };

const soma = tot1.horas * 60 + tot1.minutos + (tot2.horas * 60 + tot2.minutos);
const horas2 = parseInt(soma / 60);
const min2 = soma - horas2 * 60;
const res2 = `${horas2}h ${min2}m`;

// console.log(soma);
// console.log(horas2);
// console.log(min2);
// console.log(res2);

const xhr1 = "01:45".split(":");
const xhr2 = "01:50".split(":");
const xtotmin =
  parseInt(xhr1[0]) * 60 +
  parseInt(xhr1[1]) +
  (parseInt(xhr2[0]) * 60 + parseInt(xhr2[1]));
const xhr = parseInt(xtotmin / 60);
const xmin = xtotmin - xhr * 60;
const result = `${("0" + xhr).slice(-2)}:${("0" + xmin).slice(-2)}`;

console.log(xtotmin);
console.log(result);
