function extract(Vw, Ve, KM, KN, Me, Ne, Mw, Nw) {
  const beta = Vw / Ve;
  const xM = (KM * Mw - beta * Me) / (KM + beta);
  const xN = (KN * Nw - beta * Ne) / (KN + beta);
  Me = Me + xM;
  Mw = Mw - xM;
  Ne = Ne + xN;
  Nw = Nw - xN;
  return { Me: Me, Ne: Ne, Mw: Mw, Nw: Nw };
}

class Vessel {
  constructor(number, Vw, Ve, KM, KN, Me, Ne, Mw, Nw) {
    ((this.number = number),
      (this.Vw = Vw),
      (this.Ve = Ve),
      (this.KM = KM),
      (this.KN = KN),
      (this.Me = Me),
      (this.Ne = Ne),
      (this.Mw = Mw),
      (this.Nw = Nw),
      (this.total_M = 0),
      (this.total_N = 0),
      (this.total = 0),
      (this.percentage_M = 0),
      (this.percentage_N = 0));
    this.init();
  }
  init() {
    this.set_total();
    this.set_percentage();
  }
  set_total() {
    this.total = this.Me + this.Ne + this.Mw + this.Nw;
    this.total_M = this.Mw + this.Me;
    this.total_N = this.Nw + this.Ne;
  }
  set_percentage() {
    this.set_total();
    if (this.total) {
      this.percentage_M = ((this.total_M * 100) / this.total).toFixed(2);
      this.percentage_N = ((this.total_N * 100) / this.total).toFixed(2);
    } else {
      this.percentage_M = 0;
      this.percentage_N = 0;
    }
  }
  extract() {
    const result = extract(
      this.Vw,
      this.Ve,
      this.KM,
      this.KN,
      this.Me,
      this.Ne,
      this.Mw,
      this.Nw,
    );
    this.Me = result['Me'];
    this.Ne = result['Ne'];
    this.Mw = result['Mw'];
    this.Nw = result['Nw'];
    this.set_total();
    this.set_percentage();
  }
}
// v = new Vessel(
//   (number = 0),
//   (Vw = 50),
//   (Ve = 50),
//   (KM = 0.5),
//   (KN = 2),
//   (Me = 0),
//   (Ne = 0),
//   (Mw = 1),
//   (Nw = 1),
// );
class VesselSystem {
  constructor(number_of_vessels, Vw, Ve, KM, KN, Me, Ne, Mw, Nw) {
    this.number_of_vessels = number_of_vessels;
    this.number_of_shakings = 0;
    this.vessels = [];
    this.fractions = [];
    this.Vw = Vw;
    this.Ve = Ve;
    this.KM = KM;
    this.KN = KN;
    this.Me = Me;
    this.Ne = Ne;
    this.Mw = Mw;
    this.Nw = Nw;
    this.init();
  }
  init() {
    for (let i = 0; i < this.number_of_vessels; i++) {
      let vessel = null;
      if (i == 0) {
        vessel = new Vessel(
          i + 1,
          this.Vw,
          this.Ve,
          this.KM,
          this.KN,
          this.Me,
          this.Ne,
          this.Mw,
          this.Nw,
        );
      } else {
        vessel = new Vessel(
          i + 1,
          this.Vw,
          this.Ve,
          this.KM,
          this.KN,
          0,
          0,
          0,
          0,
        );
      }
      this.vessels.push(vessel);
    }
  }
  move_organic_phase() {
    for (let i = this.number_of_vessels - 1; i > -1; i--) {
      if (i == 0) {
        this.vessels[i]['Me'] = 0;
        this.vessels[i]['Ne'] = 0;
      } else {
        this.vessels[i]['Me'] = this.vessels[i - 1]['Me'];
        this.vessels[i]['Ne'] = this.vessels[i - 1]['Ne'];
      }
    }
  }
  get_total_in_system() {
    let sums = 0;
    for (let vessel of this.vessels) {
      sums += vessel.total;
    }
    return sums;
  }
  get_total_mass_in_fractions() {
    let sums = 0;
    if (this.fractions) {
      for (let fraction of this.fractions) {
        sums += fraction.fMe + fraction.fNe;
      }
    }
    return sums;
  }
  extract_all() {
    if (this.number_of_shakings != 0) {
      this.move_organic_phase();
    }
    for (let vessel of this.vessels) {
      vessel.extract();
    }
    this.number_of_shakings += 1;
    if (this.number_of_shakings >= this.number_of_vessels) {
      const fMe = this.vessels[this.number_of_vessels - 1]['Me'];
      const fNe = this.vessels[this.number_of_vessels - 1]['Ne'];
      this.fractions.push({
        fMe: fMe,
        fNe: fNe,
        M_perc: ((fMe * 100) / (fMe + fNe)).toFixed(2),
        N_perc: ((fNe * 100) / (fMe + fNe)).toFixed(2),
      });
    }
  }
}

