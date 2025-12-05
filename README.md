# Formula Evaluator

A TypeScript module for parsing and evaluating mathematical formulas with alphabetical variables.

## 🚀 Live Demo

**[Try the Interactive Demo](https://sgagnonboncode.github.io/equations-parsing/)**

The demo website showcases all features with real-time validation, dynamic variable inputs, and live calculations.

## Features

- Parse mathematical formulas with variables represented by consecutive alphabetical characters and underscores
- Support for basic arithmetic operations: `+`, `-`, `*`, `/`, `^` (power), `sqrt` (square root)
- Support for parentheses for operation precedence
- Multi-character variable names (e.g., `alpha`, `beta`, `gamma`)
- Automatic variable extraction and sorting
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
const values = [2, 3, 4];  // a=2, b=3, c=4
const result = evaluateFormula(formula, values);
console.log(result); // 14

// Get variables from formula
const variables = getFormulaVariables(formula);
console.log(variables); // ['a', 'b', 'c']
```

### Advanced Usage

```typescript
import { FormulaEvaluator, validateFormula } from './src/index';

// Validate formula before evaluation
const formula = '(alpha + beta) * gamma ^ 2';
if (validateFormula(formula)) {
  const values = [5, 3, 2];  // alpha=5, beta=3, gamma=2
  const result = FormulaEvaluator.evaluate(formula, values);
  console.log(result);
  // {
  //   result: 32,
  //   variables: ['alpha', 'beta', 'gamma']
  // }
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

Variables are automatically extracted and sorted alphabetically. Values must be provided in the same order as the sorted variable names.

## API Reference

### Functions

- `evaluateFormula(formula: string, values: number[]): number` - Evaluate a formula and return the result
- `getFormulaVariables(formula: string): string[]` - Get variable names from a formula
- `validateFormula(formula: string): boolean` - Check if a formula is valid without evaluating it

### Classes

- `FormulaEvaluator.evaluate(formula: string, values: number[]): EvaluationResult` - Get detailed evaluation result
- `FormulaEvaluator.getVariables(formula: string): string[]` - Extract variables from formula  
- `FormulaEvaluator.validateFormula(formula: string): boolean` - Validate formula syntax

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
- Missing variable values
- Invalid expressions

## Examples

```typescript
// Basic arithmetic
evaluateFormula('a + b', [5, 3]); // 8

// With parentheses
evaluateFormula('(a + b) * c', [2, 3, 4]); // 20

// Power operation
evaluateFormula('a ^ b + c', [2, 3, 1]); // 9

// Square root
evaluateFormula('sqrt(a) + b', [16, 4]); // 8

// Multi-character variables with underscores
evaluateFormula('Temperature_fahrenheit * conversion_factor', [68, 1.8]); // 122.4
```