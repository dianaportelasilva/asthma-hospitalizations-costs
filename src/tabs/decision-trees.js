import { query } from 'cantil';
import Cryptr from 'cryptr';
import fs from 'fs';

const metadata = require('../metadata');

const main = query('#pills-decision-trees');
const form = main.query('form');
const calculateButton = form.query('[type="submit"]');
const resetButton = form.query('[type="reset"]');
const results = main.query('[role="alert"]');

let tableData;

const input = {
  asthmaDiagnosis: form.query('#decision-asthmaDiagnosis'),
  ageClass: form.query('#decision-ageClass'),
  outcome: form.query('#decision-outcome'),
};
const getTableData = () => {
  const key = new URLSearchParams(window.location.search).get('key');
  if (!key) return alert('A key is missing.');

  const cryptr = new Cryptr(key);

  const encryptedString = fs.readFileSync('data/decision-trees.dat', 'utf8');
  let decryptedString;

  try {
    decryptedString = cryptr.decrypt(encryptedString);
  } catch (e) {
    alert('Wrong key.');
  }

  // show form
  form.classList.remove('d-none');

  return JSON.parse(decryptedString);
};

const getSelectedValues = inputs => Object.values(inputs).map(e => e.selectedOptions[0].getAttribute('key'));

const getFilteredRows = selectedValues => {
  selectedValues = selectedValues ?? getSelectedValues(input);

  return tableData
    .filter(e => true
        && (selectedValues[0] ? e[0] === Number(selectedValues[0]) : true)
        && (selectedValues[1] ? e[1] === Number(selectedValues[1]) : true)
        && (selectedValues[2] ? e[2] === Number(selectedValues[2]) : true));
};

const calculate = () => {
  if (results.classList.contains('d-none')) return;

  const data = getFilteredRows();

  data.forEach(elem => {
    // append new values
    const tr = results.query('table tbody').insertRow();
    let td;

    Object.values(input).forEach(entry => {
      td = tr.insertCell();
      td.appendChild(document.createTextNode(entry.selectedOptions[0].text));
    });

    elem.slice(3).forEach(entry => {
      td = tr.insertCell();
      td.appendChild(document.createTextNode(entry));
    });

    // delete button
    td = tr.insertCell();
    td.classList.add('delete');
    td.appendChild(document.createTextNode('✕'));
    td.onclick = () => tr.remove();
  });
};

const updateSelectOptions = () => {
  const selectedValues = getSelectedValues(input);

  // Filter new available options from current selected options
  const filtered = getFilteredRows(selectedValues);

  const setDisabledOption = (option, status) => {
    if (!option.getAttribute('key')) return;
    option.disabled = !status;
  };

  const uniqueAsthmaDiagnosis = new Set(filtered.map(e => e[0]));
  input.asthmaDiagnosis.children.forEach(option => setDisabledOption(option, uniqueAsthmaDiagnosis.has(Number(option.getAttribute('key')))));

  const uniqueAgeClass = new Set(filtered.map(e => e[1]));
  input.ageClass.children.forEach(option => setDisabledOption(option, uniqueAgeClass.has(Number(option.getAttribute('key')))));

  const uniqueOutcome = new Set(filtered.map(e => e[2]));
  input.outcome.children.forEach(option => setDisabledOption(option, uniqueOutcome.has(Number(option.getAttribute('key')))));

  // Set visibility of each input reset buttons
  Object.values(input).forEach(element => {
    element.sibling('.reset').style.visibility = element.selectedIndex ? 'visible' : 'hidden';
  });

  // show / hide reset button
  const everySelected = selectedValues.every(e => e !== null);
  const someSelected = selectedValues.some(e => e !== null);

  calculateButton.disabled = !everySelected;
  resetButton.disabled = !someSelected;

  if (everySelected) {
    calculate();
  }
};

const initDecisionTrees = async () => {
  // Fill selects (excecpt outcome)
  Object.keys(input)
    .filter(type => type)
    .forEach(type => {
      Object.entries(metadata[type]).forEach(([key, value]) => {
        input[type].insertAdjacentHTML('beforeend', `<option key="${key}">${value}</option>`);
      });
    });

  tableData = getTableData();

  Object.values(input).forEach(element => {
    element.addEventListener('change', updateSelectOptions);
    element.sibling('.reset').addEventListener('click', () => {
      element.selectedIndex = 0;
      updateSelectOptions();
    });
  });

  // reset selects on click
  main.queryAll('select').forEach(e => e.onfocus = () => {
    e.value = '';
    e.blur();
    updateSelectOptions();
  });

  // main reset button
  resetButton.addEventListener('click', () => setTimeout(updateSelectOptions, 1));

  // calculate button
  calculateButton.addEventListener('click', e => {
    // Show results
    results.classList.toggle('d-none', false);

    e.preventDefault();
    calculate();
  });
};

export default initDecisionTrees;