// vs = new Vessels(10, 50, 50, 0.5, 2, 0, 0, 1, 1);
// console.log(vs);
function get_inputs() {
  const n_vessels = parseInt(document.getElementById('i_n_vessels').value);
  const Vw = parseFloat(document.getElementById('sample_v').value);
  const Ve = parseFloat(document.getElementById('extractant_v').value);
  const KM = parseFloat(document.getElementById('KM').value);
  const KN = parseFloat(document.getElementById('KN').value);
  const Mw = parseFloat(document.getElementById('Mw').value);
  const Nw = parseFloat(document.getElementById('Nw').value);
  const inputs = [n_vessels, Vw, Ve, KM, KN, Mw, Nw];
  let check = true;
  for (let input of inputs) {
    if (!input || isNaN(input) || input < 0) {
      check = false;
    }
  }
  return {
    valid: check,
    vessels: n_vessels,
    Vw: Vw,
    Ve: Ve,
    KM: KM,
    KN: KN,
    Mw: Mw,
    Nw: Nw,
  };
}

let system = null;
const vessels_button = document.getElementById('n_vessels_button');
vessels_button.addEventListener('click', () => {
  if (!system) {
    const inputs = get_inputs();
    if (!inputs.valid) {
      alert('Invalid Parameters !!');
      return;
    }
    if (inputs.vessels > 50) {
      alert('No more than 50 vessels!!!');
      return;
    }
    system = new VesselSystem(
      inputs['vessels'],
      inputs['Vw'],
      inputs['Ve'],
      inputs['KM'],
      inputs['KN'],
      (Me = 0),
      (Ne = 0),
      inputs['Mw'],
      inputs['Nw'],
    );
    display_system(system);
  } else {
    alert('Vessels already generated!!!');
    return;
  }
});

