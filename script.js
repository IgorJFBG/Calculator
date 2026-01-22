let expression = [];
let containers = 0;

let lastEqual = false;

let priorityMultiDivisor = false;
let priorityElevateRoot = false;

const error = (message) => {
	ACFunction(true);
	document.getElementById('result').value = message;
};

const getLastElement = () =>
	expression.length === 0 ? '' : expression[expression.length - 1];
const isOperator = (value) =>
	['+', '-', '×', '÷', '^', '√', 'log'].includes(value);

const formatNumber = (n, decimals = 12) => {
	if (!isFinite(n)) return String(n);
	return String(parseFloat(Number(n).toFixed(decimals)));
};

const degToRad = (d) => (Number(d) * Math.PI) / 180;

const showExpression = () => {
	let displayArr = [...expression];

	let rootIndex = displayArr.indexOf('√');

	if (rootIndex !== -1) {
		let radicandStart = rootIndex - 1;
		if (displayArr[rootIndex - 1] === ')') {
			let count = 0;
			for (let j = rootIndex - 1; j >= 0; j--) {
				if (displayArr[j] === ')') count++;
				if (displayArr[j] === '(') count--;
				if (count === 0) {
					radicandStart = j;
					break;
				}
			}
		}
		const radicand = displayArr.slice(radicandStart, rootIndex);

		let indexEnd = rootIndex + 1;
		if (indexEnd < displayArr.length) {
			if (displayArr[indexEnd] === '(') {
				let count = 0;
				let foundMatch = false;
				for (let j = indexEnd; j < displayArr.length; j++) {
					if (displayArr[j] === '(') count++;
					if (displayArr[j] === ')') count--;
					if (count === 0) {
						indexEnd = j;
						foundMatch = true;
						break;
					}
				}
				// Se não encontrar o ')', define o fim como o último elemento do array
				if (!foundMatch) {
					indexEnd = displayArr.length - 1;
				}
			}
		} else {
			indexEnd = rootIndex;
		}

		const indexVal = displayArr.slice(rootIndex + 1, indexEnd + 1);

		displayArr.splice(
			radicandStart,
			indexEnd - radicandStart + 1,
			...indexVal,
			'√',
			...radicand,
		);
	}

	let expStr = displayArr.join('');
	if (expStr === '') {
		expStr = '0';
	}

	console.log('Expressão:', expStr);

	document.getElementById('result').value = expStr;
};

const addExpression = (value) => {
	if (isOperator(value) && isOperator(getLastElement())) {
		expression[expression.length - 1] = value;
	} else {
		if (expression.length === 0 || getLastElement() === '(')
			expression.push('0');

		if (getLastElement() !== '(' && getLastElement() !== ')')
			expression[expression.length - 1] = String(
				Number(getLastElement()),
			);
		expression.push(value);
	}
	showExpression();
	lastEqual = false;
};

const addNumber = (number) => {
	if (typeof number !== 'number' || isNaN(number)) {
		error('Número inválido');
		return;
	} else {
		if (lastEqual) {
			expression = [];
			lastEqual = false;
		}

		if (expression.length > 0 && !isNaN(getLastElement())) {
			if (getLastElement() === '0' && number === 0) {
				return;
			} else if (getLastElement() === '0' && number !== 0) {
				expression[expression.length - 1] = String(number);
			} else {
				expression[expression.length - 1] =
					`${getLastElement()}${number}`;
			}
		} else {
			if (getLastElement() === ')') addExpression('×');
			expression.push(String(number));
		}
	}
	showExpression();
};

const ACFunction = (error = false) => {
	expression = [];
	containers = 0;
	showExpression();
	if (!error) console.clear();
};

const CEFunction = () => {
	const item = expression.pop();
	if (item === '(') {
		containers--;
	} else if (item === ')') {
		containers++;
	}
	showExpression();
};

const decimalFunction = () => {
	if (!getLastElement().includes('.')) {
		if (!isNaN(getLastElement())) {
			expression[expression.length - 1] = `${getLastElement()}.`;
		} else {
			expression.push('0.');
		}
	}
	showExpression();
};

const negativate = () => {
	if (expression.length > 0 && !isNaN(getLastElement())) {
		expression[expression.length - 1] = formatNumber(
			Number(getLastElement()) * -1,
		);
	}
	showExpression();
};

const openContainer = () => {
	if (
		isOperator(getLastElement()) ||
		getLastElement() === '(' ||
		expression.length === 0
	) {
		expression.push('(');
	} else {
		addExpression('×');
		expression.push('(');
	}
	containers++;
	showExpression();
};

