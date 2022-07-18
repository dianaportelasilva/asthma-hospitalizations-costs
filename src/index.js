import "bootstrap/dist/css/bootstrap.min.css";
import { query, onDomReady } from "cantil";

const form = query("form");
const locale = navigator.language ?? 'pt-PT';
const currencyFormat = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
const percentFormat = new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 2 });

const formClick = (event) => {
  event.preventDefault();

  // validate form
  if (!form.checkValidity()) {
    return form.reportValidity();
  }

  calculate();

  // show results
  query(".alert").classList.remove("d-none");
}

const calculate = () => {
  // get form values
  let cost = Number(form.query('#cost').value);
  let weekdays = Number(form.query('#days').value);
  let proporcion = Number(form.query('#proporcion').value) / 100;
  let population = Number(form.query('#population').value);

  let affectedDays = proporcion * weekdays;
  let affectedCapacity = affectedDays / (weekdays === 5 ? 250 : 365);
  let costEstimated = affectedCapacity * cost;
  let costPerPerson = costEstimated / population;

  query("[affected-days]").innerText = percentFormat.format(affectedDays / 100);
  query("[affected-capacity]").innerText = percentFormat.format(affectedCapacity / 100);
  query("[cost-estimated]").innerText = currencyFormat.format(costEstimated);
  query("[cost-per-person]").innerText = currencyFormat.format(costPerPerson);
}

onDomReady().then(() => {
  form.queryAll('input, select').forEach(e => e.addEventListener('input', calculate));
  form.query("button").addEventListener("click", formClick);
});