function display_system(system) {
  clear_display();
  const div_results = document.getElementById('results');

  // vessels
  const div_vessels = document.createElement('div');
  const h2_system = document.createElement('h2');
  const number_of_extractions = document.createElement('div');
  const total_analyte_system = document.createElement('div');
  div_vessels.setAttribute('class', 'vessels');
  h2_system.textContent = 'SYSTEM';
  number_of_extractions.textContent = `Number of extractions: ${system.number_of_shakings}`;
  total_analyte_system.textContent = `Total mass of analyte in the system: ${system.get_total_in_system().toFixed(4)}`;
  div_vessels.appendChild(h2_system);
  div_vessels.appendChild(number_of_extractions);
  div_vessels.appendChild(total_analyte_system);

  const table_vessels = document.createElement('table');
  table_vessels.setAttribute('id', 'table_vessels');
  const head_vessels = document.createElement('tr');
  const th_vessel = document.createElement('th');
  const th_MN_vessel = document.createElement('th');
  const th_MN_p_vessel = document.createElement('th');

  th_vessel.textContent = 'Vessel';
  th_MN_vessel.textContent = 'M / N';
  th_MN_p_vessel.textContent = 'M / N (%)';

  head_vessels.appendChild(th_vessel);
  head_vessels.appendChild(th_MN_vessel);
  head_vessels.appendChild(th_MN_p_vessel);
  table_vessels.appendChild(head_vessels);

  for (let vessel of system.vessels) {
    const row = document.createElement('tr');
    row.setAttribute('id', `vr${vessel.number}`);
    const ves_n = document.createElement('td');
    const MN_mass = document.createElement('td');
    const MN_percentage = document.createElement('td');

    ves_n.textContent = `v${vessel['number']}`;
    if (vessel['number'] === system.vessels.length) {
      ves_n.textContent = `v${vessel['number']}(collector)`;
      ves_n.style.color = 'gold';
    }
    MN_mass.textContent = `${vessel['total_M'].toFixed(4)} / ${vessel['total_N'].toFixed(4)}`;
    MN_percentage.textContent = `${vessel.percentage_M} / ${vessel.percentage_N}`;
    row.appendChild(ves_n);
    row.appendChild(MN_mass);
    row.appendChild(MN_percentage);
    table_vessels.appendChild(row);
  }
  div_vessels.appendChild(table_vessels);
  div_results.appendChild(div_vessels);

  // fractions
  const div_fractions = document.createElement('div');
  const h2_fractions = document.createElement('h2');
  const number_of_fractions = document.createElement('div');
  const total_analyte_fractions = document.createElement('div');
  div_fractions.setAttribute('class', 'fractions');
  number_of_fractions.setAttribute('id', 'nfractions');
  total_analyte_fractions.setAttribute('id', 'total_analyte_fractions');
  h2_fractions.textContent = 'COLLECTED FRACTIONS';
  number_of_fractions.textContent = `Number of fractions: ${system.fractions.length}`;
  total_analyte_fractions.textContent = `Total mass of analyte in the fractions: ${system.get_total_mass_in_fractions().toFixed(4)}`;
  div_fractions.appendChild(h2_fractions);
  div_fractions.appendChild(number_of_fractions);
  div_fractions.appendChild(total_analyte_fractions);
  const table_fractions = document.createElement('table');
  table_fractions.setAttribute('id', 'table_fractions');
  const head_fractions = document.createElement('tr');
  const th_fraction = document.createElement('th');
  const th_MN = document.createElement('th');
  const th_MN_p = document.createElement('th');

  th_fraction.textContent = 'Fraction';
  th_MN.textContent = 'M / N';
  th_MN_p.textContent = 'M / N (%)';

  head_fractions.appendChild(th_fraction);
  head_fractions.appendChild(th_MN);
  head_fractions.appendChild(th_MN_p);
  table_fractions.appendChild(head_fractions);

  if (system.fractions.length) {
    for (let i = 0; i < system.fractions.length; i++) {
      const row = document.createElement('tr');
      row.setAttribute('id', `fr$.number}`);
      const fn = document.createElement('td');
      const MN_mass = document.createElement('td');
      const MN_percentage = document.createElement('td');
      fn.textContent = `f${i + 1}`;
      MN_mass.textContent = `${system.fractions[i].fMe.toFixed(4)} / ${system.fractions[i].fNe.toFixed(4)}`;
      MN_percentage.textContent = `${system.fractions[i].M_perc} / ${system.fractions[i].N_perc}`;
      row.appendChild(fn);
      row.appendChild(MN_mass);
      row.appendChild(MN_percentage);
      table_fractions.appendChild(row);
    }
  }
  div_fractions.appendChild(table_fractions);
  div_results.appendChild(div_fractions);
}

const extract_button = document.getElementById('extract');
extract_button.addEventListener('click', () => {
  if (system) {
    system.extract_all();
    display_system(system);
  } else {
    alert('First, generate the vessels!');
  }
  if (system.get_total_in_system().toFixed(4) === '0.0000') {
    alert('No analyte in the system!');
  }
});

function clear_display() {
  const div_results = document.getElementById('results');
  while (div_results.firstChild) {
    div_results.removeChild(div_results.firstChild);
  }
}
function clear() {
  clear_display();
  system = null;
}

const clear_button = document.getElementById('clear');
clear_button.addEventListener('click', () => {
  clear();
});

document.querySelector('footer').innerHTML =
  `<p>Copyright &copy; Danilo Morais Itokagi. All rights reserved. ${new Date().getFullYear()}</p>`;
