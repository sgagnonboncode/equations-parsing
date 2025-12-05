// Browser-compatible build of FormulaEvaluator
// Generated from TypeScript source

class FormulaEvaluator {
    static OPERATORS = ['+', '-', '*', '/', '(', ')', '^', 'sqrt'];
    static PRECEDENCE = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3,
        'sqrt': 4
    };

    static extractVariables(formula) {
        const variables = new Set();
        let i = 0;
        
        while (i < formula.length) {
            if (/[a-zA-Z]/.test(formula[i])) {
                let variable = '';
                while (i < formula.length && /[a-zA-Z_]/.test(formula[i])) {
                    variable += formula[i];
                    i++;
                }
                if (variable !== 'sqrt') {
                    variables.add(variable);
                }
            } else {
                i++;
            }
        }
        
        return Array.from(variables).sort();
    }

    static tokenize(formula) {
        const tokens = [];
        let i = 0;
        
        while (i < formula.length) {
            if (formula[i] === ' ') {
                i++;
                continue;
            }
            
            // Numbers (including decimals)
            if (/\d/.test(formula[i])) {
                let number = '';
                while (i < formula.length && (/\d/.test(formula[i]) || formula[i] === '.')) {
                    number += formula[i];
                    i++;
                }
                
                // Check if number is immediately followed by a letter (invalid: 5a, 9b, etc.)
                if (i < formula.length && /[a-zA-Z]/.test(formula[i])) {
                    throw new Error(`Invalid token: ${number}${formula[i]}. Numbers cannot be directly followed by letters.`);
                }
                
                tokens.push(number);
            }
            // Variables (consecutive alphabetical characters and underscores)
            else if (/[a-zA-Z]/.test(formula[i])) {
                let variable = '';
                let hasInvalidSequence = false;
                
                while (i < formula.length && /[a-zA-Z_0-9]/.test(formula[i])) {
                    if (/\d/.test(formula[i]) && variable.length > 0) {
                        // Found a number after letters - this is invalid
                        hasInvalidSequence = true;
                    }
                    variable += formula[i];
                    i++;
                }
                
                // Check for invalid patterns like mixing letters and numbers
                if (hasInvalidSequence || /\d/.test(variable)) {
                    throw new Error(`Invalid variable name: ${variable}. Variable names can only contain letters and underscores.`);
                }
                
                tokens.push(variable);
            }
            // Operators and parentheses
            else if (this.OPERATORS.includes(formula[i])) {
                tokens.push(formula[i]);
                i++;
            }
            else {
                throw new Error(`Invalid character in formula: ${formula[i]}`);
            }
        }
        
        return tokens;
    }

    static toPostfix(tokens) {
        const output = [];
        const operators = [];

        for (const token of tokens) {
            if (/^\d+\.?\d*$/.test(token) || (/^[a-zA-Z_]+$/.test(token) && token !== 'sqrt')) {
                output.push(token);
            }
            else if (token === 'sqrt') {
                operators.push(token);
            }
            else if (token === '(') {
                operators.push(token);
            }
            else if (token === ')') {
                while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                    output.push(operators.pop());
                }
                if (operators.length === 0) {
                    throw new Error('Mismatched parentheses');
                }
                operators.pop();
            }
            else if (token in this.PRECEDENCE) {
                if (token === 'sqrt') {
                    operators.push(token);
                } else {
                    while (
                        operators.length > 0 &&
                        operators[operators.length - 1] !== '(' &&
                        this.PRECEDENCE[operators[operators.length - 1]] >= this.PRECEDENCE[token]
                    ) {
                        output.push(operators.pop());
                    }
                    operators.push(token);
                }
            }
            else {
                throw new Error(`Unknown token: ${token}`);
            }
        }

        while (operators.length > 0) {
            const op = operators.pop();
            if (op === '(' || op === ')') {
                throw new Error('Mismatched parentheses');
            }
            output.push(op);
        }

        return output;
    }

    static evaluatePostfix(postfix, variables) {
        const stack = [];

        for (const token of postfix) {
            if (/^\d+\.?\d*$/.test(token)) {
                stack.push(parseFloat(token));
            }
            else if (/^[a-zA-Z_]+$/.test(token) && token !== 'sqrt') {
                if (!(token in variables)) {
                    throw new Error(`Variable '${token}' not provided`);
                }
                stack.push(variables[token]);
            }
            else if (token in this.PRECEDENCE) {
                if (token === 'sqrt') {
                    if (stack.length < 1) {
                        throw new Error(`Insufficient operands for sqrt function`);
                    }
                    const a = stack.pop();
                    if (a < 0) {
                        throw new Error('Cannot take square root of negative number');
                    }
                    stack.push(Math.sqrt(a));
                } else {
                    if (stack.length < 2) {
                        throw new Error(`Insufficient operands for operator '${token}'`);
                    }
                    const b = stack.pop();
                    const a = stack.pop();
                    
                    switch (token) {
                        case '+':
                            stack.push(a + b);
                            break;
                        case '-':
                            stack.push(a - b);
                            break;
                        case '*':
                            stack.push(a * b);
                            break;
                        case '/':
                            if (b === 0) {
                                throw new Error('Division by zero');
                            }
                            stack.push(a / b);
                            break;
                        case '^':
                            stack.push(Math.pow(a, b));
                            break;
                        default:
                            throw new Error(`Unknown operator: ${token}`);
                    }
                }
            }
            else {
                throw new Error(`Unknown token in postfix: ${token}`);
            }
        }

        if (stack.length !== 1) {
            throw new Error('Invalid expression');
        }

        return stack[0];
    }

    static evaluate(formula, values) {
        try {
            const variables = this.extractVariables(formula);
            
            if (variables.length !== values.length) {
                throw new Error(
                    `Expected ${variables.length} values for variables [${variables.join(', ')}], but got ${values.length}`
                );
            }

            const assignment = {};
            variables.forEach((variable, index) => {
                assignment[variable] = values[index];
            });

            const tokens = this.tokenize(formula);
            const postfix = this.toPostfix(tokens);
            const result = this.evaluatePostfix(postfix, assignment);

            return {
                result,
                variables
            };
        } catch (error) {
            throw new Error(`Formula evaluation failed: ${error.message}`);
        }
    }

    static getVariables(formula) {
        return this.extractVariables(formula);
    }

    static validateFormula(formula) {
        try {
            if (!formula || formula.trim().length === 0) {
                return false;
            }

            this.extractVariables(formula);
            
            const tokens = this.tokenize(formula);
            
            if (tokens.length === 0) {
                return false;
            }
            
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const prevToken = i > 0 ? tokens[i - 1] : null;
                const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
                
                if (['+', '-', '*', '/', '^'].includes(token)) {
                    if (i === 0) return false;
                    if (i === tokens.length - 1) return false;
                    if (prevToken && ['+', '-', '*', '/', '^'].includes(prevToken)) return false;
                }
                
                if (token === '(') {
                    if (prevToken && /^[a-zA-Z_0-9.]+$/.test(prevToken) && prevToken !== 'sqrt') {
                        return false;
                    }
                }
                
                if (token === 'sqrt') {
                    if (!nextToken || nextToken !== '(') return false;
                    if (i + 2 < tokens.length && tokens[i + 2] === ')') return false;
                }
                
                // Check for consecutive operands (variables/numbers without operators)
                if (/^[a-zA-Z_]+$/.test(token) || /^\d+\.?\d*$/.test(token)) {
                    // If this is a variable or number, check if the next token is also a variable/number
                    if (nextToken && (/^[a-zA-Z_]+$/.test(nextToken) || /^\d+\.?\d*$/.test(nextToken))) {
                        return false; // Two consecutive operands without operator
                    }
                }
            }
            
            this.toPostfix(tokens);
            
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Export functions for global use
window.evaluateFormula = function(formula, values) {
    return FormulaEvaluator.evaluate(formula, values).result;
};

window.getFormulaVariables = function(formula) {
    return FormulaEvaluator.getVariables(formula);
};

window.validateFormula = function(formula) {
    return FormulaEvaluator.validateFormula(formula);
};