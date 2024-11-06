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
const submitButton = select('.submit');
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
    if (this.regHours > 0) summary += ` Regular Hours = ${this.regHours}`;
    if (this.cashHours > 0) summary += `, Cash Hours = ${this.cashHours}`;
    if (this.holiHours > 0) summary += `, Holiday Hours = ${this.holiHours}`;
    if (this.holiCash > 0) summary += `, Holiday Cash = ${this.holiCash}`;
    return summary;
  }

  getTotalHours() {
    return this.regHours + this.holiHours + this.cashHours + this.holiCash;
  }
}

function isValidHours(hours) {
  const enteredHour = parseFloat(hours);
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
  const hours = parseFloat(hourAmount.value);

  const currentPerson = person.value;
  if (currentPerson === 'Person') {
    person.classList.add('invald-border');
    return;
  } else {
    person.classList.remove('invald-border');
  }

  const selectedType = hourType.value;

  if (selectedType === 'Type') {
    hourType.classList.add('invald-border');
    return;
  } else {
    hourType.classList.remove('invald-border');
  }

  if (!isValidHours(hours)) {
    hourAmount.classList.add('invald-border');
    hourAmount.value = '';
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
  hourType.value = 'Type';
  person.value = 'Person';
});

listen('change', hourType, () => {
  if (hourType !== 'Type') {
    hourAmount.focus();
  }
});

function pressEnterToAddHours(field) {
  listen('keydown', field, (event) => {
    if (event.key === 'Enter') {
      addHours.click();
    }
  });
}

pressEnterToAddHours(person);
pressEnterToAddHours(hourType);
pressEnterToAddHours(hourAmount);

submitButton.addEventListener('click', () => {
  let emailBody = 'Biweekly Hour Report:\n\n';
  let totalReg = 0;
  let totalCash = 0;
  let totalHoliReg = 0;
  let totalHoliCash = 0;
  let overall = 0;

  employeeMap.forEach(employee => {
    emailBody += employee.getHoursSummary() + '\n';
    totalReg += employee.regHours;
    totalCash += employee.cashHours;
    totalHoliReg += employee.holiHours;
    totalHoliCash += employee.holiCash;
    overall += employee.getTotalHours();
  });

  emailBody += `\nOverall Totals:\n`;
  emailBody += `Regular Hours: ${totalReg}\n`;
  emailBody += `Cash Hours: ${totalCash}\n`;
  emailBody += `Holiday Hours: ${totalHoliReg}\n`;
  emailBody += `Holiday Cash Hours: ${totalHoliCash}\n`;
  emailBody += `Total Hours: ${overall}\n`;

  const mailtoLink = `mailto:example@123.com?subject=Biweekly%20Hour%20Report&body=${encodeURIComponent(emailBody)}`;
  window.location.href = mailtoLink;
});
