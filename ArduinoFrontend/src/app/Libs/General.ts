import { CircuitElement } from './CircuitElement';
import { Point } from './Point';
/**
 * Resistor Class
 */
export class Resistor extends CircuitElement {
  /**
   * color table(hex values) of resistor
   */
  static colorTable: string[] = [];
  /**
   * tolerance color mapping values of resistor
   */
  static tolColorMap: number[] = [];
  /**
   * tolerance value of resistor
   */
  static toleranceValues: string[] = [];
  /**
   * unit labels of resistor
   */
  static unitLabels: string[] = [];
  /**
   * unit values of resistor
   */
  static unitValues: number[] = [];
  /**
   * Resistance value of the resistor.
   */
  value: number;
  /**
   * Tolerance index of the resistor.
   */
  toleranceIndex: number;
  /**
   * Resistor constructor
   * @param canvas Raphael Canvas (Paper)
   * @param x  position x
   * @param y  position y
   */
  constructor(public canvas: any, x: number, y: number) {
    super('Resistor', x, y, 'Resistor.json', canvas);
  }
  /** init is called when the component is completely drawn to the canvas */
  init() {
    if (Resistor.colorTable.length === 0) {
      Resistor.colorTable = this.data.colorTable;
      Resistor.toleranceValues = this.data.toleranceValues;
      Resistor.tolColorMap = this.data.tolColorMap;
      Resistor.unitLabels = this.data.unitLabels;
      Resistor.unitValues = this.data.unitValues;
    }
    this.value = this.data.initial;
    this.toleranceIndex = this.data.initialToleranceIndex;
    this.updateColors();
    delete this.data;
    this.data = null;

    this.nodes[0].addValueListener((v, cby, par) => {
      if (cby.parent.id !== this.id) {
        this.nodes[1].setValue(v, this.nodes[0]);
      }
    });
    this.nodes[1].addValueListener((v, cby, par) => {
      if (cby.parent.id !== this.id) {
        this.nodes[0].setValue(v, this.nodes[1]);
      }
    });
  }
  /** Saves data/values that are provided to resistor  */
  SaveData() {
    return {
      value: this.value,
      tolerance: this.toleranceIndex
    };
  }
  /**
   * function loads the SaveData()
   * @param data save object
   */
  LoadData(data: any) {
    this.value = data.data.value;
    this.toleranceIndex = data.data.tolerance;
  }
  /**
   * Updates Resistor Properties
   */
  updateColors() {
    const cur = this.getValue();
    this.elements[1].attr({
      fill: Resistor.colorTable[cur.third]
    }); // Third
    this.elements[2].attr({
      fill: Resistor.colorTable[cur.second]
    }); // Second
    this.elements[3].attr({
      fill: Resistor.colorTable[cur.first]
    }); // First
    this.elements[5].attr({
      fill: Resistor.colorTable[cur.multiplier]
    }); // multiplier
    this.elements[4].attr({
      fill: Resistor.colorTable[this.toleranceIndex]
    }); // Tolerance
  }
  /** Function gets Resistence value */
  getValue() {
    const l = `${this.value}`.length;
    const tmp = `${this.value}`;
    if (l < 2) {
      return {
        multiplier: 11,
        first: this.value,
        second: 0,
        third: 0
      };
    } else if (l < 3) {
      return {
        multiplier: 10,
        first: +tmp.charAt(0),
        second: +tmp.charAt(1),
        third: 0,
      };
    }
    return {
      multiplier: l - 3,
      first: +tmp.charAt(0),
      second: +tmp.charAt(1),
      third: +tmp.charAt(2),
    };
  }
  /** Power values for unitvalues 1K ohm => 10^3 */
  private getPower(index: number) {
    if (index >= 0 && index <= Resistor.unitValues.length) {
      return Resistor.unitValues[index];
    }
    return 0;
  }
  /**
   * Calculate the resistance based on the user input.
   * @param value The Input resistance
   * @param unitIndex The selected unit index
   */
  update(value: string, unitIndex: number) {
    const val = parseFloat(value);
    const p = this.getPower(unitIndex);
    const tmp = parseInt((val * p).toFixed(0), 10);
    if (value.length > 12 || isNaN(tmp) || tmp === Infinity || tmp < 1.0 || `${tmp}`.length > 12) {
      window['showToast']('Resistance Not possible');
      return;
    } else {
      this.value = tmp;
      this.updateColors();
    }
  }
  /** Function returns resistence values 10K ohm => 10 */
  getInputValues() {
    const val = this.value;
    let tmp = val;
    for (let i = 0; i < Resistor.unitValues.length; ++i) {
      tmp = Math.floor(val / Resistor.unitValues[i]);
      if (tmp > 0) {
        continue;
      } else {
        return {
          index: i - 1,
          val: val / Resistor.unitValues[i - 1]
        };
      }
    }
    return {
      index: Resistor.unitValues.length - 1,
      val: this.value / Resistor.unitValues[
        Resistor.unitLabels.length - 1
      ]
    };
  }
  /** Function returns the resistor with resistence */
  getName() {
    const cur = this.getInputValues();
    return `Resistor ${cur.val}${Resistor.unitLabels[cur.index]}`;
  }
  /**
   * Function provides component details
   * @param keyName Unique Class name
   * @param id Component id
   * @param body body of property box
   * @param title Component title
   */
  properties(): { keyName: string; id: number; body: HTMLElement; title: string; } {
    let tmp;
    const cur = this.getInputValues();
    const body = document.createElement('div');
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.value = `${cur.val}`;
    inp.min = '1';
    inp.addEventListener('wheel', (event) => {
      event.preventDefault();
    });

    const unit = document.createElement('select');
    tmp = '';
    for (const ohm of Resistor.unitLabels) {
      tmp += `<option>${ohm} &#8486;</option>`;
    }
    unit.innerHTML = tmp;
    unit.selectedIndex = cur.index;

    const tole = document.createElement('select');
    tmp = '';
    for (const t of Resistor.toleranceValues) {
      tmp += `<option>&#177; ${t}%</option>`;
    }
    tole.innerHTML = tmp;

    unit.onchange = () => this.update(inp.value, unit.selectedIndex);
    inp.onkeyup = () => this.update(inp.value, unit.selectedIndex);
    inp.onchange = () => this.update(inp.value, unit.selectedIndex);
    tole.onchange = () => {
      this.toleranceIndex = Resistor.tolColorMap[tole.selectedIndex];
      this.updateColors();
    };

    const lab = document.createElement('label');
    lab.innerText = 'Resistance';
    body.append(lab);
    body.append(inp);
    body.append(unit);
    const lab2 = document.createElement('label');
    lab2.innerText = 'Tolerance';
    body.append(lab2);
    body.append(tole);

    return {
      keyName: this.keyName,
      id: this.id,
      title: 'Resistor',
      body
    };
  }
  /**
   * Called by the start simulation.
   */
  initSimulation(): void {
  }
  /**
   * Called by the stop simulation.
   */
  closeSimulation(): void {
  }
}