const closeContainer = () => {
	if (containers > 0) {
		if (isOperator(getLastElement())) expression.pop();
		expression.push(')');
		containers--;
	}
	showExpression();
};

const percentage = () => {
	if (expression.length > 0 && !isNaN(getLastElement())) {
		if (expression.length >= 3) {
			if (
				expression[expression.length - 2] === '+' ||
				expression[expression.length - 2] === '-'
			) {
				expression[expression.length - 1] = formatNumber(
					(expression[expression.length - 3] *
						Number(getLastElement())) /
						100,
				);
				showExpression();
				return;
			}
		}
		expression[expression.length - 1] = formatNumber(
			Number(getLastElement()) / 100,
		);
	}
	showExpression();
};

const sinFunction = () => {
	if (expression.length > 0) {
		for (let i = expression.length - 1; i >= 0; i--) {
			if (!isNaN(expression[i])) {
				expression[i] = formatNumber(
					Math.sin(degToRad(Number(expression[i]))),
				);
				break;
			}
		}
	}
	showExpression();
};

const cosFunction = () => {
	if (expression.length > 0) {
		for (let i = expression.length - 1; i >= 0; i--) {
			if (!isNaN(expression[i])) {
				console.log('Cosseno de', expression[i]);
				expression[i] = formatNumber(
					Math.cos(degToRad(Number(expression[i]))),
				);
				break;
			}
		}
	}
	showExpression();
};

const tanFunction = () => {
	if (expression.length > 0) {
		for (let i = expression.length - 1; i >= 0; i--) {
			if (!isNaN(expression[i])) {
				if (
					Math.abs(Math.cos(degToRad(Number(expression[i])))) < 1e-12
				) {
					error('Tangente indefinida');
					return;
				}
				expression[i] = formatNumber(
					Math.tan(degToRad(Number(expression[i]))),
				);
				break;
			}
		}
	}
	showExpression();
};

const factorial = () => {
	if (expression.length > 0) {
		for (let i = expression.length - 1; i >= 0; i--) {
			if (!isNaN(expression[i])) {
				let num = Number(expression[i]);
				let fact = 1;
				for (let j = 1; j <= num; j++) {
					fact *= j;
				}
				expression[i] = formatNumber(fact);
				break;
			}
		}
	}
	showExpression();
};

const eulerConstant = () => {
	if (
		isOperator(getLastElement()) ||
		expression.length === 0 ||
		getLastElement() === '('
	) {
		expression.push(formatNumber(Math.E));
	} else if (getLastElement() === ')') {
		addExpression('×');
		expression.push(formatNumber(Math.E));
	} else {
		CEFunction();
		expression.push(formatNumber(Math.E));
	}
	showExpression();
};

const piConstant = () => {
	if (
		isOperator(getLastElement()) ||
		expression.length === 0 ||
		getLastElement() === '('
	) {
		expression.push(formatNumber(Math.PI));
	} else if (getLastElement() === ')') {
		addExpression('×');
		expression.push(formatNumber(Math.PI));
	} else {
		CEFunction();
		expression.push(formatNumber(Math.PI));
	}
	showExpression();
};

