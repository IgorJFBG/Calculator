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
            (indexEnd - radicandStart) + 1, 
            ...indexVal, 
            '√', 
            ...radicand
        );
    }

	let expStr = displayArr.join(' ');
	if (expStr === '') {
		expStr = '0';
	}

	console.log('Expressão:', expStr);
    console.log('Containers:', containers);

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
    containers = 0;
	showExpression();
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
				error('Erro: Operador inválido');
				return;
		}
	}

	showExpression();
	lastEqual = true;
};

document.getElementById('body').onkeydown = function (e) {
    const key = e.key;

    if (!isNaN(key)) {
        e.preventDefault();
        addNumber(Number(key));
    } else {
        switch(key) {
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
                console.log('Tecla não mapeada:', key);
                break;
        }
    }

}