/**
 * Breadboard Class
 */
export class BreadBoard extends CircuitElement {
  /**
   * Nodes that are connected
   */
  public joined: Point[] = [];
  /**
   * Breadboard constructor
   * @param canvas Raphael Canvas (Paper)
   * @param x  position x
   * @param y  position y
   */
  constructor(public canvas: any, x: number, y: number) {
    super('BreadBoard', x, y, 'Breadboard.json', canvas);
  }
  /** init is called when the component is complety drawn to the canvas */
  init() {
    // add a connect callback listener
    for (const node of this.nodes) {
      node.connectCallback = (item) => {
        this.joined.push(item);
      };
    }
    // Remove the drag event
    this.elements.undrag();
    let tmpx = 0;
    let tmpy = 0;
    let fdx = 0;
    let fdy = 0;
    let tmpar = [];
    let tmpar2 = [];
    // Create Custom Drag event
    this.elements.drag((dx, dy) => {
      this.elements.transform(`t${this.tx + dx},${this.ty + dy}`);
      tmpx = this.tx + dx;
      tmpy = this.ty + dy;
      fdx = dx;
      fdy = dy;
      for (let i = 0; i < this.joined.length; ++i) {
        this.joined[i].move(tmpar[i][0] + dx, tmpar[i][1] + dy);
      }
    }, () => {
      fdx = 0;
      fdy = 0;
      tmpar = [];
      tmpar2 = [];
      for (const node of this.nodes) {
        tmpar2.push(
          [node.x, node.y]
        );
        node.remainHidden();
      }
      for (const node of this.joined) {
        tmpar.push(
          [node.x, node.y]
        );
        node.remainShow();
      }

    }, () => {
      for (let i = 0; i < this.nodes.length; ++i) {
        this.nodes[i].move(tmpar2[i][0] + fdx, tmpar2[i][1] + fdy);
        this.nodes[i].remainShow();
      }
      tmpar2 = [];
      this.tx = tmpx;
      this.ty = tmpy;
    });
  }
  /**
   * Function provides component details
   * @param keyName Unique Class name
   * @param id Component id
   * @param body body of property box
   * @param title Component title
   */
  properties(): { keyName: string; id: number; body: HTMLElement; title: string; } {
    const body = document.createElement('div');
    return {
      keyName: this.keyName,
      id: this.id,
      body,
      title: this.title
    };
  }
  /**
   * Initialize Breadboard for simultion
   */
  initSimulation(): void {
    // Stores set of node which has same x values
    const xtemp = {};
    // Stores set of node which has same y values
    const ytemp = {};

    for (const node of this.joined) {
      // Add a Node value change listener
      node.addValueListener((v, cby, par) => {
        if (par.x === par.x && cby.y === par.y) {
          return;
        }
        if (node.label === '+' || node.label === '-') {
          for (const neigh of ytemp[node.y]) {
            if (neigh.x !== node.x) {
              neigh.setValue(v, neigh);
            }
          }
        } else {
          const op = node.label.charCodeAt(0);
          if (op >= 102) {
            for (const neigh of xtemp[node.x]) {
              if (neigh.y !== node.y && neigh.label.charCodeAt(0) >= 102) {
                neigh.setValue(v, neigh);
              }
            }
          }
          if (op <= 101) {
            for (const neigh of xtemp[node.x]) {
              if (neigh.y !== node.y && neigh.label.charCodeAt(0) <= 101) {
                neigh.setValue(v, neigh);
              }
            }
          }
        }

      });

      // create the set for x
      if (!(node.x in xtemp)) {
        xtemp[node.x] = [];
      }
      xtemp[node.x].push(node);
      // Create the set for y
      if (!(node.y in ytemp)) {
        ytemp[node.y] = [];
      }
      ytemp[node.y].push(node);
    }

  }
  /**
   * Called on Stop Simulation is pressed
   */
  closeSimulation(): void {
  }
}