const solve = (expression) => {
	let exp = expression;
	console.log('Recebi a expressão:', exp.join(' '));
	if (exp.length === 1) return exp;

	// Parenthesis
	if (exp.includes('(')) {
		let parenthesisStart = -1;
		let parenthesisEnd = -1;
		for (let i = 0; i < exp.length; i++) {
			if (exp[i] === '(') {
				parenthesisStart = i;
				console.log(
					'Encontrada abertura de parênteses em:',
					parenthesisStart,
				);
				break;
			}
		}

		for (let i = exp.length - 1; i >= 0; i--) {
			console.log(exp[i]);
			if (exp[i] === ')') {
				parenthesisEnd = i;
				console.log(
					'Encontrado fechamento de parênteses em:',
					parenthesisEnd,
				);
				break;
			}
		}

		console.log(
			'Resolvendo parênteses:',
			exp.slice(parenthesisStart + 1, parenthesisEnd).join(' '),
		);
		exp[parenthesisStart] = solve(
			exp.slice(parenthesisStart + 1, parenthesisEnd),
		);
		exp.splice(parenthesisStart + 1, parenthesisEnd - parenthesisStart);
	}
	if (exp.length === 1) return exp;

	// Logarithm
	while (exp.includes('log')) {
		let logIndex = exp.indexOf('log');
		let result = formatNumber(
			Math.log(exp[logIndex - 1], exp[logIndex + 1]),
		);
		exp[logIndex - 1] = result;
		exp.splice(logIndex, 2);
	}

	console.log('Após logaritmo:', exp.join(' '));
	if (exp.length === 1) return exp;

	// Root
	while (exp.includes('√')) {
		let rootIndex = exp.indexOf('√');
		let result = formatNumber(
			Math.pow(
				Number(exp[rootIndex - 1]),
				1 / Number(exp[rootIndex + 1]),
			),
		);
		exp[rootIndex - 1] = result;
		exp.splice(rootIndex, 2);
	}

	console.log('Após raiz:', exp.join(' '));
	if (exp.length === 1) return exp;

	// Exponentiation
	while (exp.includes('^')) {
		let expIndex = exp.indexOf('^');
		let result = formatNumber(
			Math.pow(Number(exp[expIndex - 1]), Number(exp[expIndex + 1])),
		);
		exp[expIndex - 1] = result;
		exp.splice(expIndex, 2);
	}

	console.log('Após exponenciação:', exp.join(' '));
	if (exp.length === 1) return exp;

	// Division
	while (exp.includes('÷')) {
		let divIndex = exp.indexOf('÷');
		let result = formatNumber(
			Number(exp[divIndex - 1]) / Number(exp[divIndex + 1]),
		);
		exp[divIndex - 1] = result;
		exp.splice(divIndex, 2);
	}

	console.log('Após divisão:', exp.join(' '));
	if (exp.length === 1) return exp;

	// Multiplication
	while (exp.includes('×')) {
		let multIndex = exp.indexOf('×');
		let result = formatNumber(
			Number(exp[multIndex - 1]) * Number(exp[multIndex + 1]),
		);
		exp[multIndex - 1] = result;
		exp.splice(multIndex, 2);
	}

	console.log('Após multiplicação:', exp.join(' '));
	if (exp.length === 1) return exp;

	// Subtraction
	while (exp.includes('-')) {
		let subIndex = exp.indexOf('-');
		let result = formatNumber(
			Number(exp[subIndex - 1]) - Number(exp[subIndex + 1]),
		);
		exp[subIndex - 1] = result;
		exp.splice(subIndex, 2);
	}

	console.log('Após subtração:', exp.join(' '));
	if (exp.length === 1) return exp;

	// Addition
	while (exp.includes('+')) {
		let addIndex = exp.indexOf('+');
		let result = formatNumber(
			Number(exp[addIndex - 1]) + Number(exp[addIndex + 1]),
		);
		exp[addIndex - 1] = result;
		exp.splice(addIndex, 2);
	}

	console.log('Após adição:', exp.join(' '));

	return exp;
};

const equal = () => {
	if (expression.length === 0) return;

	while (containers > 0) {
		closeContainer();
	}

	expression = solve(expression);

	if (expression.length === 1) {
		showExpression();
		lastEqual = true;
	} else {
		error('Erro no cálculo');
	}

	lastEqual = true;
};

