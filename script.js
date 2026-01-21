let expression = [];
let containers = 0;

let lastEqual = false;

let priorityMultiDivisor = false;
let priorityElevateRoot = false;

const error = (message) => {
	ACFunction();
	document.getElementById('result').value = message;
};

const getLastElement = () =>
	expression.length === 0 ? '' : expression[expression.length - 1];
const isOperator = (value) => ['+', '-', '×', '÷', '^', '√'].includes(value);

const formatNumber = (n, decimals = 12) => {
	if (!isFinite(n)) return String(n);
	return String(parseFloat(Number(n).toFixed(decimals)));
};

const showExpression = () => {
	let expStr = expression.join(' ');
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

const ACFunction = () => {
	expression = [];
	showExpression();
};

const CEFunction = () => {
	expression.pop();
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
	if (!isNaN(getLastElement())) {
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
	if (!isNaN(getLastElement())) {
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
					continue;
				}

				if (
					expression[secondNumIndex + 1] === '^' ||
					expression[secondNumIndex + 1] === '√'
				) {
					priorityElevateRoot = true;
					startIndex += 2;
					continue;
				}

				expression[firstNumIndex] = formatNumber(
					Number(expression[firstNumIndex]) +
						Number(expression[secondNumIndex]),
				);
				break;
			case '-':
				if (
					expression[secondNumIndex + 1] === '×' ||
					expression[secondNumIndex + 1] === '÷'
				) {
					priorityMultiDivisor = true;
					startIndex += 2;
					continue;
				}

				if (
					expression[secondNumIndex + 1] === '^' ||
					expression[secondNumIndex + 1] === '√'
				) {
					priorityElevateRoot = true;
					startIndex += 2;
					continue;
				}

				expression[firstNumIndex] = formatNumber(
					Number(expression[firstNumIndex]) -
						Number(expression[secondNumIndex]),
				);
				break;
			case '×':
				if (expression[secondNumIndex + 1] < expression.length) {
					if (
						expression[secondNumIndex + 1] === '^' ||
						expression[secondNumIndex + 1] === '√'
					) {
						priorityElevateRoot = true;
						startIndex += 2;
						continue;
					}
				}

				expression[firstNumIndex] = formatNumber(
					Number(expression[firstNumIndex]) *
						Number(expression[secondNumIndex]),
				);

				if (priorityMultiDivisor) {
					priorityMultiDivisor = false;
					startIndex -= 2;
				}
				break;
			case '÷':
				if (expression[secondNumIndex + 1] < expression.length) {
					if (
						expression[secondNumIndex + 1] === '^' ||
						expression[secondNumIndex + 1] === '√'
					) {
						priorityElevateRoot = true;
						startIndex += 2;
						continue;
					}
				}

				if (Number(expression[secondNumIndex]) === 0) {
					error('Erro: Divisão por zero');
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
				break;
			case '^':
				expression[firstNumIndex] = formatNumber(
					Math.pow(
						Number(expression[firstNumIndex]),
						Number(expression[secondNumIndex]),
					),
				);

				if (priorityMultiDivisor) {
					priorityMultiDivisor = false;
					startIndex -= 2;
				}

				if (priorityElevateRoot) {
					priorityElevateRoot = false;
					startIndex -= 2;
				}
				break;
			case '√':
				expression[firstNumIndex] = formatNumber(
					Math.pow(
						Number(expression[firstNumIndex]),
						1 / Number(expression[secondNumIndex]),
					),
				);

				if (priorityMultiDivisor) {
					priorityMultiDivisor = false;
					startIndex -= 2;
				}

				if (priorityElevateRoot) {
					priorityElevateRoot = false;
					startIndex -= 2;
				}
				break;
			default:
				error('Erro: Operador inválido');
				return;
		}

		expression.splice(operatorIndex, 2);
	}

	showExpression();
	lastEqual = true;
};
