parameters = [
  'Distribution Constant: ',
  'Mass of analyte (g): ',
  'Sample volume (mL): ',
  'Extractant volume (mL): ',
  'Number of Shakings: ',
];
let flag_PERFORMACE = false;
let flag_number_of_shakings = false;

inputIDs = [];

function extractionPerformance(
  kd,
  analyte_mass_in_sample,
  sample_volume,
  extractant_volume,
  cycles,
) {
  let m0 = analyte_mass_in_sample;
  const r = sample_volume / extractant_volume;
  let sums = 0;
  const results = { masses: [], percentages: [], shakings: cycles };
  for (let i = 0; i < cycles; i++) {
    const mex = (kd / (kd + r)) * m0;
    results['masses'].push(mex.toFixed(4));
    sums = sums + mex;
    const percentage = (sums * 100) / analyte_mass_in_sample;
    results['percentages'].push(percentage.toFixed(2));
    m0 = m0 - mex;
  }
  return results;
}

function shakings(
  kd,
  analyte_mass_in_sample,
  sample_volume,
  extractant_volume,
) {
  const r = sample_volume / extractant_volume;
  const results = { masses: [], percentages: [], shakings: 0 };
  let m0 = analyte_mass_in_sample;
  const limit = m0 * (1 - 0.999);
  let sums = 0;
  if (m0 > limit) {
    while (m0 > limit) {
      const mex = (kd / (kd + r)) * m0;
      sums = sums + mex;
      results['masses'].push(mex.toFixed(4));
      const percentage = (sums * 100) / analyte_mass_in_sample;
      results['percentages'].push(percentage.toFixed(2));
      results['shakings'] += 1;
      m0 = m0 - mex;
    }
  }
  return results;
}

function calculate() {
  const values = [];
  let result = '';
  for (input of inputIDs) {
    values.push(Number(document.getElementById(`${input}`).value));
  }
  const check = checkParameters(values);
  if (check) {
    if (flag_PERFORMACE === true) {
      result = extractionPerformance(
        (kd = values[0]),
        (analyte_mass_in_sample = values[1]),
        (sample_volume = values[2]),
        (extractant_volume = values[3]),
        (cycles = values[4]),
      );
    } else if (flag_number_of_shakings === true) {
      result = shakings(
        (kd = values[0]),
        (analyte_mass_in_sample = values[1]),
        (sample_volume = values[2]),
        (extractant_volume = values[3]),
      );
    }
  } else {
    alert('Invalid Parameter!!');
  }
  return result;
}

function checkParameters(values) {
  let isValid = true;
  for (let value of values) {
    if (isNaN(value) || !value || value <= 0) {
      isValid = false;
    }
  }
  return isValid;
}

function showLABELS(parameters) {
  const parametersDIV = document.getElementById('parameters');
  parametersDIV.style.border = '5px solid grey';
  if (flag_PERFORMACE === true) {
    n = parameters.length;
  } else if (flag_number_of_shakings === true) {
    n = parameters.length - 1;
  }
  for (let i = 0; i < n; i++) {
    const paramDIV = document.createElement('div');
    paramDIV.setAttribute('class', `parameter`);
    const parameterLABEL = document.createElement('label');
    const parameterINPUT = document.createElement('input');
    parameterLABEL.textContent = parameters[i];
    parameterINPUT.setAttribute('id', `input${i + 1}`);
    inputIDs.push(`input${i + 1}`);
    paramDIV.appendChild(parameterLABEL);
    paramDIV.appendChild(parameterINPUT);
    parametersDIV.appendChild(paramDIV);
  }
  const calculateButton = document.createElement('button');
  calculateButton.setAttribute('id', 'calculate');
  calculateButton.textContent = 'Calculate';
  parametersDIV.appendChild(calculateButton);

  const calculateBUTTON = document.getElementById('calculate');
  calculateBUTTON.addEventListener('click', () => {
    clearOUTPUT();
    const result = calculate();
    if (result) {
      const frame = document.getElementById('frame');
      frame.style.flexDirection = 'row';
      outputDIV = document.getElementById('output');
      outputDIV.style.border = '5px solid grey';
      const p = document.createElement('p');
      p.textContent = 'Extraction Performance';
      outputDIV.appendChild(p);
      if (flag_PERFORMACE === true) {
        for (let i = 0; i < result.masses.length; i++) {
          const resultDIV = document.createElement('div');
          resultDIV.setAttribute('class', 'results');
          resultDIV.textContent = `Shaking n${i + 1} extracts ${result.masses[i]}, (${result.percentages[i]} %)`;
          outputDIV.appendChild(resultDIV);
        }
      } else if (flag_number_of_shakings === true) {
        const shakingsDIV = document.createElement('div');
        shakingsDIV.textContent = `Number of Shakings: ${result.shakings}`;
        outputDIV.appendChild(shakingsDIV);
        for (let i = 0; i < result.masses.length; i++) {
          const resultDIV = document.createElement('div');
          resultDIV.setAttribute('class', 'results');
          resultDIV.textContent = `Shaking n${i + 1} extracts ${result.masses[i]}, (${result.percentages[i]} %)`;
          outputDIV.appendChild(resultDIV);
        }
      }
      let sums = 0;
      for (let mass of result.masses) {
        sums += Number(mass);
      }
      const totalDIV = document.createElement('div');
      totalDIV.textContent = `Total: ${sums.toFixed(4)}`;
      outputDIV.appendChild(totalDIV);
      document.getElementById('frame').appendChild(outputDIV);
    }
  });
}

const performanceBUTTON = document.getElementById('performance');
const shakingsNumberBUTTON = document.getElementById('shakings');

performanceBUTTON.addEventListener('click', () => {
  clear();
  clearOUTPUT();
  flag_PERFORMACE = true;
  showLABELS(parameters);
});

shakingsNumberBUTTON.addEventListener('click', () => {
  clear();
  clearOUTPUT();
  flag_number_of_shakings = true;
  showLABELS(parameters);
});

function clear() {
  flag_PERFORMACE = false;
  flag_number_of_shakings = false;
  document.getElementById('parameters').style.border = 'none';
  const parametersDIV = document.getElementById('parameters');
  while (parametersDIV.firstChild) {
    parametersDIV.removeChild(parametersDIV.firstChild);
  }
  clearOUTPUT();
  inputIDs = [];
}

const clearBUTTON = document.getElementById('clear');
clearBUTTON.addEventListener('click', () => {
  clear();
});

function clearOUTPUT() {
  const frame = document.getElementById('frame');
  frame.style.flexDirection = 'column';
  const outputDIV = document.getElementById('output');
  outputDIV.style.border = 'none';
  while (outputDIV.firstChild) {
    outputDIV.removeChild(outputDIV.firstChild);
  }
}

document.querySelector('footer').innerHTML =
  `<p>Copyright &copy; Danilo Morais Itokagi. All rights reserved. ${new Date().getFullYear()}</p>`;
