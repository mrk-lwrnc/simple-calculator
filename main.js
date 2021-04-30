class CalculatorBuffer {
    constructor() {
        this._has_recently_appended_operator = false;
        this._has_recently_appended_equals = false;
    }

    appendNumberToDisplay(number) {
        if (this._has_recently_appended_equals) {
            this.clearDisplay();
            this._has_recently_appended_equals = false;
        }

        if (selectors['display input'].textContent === '0') {
            selectors['display input'].textContent = number;
            return;
        }

        if (this._has_recently_appended_operator) {
            selectors['display input'].textContent = number;
            this._has_recently_appended_operator = false;
            return;
        }

        selectors['display input'].textContent += number;
    }

    appendOperatorToDisplay(operator) {
        let input = selectors['display input'].textContent;

        if (input.slice(-1) === '.') {
            selectors['display input'].textContent = input.slice(0, input.length - 1);
            input = selectors['display input'].textContent;
        }

        if (this._has_recently_appended_equals) {
            selectors['display equation'].textContent = input.concat(' ', operator, ' ');
            this._has_recently_appended_operator = true;
            this._has_recently_appended_equals = false;
            return;
        }

        if (this._has_recently_appended_operator) {
            const equation = selectors['display equation'].textContent;
            const sliced_equation = equation.slice(0, equation.length - 2);
            selectors['display equation'].textContent = sliced_equation.concat(operator, ' ');
            return;
        }

        this._has_recently_appended_operator = true;
        if (selectors['display equation'].textContent !== '') {
            const evaluated_equation = this.evaluateEquation();
            selectors['display equation'].textContent = evaluated_equation.concat(' ', operator, ' ');
            return;
        }

        selectors['display equation'].textContent = input.concat(' ', operator, ' ');
    }

    appendDecimalPointToDisplay() {
        const input = selectors['display input'].textContent;
        const decimal_point = '.';
        if (input.includes(decimal_point)) { return; }
        if (this._has_recently_appended_operator) {
            selectors['display input'].textContent = '0'.concat(decimal_point);
            this._has_recently_appended_operator = false;
            return;
        }

        if (this._has_recently_appended_equals) {
            this.clearDisplay();
            this._has_recently_appended_equals = false;
        }
        selectors['display input'].textContent += decimal_point;
    }

    appendEqualsToDisplay() {
        let input = selectors['display input'].textContent;
        if (input.slice(-1) === '.') {
            selectors['display input'].textContent = input.slice(0, input.length - 1);
            input = selectors['display input'].textContent;
        }

        const equation = selectors['display equation'].textContent + input;
        selectors['display input'].textContent = this.evaluateEquation();
        selectors['display equation'].textContent = equation.concat(' = ');
        this._has_recently_appended_equals = true;
    }

    negateNumberInDisplay() {
        const input = selectors['display input'].textContent;
        if (input === '0') { return; }

        const is_negative = parseFloat(input) < 0;
        if (is_negative) {
            selectors['display input'].textContent = input.slice(1, input.length)
        } else {
            selectors['display input'].textContent = '-'.concat(input);
        }
    }

    clearEntry() {
        selectors['display input'].textContent = '0';
    }

    clearDisplay() {
        selectors['display input'].textContent = '0';
        selectors['display equation'].textContent = '';
        this._has_recently_appended_operator = false;
    }

    removeLastEntryNumber() {
        const entry = selectors['display input'].textContent;

        const is_entry_negative = parseInt(entry) < 0;
        if (entry.length === 1 || (is_entry_negative && entry.length === 2)) {
            selectors['display input'].textContent = '0';
            return;
        }

        const modified_entry = entry.slice(0, entry.length - 1);
        selectors['display input'].textContent = modified_entry;
    }

    evaluateEquation() {
        const input = selectors['display input'].textContent;
        let equation = selectors['display equation'].textContent.concat(input);
        equation = equation.replace('×', '*');
        equation = equation.replace('÷', '/');

        return eval(equation).toString();
    }
}

const selectors = {
    'display input': document.querySelector('.display-input-container'),
    'display equation': document.querySelector('.display-equation-container'),
    'CE': document.querySelector('.clear-entry-button'),
    'C': document.querySelector('.clear-button'),
    'backspace': document.querySelector('.delete-button'),
    'division': document.querySelector('.division-button'),
    'multiplication': document.querySelector('.multiplication-button'),
    'addition': document.querySelector('.addition-button'),
    'subtraction': document.querySelector('.subtraction-button'),
    'equals': document.querySelector('.equals-button'),
    'decimal point': document.querySelector('.decimal-point-button'),
    'sign': document.querySelector('.sign-button'),
    'one': document.querySelector('.num-one-button'),
    'two': document.querySelector('.num-two-button'),
    'three': document.querySelector('.num-three-button'),
    'four': document.querySelector('.num-four-button'),
    'five': document.querySelector('.num-five-button'),
    'six': document.querySelector('.num-six-button'),
    'seven': document.querySelector('.num-seven-button'),
    'eight': document.querySelector('.num-eight-button'),
    'nine': document.querySelector('.num-nine-button'),
    'zero': document.querySelector('.num-zero-button')
};
const calc_buffer = new CalculatorBuffer();

selectors['one'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(1));
selectors['two'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(2));
selectors['three'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(3));
selectors['four'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(4));
selectors['five'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(5));
selectors['six'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(6));
selectors['seven'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(7));
selectors['eight'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(8));
selectors['nine'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(9));
selectors['zero'].addEventListener('click', (evt) => calc_buffer.appendNumberToDisplay(0));

selectors['addition'].addEventListener('click', (evt) => calc_buffer.appendOperatorToDisplay('+'));
selectors['subtraction'].addEventListener('click', (evt) => calc_buffer.appendOperatorToDisplay('-'));
selectors['multiplication'].addEventListener('click', (evt) => calc_buffer.appendOperatorToDisplay('×'));
selectors['division'].addEventListener('click', (evt) => calc_buffer.appendOperatorToDisplay('÷'));
selectors['equals'].addEventListener('click', (evt) => calc_buffer.appendEqualsToDisplay());

selectors['CE'].addEventListener('click', (evt) => calc_buffer.clearEntry());
selectors['C'].addEventListener('click', (evt) => calc_buffer.clearDisplay());
selectors['backspace'].addEventListener('click', (evt) => calc_buffer.removeLastEntryNumber());
selectors['decimal point'].addEventListener('click', (evt) => calc_buffer.appendDecimalPointToDisplay());
selectors['sign'].addEventListener('click', (evt) => calc_buffer.negateNumberInDisplay());
