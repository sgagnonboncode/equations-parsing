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
  private static readonly OPERATORS = ['+', '-', '*', '/', '(', ')', '^', 'sqrt'];
  private static readonly PRECEDENCE: { [key: string]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
    'sqrt': 4
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
        // Don't include sqrt as a variable
        if (variable !== 'sqrt') {
          variables.add(variable);
        }
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

  /**
   * Convert infix notation to postfix notation using Shunting Yard algorithm
   */
  private static toPostfix(tokens: string[]): string[] {
    const output: string[] = [];
    const operators: string[] = [];

    for (const token of tokens) {
      // Numbers and variables go directly to output
      if (/^\d+\.?\d*$/.test(token) || (/^[a-zA-Z_]+$/.test(token) && token !== 'sqrt')) {
        output.push(token);
      }
      // sqrt function
      else if (token === 'sqrt') {
        operators.push(token);
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
        // sqrt is a unary function, handle it specially
        if (token === 'sqrt') {
          operators.push(token);
        } else {
          while (
            operators.length > 0 &&
            operators[operators.length - 1] !== '(' &&
            this.PRECEDENCE[operators[operators.length - 1]] >= this.PRECEDENCE[token]
          ) {
            output.push(operators.pop()!);
          }
          operators.push(token);
        }
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
      else if (/^[a-zA-Z_]+$/.test(token) && token !== 'sqrt') {
        if (!(token in variables)) {
          throw new Error(`Variable '${token}' not provided`);
        }
        stack.push(variables[token]);
      }
      // Operators
      else if (token in this.PRECEDENCE) {
        // Handle sqrt as unary operator
        if (token === 'sqrt') {
          if (stack.length < 1) {
            throw new Error(`Insufficient operands for sqrt function`);
          }
          const a = stack.pop()!;
          if (a < 0) {
            throw new Error('Cannot take square root of negative number');
          }
          stack.push(Math.sqrt(a));
        } else {
          // Handle binary operators
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

  /**
   * Validate if a formula is parsable without evaluating it
   * @param formula Mathematical formula as a string
   * @returns true if formula is valid and parsable, false otherwise
   */
  static validateFormula(formula: string): boolean {
    try {
      // Basic checks
      if (!formula || formula.trim().length === 0) {
        return false;
      }

      // Extract variables to validate the formula structure
      this.extractVariables(formula);
      
      // Tokenize the formula to check for valid tokens
      const tokens = this.tokenize(formula);
      
      // Check for basic token validity
      if (tokens.length === 0) {
        return false;
      }
      
      // Check for invalid token sequences
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const prevToken = i > 0 ? tokens[i - 1] : null;
        const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
        
        // Check for operators at invalid positions
        if (['+', '-', '*', '/', '^'].includes(token)) {
          // Operators cannot be at the start (except for unary minus, but we don't support that yet)
          if (i === 0) return false;
          // Operators cannot be at the end
          if (i === tokens.length - 1) return false;
          // Two consecutive operators (except certain cases)
          if (prevToken && ['+', '-', '*', '/', '^'].includes(prevToken)) return false;
        }
        
        // Check for invalid parenthesis placement
        if (token === '(') {
          // Opening parenthesis after variable/number without operator (except sqrt)
          if (prevToken && /^[a-zA-Z_0-9.]+$/.test(prevToken) && prevToken !== 'sqrt') {
            return false;
          }
        }
        
        // Check sqrt usage
        if (token === 'sqrt') {
          // sqrt must be followed by opening parenthesis
          if (!nextToken || nextToken !== '(') return false;
          
          // Check for empty sqrt parentheses - sqrt()
          if (i + 2 < tokens.length && tokens[i + 2] === ')') return false;
        }
      }
      
      // Convert to postfix to validate syntax and operator precedence
      this.toPostfix(tokens);
      
      // If we get here without exceptions, the formula is valid
      return true;
    } catch (error) {
      // Any parsing error means the formula is invalid
      return false;
    }
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

/**
 * Validate if a formula is parsable without evaluating it
 * @param formula Mathematical formula as a string
 * @returns true if formula is valid and parsable, false otherwise
 */
export function validateFormula(formula: string): boolean {
  return FormulaEvaluator.validateFormula(formula);
}