'use strict';

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function listen(event, selector, callback) {
  return selector.addEventListener(event, callback);
}

const person = select('.person-select');
const hourAmount = select('.hour-input');
const hourType = select('.type-of-hour');
const addHours = select('.add-hours');
const employeeContainer = select('.display');
const totalRegHours = select('.total-reg-hours');
const totalCashHours = select('.total-cash-hours');
const totalHoliHours = select('.total-holi-hours');
const totalHoliCashHours = select('.total-holi-cash-hours');
const overallTotal = select('.overall-total');
let employeeMap = new Map();

class Employee {
  constructor(name) {
    this.name = name;
    this.regHours = 0;
    this.holiHours = 0;
    this.cashHours = 0;
    this.holiCash = 0;
  }

  addHours(hourType, hours) {
    if (hourType === 'reg') this.regHours += hours;
    if (hourType === 'holi-reg') this.holiHours += hours;
    if (hourType === 'cash') this.cashHours += hours;
    if (hourType === 'holi-cash') this.holiCash += hours;
  }

  getHoursSummary() {
    let summary = `${this.name}:`;
    if (this.regHours > 0) summary += ` Regular Hours: ${this.regHours}`;
    if (this.cashHours > 0) summary += ` Cash Hours: ${this.cashHours}`;
    if (this.holiHours > 0) summary += ` Holiday Hours: ${this.holiHours}`;
    if (this.holiCash > 0) summary += ` Holiday Cash: ${this.holiCash}`;
    return summary;
  }

  getTotalHours() {
    return this.regHours + this.holiHours + this.cashHours + this.holiCash;
  }
}

function isValidHours(hours) {
  const enteredHour = parseInt(hours, 10);
  return enteredHour >= 0 && enteredHour <= 99;
}

function updateOrAddEmployeeDiv(employee) {
  let employeeDiv = document.getElementById(employee.name);

  if (!employeeDiv) {
    employeeDiv = document.createElement('div');
    employeeDiv.classList.add('employee', 'flex');
    employeeDiv.id = employee.name;
    employeeContainer.appendChild(employeeDiv);
  }

  employeeDiv.innerHTML = `<p>${employee.getHoursSummary()}</p>`;
}

function updateTotals() {
  let regTotal = 0;
  let cashTotal = 0;
  let holiRegTotal = 0;
  let holiCashTotal = 0;
  let overall = 0;

  employeeMap.forEach(employee => {
    regTotal += employee.regHours;
    cashTotal += employee.cashHours;
    holiRegTotal += employee.holiHours;
    holiCashTotal += employee.holiCash;
    overall += employee.getTotalHours();
  });

  totalRegHours.textContent = regTotal;
  totalCashHours.textContent = cashTotal;
  totalHoliHours.textContent = holiRegTotal;
  totalHoliCashHours.textContent = holiCashTotal;
  overallTotal.textContent = overall;
}

listen('click', addHours, () => {
  const hours = parseInt(hourAmount.value);

  const currentPerson = person.value;
  if (currentPerson === '-- Person --') {
    person.classList.add('invald-border');
    return;
  } else {
    person.classList.remove('invald-border');
  }

  const selectedType = hourType.value;
  if (selectedType === '-- Pay Rate --') {
    hourType.classList.add('invald-border');
    return;
  } else {
    hourType.classList.remove('invald-border');
  }

  if (!isValidHours(hours)) {
    hourAmount.classList.add('invald-border');
    return;
  } else {
    hourAmount.classList.remove('invald-border');
  }

  let employee = employeeMap.get(currentPerson);
  if (!employee) {
    employee = new Employee(currentPerson);
    employeeMap.set(currentPerson, employee);
  }

  employee.addHours(selectedType, hours);

  updateOrAddEmployeeDiv(employee);
  updateTotals();

  hourAmount.value = '';
  hourType.value = '-- Pay Rate --';
  person.value = '-- Person --';

  console.log(employeeMap);
});
