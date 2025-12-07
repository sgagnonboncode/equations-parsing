# Formula Evaluator

A TypeScript module for parsing and evaluating mathematical formulas with alphabetical variables.

## 🚀 Live Demo

**[Try the Interactive Demo](https://sgagnonboncode.github.io/equations-parsing/)**

## Features

- Parse mathematical formulas with variables represented by consecutive alphabetical characters and underscores
- Support for basic arithmetic operations: `+`, `-`, `*`, `/`, `^` (power), `sqrt` (square root)
- Support for parentheses for operation precedence
- Multi-character variable names (e.g., `alpha`, `beta`, `gamma`)
- Dictionary-based variable assignment for clear, order-independent input
- Real-time formula validation and interactive debugging
- Type-safe TypeScript implementation

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Example

```typescript
import { evaluateFormula, getFormulaVariables } from './src/index';

// Simple formula
const formula = 'a + b * c';
const variables = {a: 2, b: 3, c: 4};  // Clear variable assignments
const result = evaluateFormula(formula, variables);
console.log(result); // 14

// Get variables from formula
const variableNames = getFormulaVariables(formula);
console.log(variableNames); // ['a', 'b', 'c']
```

### Advanced Usage

```typescript
import { FormulaEvaluator, validateFormula, getFormulaVariables } from './src/index';

// Validate formula before evaluation
const formula = '(alpha + beta) * gamma ^ 2';
if (validateFormula(formula)) {
  const variables = {alpha: 5, beta: 3, gamma: 2};  // Named variable assignments
  const result = FormulaEvaluator.evaluate(formula, variables);
  console.log(result); // 32
  
  // Get variable names separately if needed
  const variableNames = getFormulaVariables(formula);
  console.log(variableNames); // ['alpha', 'beta', 'gamma']
} else {
  console.log('Invalid formula syntax');
}
```

## Supported Operations

- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Power: `^`
- Square root: `sqrt`
- Parentheses: `(`, `)`

## Variable Naming

Variables must be consecutive alphabetical characters and underscores:
- Single letters: `a`, `b`, `c`, `x`, `y`, `z`
- Multi-character: `alpha`, `beta`, `gamma`, `temp_celsius`
- With underscores: `Temperature_fahrenheit`, `var_name`, `my_variable`

Variables are automatically extracted and sorted alphabetically. Values are provided as an object with variable names as keys and their numeric values.

## API Reference

### Functions

- `FormulaEvaluator.evaluate(formula: string, variables: VariableAssignment): number` - Evaluate a formula and return the result
- `FormulaEvaluator.getVariables(formula: string): string[]` - Extract variables from formula  
- `FormulaEvaluator.validateFormula(formula: string): boolean` - Validate formula syntax

### Types

- `VariableAssignment` - Object mapping variable names to numeric values: `{[key: string]: number}`

## Validation

The `validateFormula()` function checks for:
- Valid token sequences (no consecutive operators)
- Proper parentheses matching
- Correct sqrt function usage (`sqrt(expression)`)
- Valid operator placement (not at start/end)
- Empty formulas and invalid characters

```typescript
// Valid formulas
validateFormula('a + b');           // true
validateFormula('sqrt(a) + b');     // true
validateFormula('(a + b) * c');     // true

// Invalid formulas  
validateFormula('a +');             // false (operator at end)
validateFormula('sqrt');            // false (incomplete function)
validateFormula('a + + b');         // false (consecutive operators)
validateFormula('(a + b');          // false (mismatched parentheses)
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode compilation
- `npm run test` - Run test cases

## Error Handling

The module provides detailed error messages for:
- Invalid characters in formulas
- Mismatched parentheses
- Division by zero
- Missing variable values (variables not provided in the assignment object)
- Invalid expressions

## Examples

```typescript
// Basic arithmetic
evaluateFormula('a + b', {a: 5, b: 3}); // 8

// With parentheses  
evaluateFormula('(a + b) * c', {a: 2, b: 3, c: 4}); // 20

// Power operation
evaluateFormula('a ^ b + c', {a: 2, b: 3, c: 1}); // 9

// Square root
evaluateFormula('sqrt(a) + b', {a: 16, b: 4}); // 8

// Complex nested formula
evaluateFormula('sqrt((a + b) ^ 2 + c * d) / (e - f) + sqrt(g)', {
  a: 3, b: 4, c: 5, d: 6, e: 10, f: 2, g: 16
}); // ~5.111

// Multi-character variables with underscores
evaluateFormula('Temperature_fahrenheit * conversion_factor', {
  Temperature_fahrenheit: 68, 
  conversion_factor: 1.8
}); // 122.4
```

## References

- [Shunting Yard Algorithm - Brilliant.org](https://brilliant.org/wiki/shunting-yard-algorithm)