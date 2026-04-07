function get_inputs() {
  const logkow = document.getElementById('logKOW').value;
  const sorbent_volume = document.getElementById('sorbent_volume').value;
  const sample_volume = document.getElementById('sample_volume').value;
  let check = true;
  const checks = [
    isNaN(logkow),
    isNaN(sorbent_volume),
    isNaN(sample_volume),
    !Number(logkow),
    !Number(sorbent_volume),
    !Number(sample_volume),
    sorbent_volume < 0,
    sample_volume < 0,
  ];
  for (let verification of checks) {
    if (verification) {
      check = false;
      break;
    }
  }
  return {
    valid: check,
    logKOW: parseFloat(logkow),
    sorbent_volume: parseFloat(sorbent_volume),
    sample_volume: parseFloat(sample_volume),
  };
}

function calculate(inputs) {
  const beta = inputs.sample_volume / inputs.sorbent_volume;
  const recovery =
    (Math.pow(10, inputs.logKOW) * 100) / (beta + Math.pow(10, inputs.logKOW));
  return recovery.toFixed(2);
}

function display_output(result) {
  const outputDIV = document.getElementById('output');
  outputDIV.style.display = 'flex';
  const h2_theoretical = document.createElement('h2');
  h2_theoretical.textContent = 'Theoretical Recovery %';
  const p_theoretical = document.createElement('p');
  p_theoretical.textContent =
    '(if equilibrium is reached and no sample loss takes place)';
  const p_result = document.createElement('p');
  p_result.setAttribute('id', 'result');
  p_result.textContent = `Recovery: ${result} %`;
  outputDIV.appendChild(h2_theoretical);
  outputDIV.appendChild(p_theoretical);
  outputDIV.appendChild(p_result);
}

const button_calculate = document.getElementById('calculate');
button_calculate.addEventListener('click', () => {
  const inputs = get_inputs();
  if (inputs.valid) {
    clear();
    const result = calculate(inputs);
    display_output(result);
  } else {
    alert('Invalid parameter(s)!!');
  }
});

function clear() {
  const outputDIV = document.getElementById('output');
  outputDIV.style.display = 'none';
  while (outputDIV.firstChild) {
    outputDIV.removeChild(outputDIV.firstChild);
  }
}
const clear_button = document.getElementById('clear');
clear.addEventListener('click', () => {
  clear();
});
document.querySelector('footer').innerHTML =
  `<p>Copyright &copy; Danilo Morais Itokagi. All rights reserved. ${new Date().getFullYear()}</p>`;
