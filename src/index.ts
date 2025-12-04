/**
 * Interface for the result of formula evaluation
 */
export interface EvaluationResult {
  result: number;
  variables: string[];
}

/**
 * Interface for variable assignments
 */
export interface VariableAssignment {
  [variable: string]: number;
}

/**
 * Formula evaluator class that parses mathematical expressions 
 * and evaluates them with given variable values
 */
export class FormulaEvaluator {
  private static readonly OPERATORS = ['+', '-', '*', '/', '(', ')', '^'];
  private static readonly PRECEDENCE: { [key: string]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
  };

  /**
   * Extract all alphabetical variables (including underscores) from a formula
   */
  private static extractVariables(formula: string): string[] {
    const variables = new Set<string>();
    let i = 0;
    
    while (i < formula.length) {
      if (/[a-zA-Z]/.test(formula[i])) {
        let variable = '';
        while (i < formula.length && /[a-zA-Z_]/.test(formula[i])) {
          variable += formula[i];
          i++;
        }
        variables.add(variable);
      } else {
        i++;
      }
    }
    
    return Array.from(variables).sort();
  }

  /**
   * Tokenize the formula into numbers, variables, and operators
   */
  private static tokenize(formula: string): string[] {
    const tokens: string[] = [];
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
        tokens.push(number);
      }
      // Variables (consecutive alphabetical characters and underscores)
      else if (/[a-zA-Z]/.test(formula[i])) {
        let variable = '';
        while (i < formula.length && /[a-zA-Z_]/.test(formula[i])) {
          variable += formula[i];
          i++;
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

  /**
   * Convert infix notation to postfix notation using Shunting Yard algorithm
   */
  private static toPostfix(tokens: string[]): string[] {
    const output: string[] = [];
    const operators: string[] = [];

    for (const token of tokens) {
      // Numbers and variables go directly to output
      if (/^\d+\.?\d*$/.test(token) || /^[a-zA-Z_]+$/.test(token)) {
        output.push(token);
      }
      // Left parenthesis
      else if (token === '(') {
        operators.push(token);
      }
      // Right parenthesis
      else if (token === ')') {
        while (operators.length > 0 && operators[operators.length - 1] !== '(') {
          output.push(operators.pop()!);
        }
        if (operators.length === 0) {
          throw new Error('Mismatched parentheses');
        }
        operators.pop(); // Remove the '('
      }
      // Operators
      else if (token in this.PRECEDENCE) {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== '(' &&
          this.PRECEDENCE[operators[operators.length - 1]] >= this.PRECEDENCE[token]
        ) {
          output.push(operators.pop()!);
        }
        operators.push(token);
      }
      else {
        throw new Error(`Unknown token: ${token}`);
      }
    }

    // Pop remaining operators
    while (operators.length > 0) {
      const op = operators.pop()!;
      if (op === '(' || op === ')') {
        throw new Error('Mismatched parentheses');
      }
      output.push(op);
    }

    return output;
  }

  /**
   * Evaluate a postfix expression
   */
  private static evaluatePostfix(postfix: string[], variables: VariableAssignment): number {
    const stack: number[] = [];

    for (const token of postfix) {
      // Numbers
      if (/^\d+\.?\d*$/.test(token)) {
        stack.push(parseFloat(token));
      }
      // Variables
      else if (/^[a-zA-Z_]+$/.test(token)) {
        if (!(token in variables)) {
          throw new Error(`Variable '${token}' not provided`);
        }
        stack.push(variables[token]);
      }
      // Operators
      else if (token in this.PRECEDENCE) {
        if (stack.length < 2) {
          throw new Error(`Insufficient operands for operator '${token}'`);
        }
        const b = stack.pop()!;
        const a = stack.pop()!;
        
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
      else {
        throw new Error(`Unknown token in postfix: ${token}`);
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }

    return stack[0];
  }

  /**
   * Main evaluation method
   * @param formula Mathematical formula as a string
   * @param values Array of values corresponding to variables in alphabetical order
   * @returns EvaluationResult containing the computed result and variable names
   */
  static evaluate(formula: string, values: number[]): EvaluationResult {
    try {
      // Extract variables from the formula
      const variables = this.extractVariables(formula);
      
      // Validate that we have the correct number of values
      if (variables.length !== values.length) {
        throw new Error(
          `Expected ${variables.length} values for variables [${variables.join(', ')}], but got ${values.length}`
        );
      }

      // Create variable assignment map
      const assignment: VariableAssignment = {};
      variables.forEach((variable, index) => {
        assignment[variable] = values[index];
      });

      // Tokenize, convert to postfix, and evaluate
      const tokens = this.tokenize(formula);
      const postfix = this.toPostfix(tokens);
      const result = this.evaluatePostfix(postfix, assignment);

      return {
        result,
        variables
      };
    } catch (error) {
      throw new Error(`Formula evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get all variables from a formula without evaluating
   * @param formula Mathematical formula as a string
   * @returns Array of variable names in alphabetical order
   */
  static getVariables(formula: string): string[] {
    return this.extractVariables(formula);
  }
}

/**
 * Convenience function for formula evaluation
 * @param formula Mathematical formula as a string
 * @param values Array of values corresponding to variables in alphabetical order
 * @returns The computed result as a number
 */
export function evaluateFormula(formula: string, values: number[]): number {
  return FormulaEvaluator.evaluate(formula, values).result;
}

/**
 * Get variables from a formula
 * @param formula Mathematical formula as a string
 * @returns Array of variable names in alphabetical order
 */
export function getFormulaVariables(formula: string): string[] {
  return FormulaEvaluator.getVariables(formula);
}