/*
const equal = () => {
	while (containers > 0) {
		closeContainer();
	}

	let startIndex = 0;

	let firstNumIndex = -1;
	let operatorIndex = -1;
	let secondNumIndex = -1;

	while (expression.length > 1) {
		console.log('---------');

		firstNumIndex = startIndex;
		console.log(
			`Primeiro Índice: ${firstNumIndex}. Valor: ${expression[firstNumIndex]}`,
		);
		if (expression[firstNumIndex] === '(') {
			startIndex++;
			continue;
		}

		operatorIndex = firstNumIndex + 1;
		console.log(
			`Índice do Operador: ${operatorIndex}. Valor: ${expression[operatorIndex]}`,
		);
		if (expression[operatorIndex] === ')') {
			expression.splice(operatorIndex, 1);
			expression.splice(firstNumIndex - 1, 1);
			startIndex -= 3;
			if (startIndex < 0) startIndex = 0;
			continue;
		}

		secondNumIndex = operatorIndex + 1;
		console.log(
			`Segundo Índice: ${secondNumIndex}. Valor: ${expression[secondNumIndex]}`,
		);
		if (secondNumIndex >= expression.length) {
			expression.pop();
			continue;
		}

		if (expression[secondNumIndex] === '(') {
			startIndex += 3;
			continue;
		}

		switch (expression[operatorIndex]) {
			case '+':
				if (
					expression[secondNumIndex + 1] === '×' ||
					expression[secondNumIndex + 1] === '÷'
				) {
					priorityMultiDivisor = true;
					startIndex += 2;
					break;
				}

				if (
					expression[secondNumIndex + 1] === '^' ||
					expression[secondNumIndex + 1] === '√'
				) {
					priorityElevateRoot = true;
					startIndex += 2;
					break;
				}

				expression[firstNumIndex] = formatNumber(
					Number(expression[firstNumIndex]) +
						Number(expression[secondNumIndex]),
				);
				expression.splice(operatorIndex, 2);
				break;
			case '-':
				if (
					expression[secondNumIndex + 1] === '×' ||
					expression[secondNumIndex + 1] === '÷'
				) {
					priorityMultiDivisor = true;
					startIndex += 2;
					break;
				}

				if (
					expression[secondNumIndex + 1] === '^' ||
					expression[secondNumIndex + 1] === '√'
				) {
					priorityElevateRoot = true;
					startIndex += 2;
					break;
				}

				expression[firstNumIndex] = formatNumber(
					Number(expression[firstNumIndex]) -
						Number(expression[secondNumIndex]),
				);
				expression.splice(operatorIndex, 2);
				break;
			case '×':
				if (
					expression[secondNumIndex + 1] === '^' ||
					expression[secondNumIndex + 1] === '√'
				) {
					priorityElevateRoot = true;
					startIndex += 2;
					break;
				}

				expression[firstNumIndex] = formatNumber(
					Number(expression[firstNumIndex]) *
						Number(expression[secondNumIndex]),
				);

				if (priorityMultiDivisor) {
					priorityMultiDivisor = false;
					startIndex -= 2;
				}
				expression.splice(operatorIndex, 2);
				break;
			case '÷':
				if (
					expression[secondNumIndex + 1] === '^' ||
					expression[secondNumIndex + 1] === '√'
				) {
					priorityElevateRoot = true;
					startIndex += 2;
					break;
				}

				if (Number(expression[secondNumIndex]) === 0) {
					error('Divisão por zero');
					return;
				} else {
					expression[firstNumIndex] = formatNumber(
						Number(expression[firstNumIndex]) /
							Number(expression[secondNumIndex]),
					);
				}

				if (priorityMultiDivisor) {
					priorityMultiDivisor = false;
					startIndex -= 2;
				}
				expression.splice(operatorIndex, 2);
				break;
			case '^':
				expression[firstNumIndex] = formatNumber(
					Math.pow(
						Number(expression[firstNumIndex]),
						Number(expression[secondNumIndex]),
					),
				);

				if (priorityElevateRoot) {
					priorityElevateRoot = false;
					startIndex -= 2;
				}
				expression.splice(operatorIndex, 2);
				break;
			case '√':
				expression[firstNumIndex] = formatNumber(
					Math.pow(
						Number(expression[firstNumIndex]),
						1 / Number(expression[secondNumIndex]),
					),
				);

				if (priorityElevateRoot) {
					priorityElevateRoot = false;
					startIndex -= 2;
				}
				expression.splice(operatorIndex, 2);
				break;
			default:
				error('Operador inválido');
				return;
		}
	}

	showExpression();
	lastEqual = true;
};
*/

document.getElementById('body').onkeydown = function (e) {
	const key = e.key;

	if (key === ' ') return;

	if (!isNaN(key)) {
		e.preventDefault();
		addNumber(Number(key));
	} else {
		switch (key) {
			case '+':
				e.preventDefault();
				addExpression('+');
				break;
			case '-':
				e.preventDefault();
				addExpression('-');
				break;
			case '*':
				e.preventDefault();
				addExpression('×');
				break;
			case '/':
				e.preventDefault();
				addExpression('÷');
				break;
			case 'Enter':
				e.preventDefault();
				equal();
				break;
			case 'Backspace':
				e.preventDefault();
				CEFunction();
				break;
			case 'Delete':
			case 'Escape':
				e.preventDefault();
				ACFunction();
				break;
			case '.':
			case ',':
				e.preventDefault();
				decimalFunction();
				break;
			case '%':
				e.preventDefault();
				percentage();
				break;
			case '(':
				e.preventDefault();
				openContainer();
				break;
			case ')':
				e.preventDefault();
				closeContainer();
				break;
			case 'r':
				e.preventDefault();
				negativate();
				break;
			case '^':
				e.preventDefault();
				addExpression('^');
				break;
			case 'v':
				e.preventDefault();
				addExpression('√');
				break;
			default:
				break;
		}
	}
};
