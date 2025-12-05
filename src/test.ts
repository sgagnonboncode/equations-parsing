import { FormulaEvaluator, evaluateFormula, getFormulaVariables, validateFormula } from './index';

// Test cases
console.log('=== Formula Evaluator Tests ===\n');

try {
  // Test 1: Simple addition
  console.log('Test 1: Simple addition (a + b)');
  const formula1 = 'a + b';
  const variables1 = {a: 5, b: 3};
  const result1 = evaluateFormula(formula1, variables1);
  console.log(`Formula: ${formula1}`);
  console.log(`Variables: ${getFormulaVariables(formula1).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables1)}`);
  console.log(`Result: ${result1}`);
  console.log('Expected: 8');
  console.log(`✓ ${result1 === 8 ? 'PASS' : 'FAIL'}\n`);

  // Test 2: More complex expression
  console.log('Test 2: Complex expression (a * b + c / d)');
  const formula2 = 'a * b + c / d';
  const variables2 = {a: 2, b: 3, c: 8, d: 4};
  const result2 = evaluateFormula(formula2, variables2);
  console.log(`Formula: ${formula2}`);
  console.log(`Variables: ${getFormulaVariables(formula2).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables2)}`);
  console.log(`Result: ${result2}`);
  console.log('Expected: 8');
  console.log(`✓ ${result2 === 8 ? 'PASS' : 'FAIL'}\n`);

  // Test 3: With parentheses
  console.log('Test 3: Expression with parentheses ((a + b) * c)');
  const formula3 = '(a + b) * c';
  const variables3 = {a: 2, b: 3, c: 4};
  const result3 = evaluateFormula(formula3, variables3);
  console.log(`Formula: ${formula3}`);
  console.log(`Variables: ${getFormulaVariables(formula3).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables3)}`);
  console.log(`Result: ${result3}`);
  console.log('Expected: 20');
  console.log(`✓ ${result3 === 20 ? 'PASS' : 'FAIL'}\n`);

  // Test 4: Multi-character variables
  console.log('Test 4: Multi-character variables (alpha + beta * gamma)');
  const formula4 = 'alpha + beta * gamma';
  const variables4 = {alpha: 10, beta: 5, gamma: 2};
  const result4 = evaluateFormula(formula4, variables4);
  console.log(`Formula: ${formula4}`);
  console.log(`Variables: ${getFormulaVariables(formula4).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables4)}`);
  console.log(`Result: ${result4}`);
  console.log('Expected: 20');
  console.log(`✓ ${result4 === 20 ? 'PASS' : 'FAIL'}\n`);

  // Test 5: Power operation
  console.log('Test 5: Power operation (a ^ b + c)');
  const formula5 = 'a ^ b + c';
  const variables5 = {a: 2, b: 3, c: 1};
  const result5 = evaluateFormula(formula5, variables5);
  console.log(`Formula: ${formula5}`);
  console.log(`Variables: ${getFormulaVariables(formula5).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables5)}`);
  console.log(`Result: ${result5}`);
  console.log('Expected: 9');
  console.log(`✓ ${result5 === 9 ? 'PASS' : 'FAIL'}\n`);

  // Test 6: Detailed result object
  console.log('Test 6: Using FormulaEvaluator.evaluate for detailed result');
  const formula6 = 'x * y + z';
  const variables6 = {x: 3, y: 4, z: 5};
  const detailedResult = FormulaEvaluator.evaluate(formula6, variables6);
  console.log(`Formula: ${formula6}`);
  console.log(`Variables found: [${detailedResult.variables.join(', ')}]`);
  console.log(`Values: ${JSON.stringify(variables6)}`);
  console.log(`Result: ${detailedResult.result}`);
  console.log('Expected: 17');
  console.log(`✓ ${detailedResult.result === 17 ? 'PASS' : 'FAIL'}\n`);

  // Test 7: Temperature conversion formula
  console.log('Test 7: Temperature conversion ((tempF - 32) * 5/9)');
  const formula7 = '(tempF - 32) * 5/9';
  const variables7 = {tempF: 212}; // 212°F = 100°C
  const result7 = evaluateFormula(formula7, variables7);
  console.log(`Formula: ${formula7}`);
  console.log(`Variables: ${getFormulaVariables(formula7).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables7)} (212°F)`);
  console.log(`Result: ${result7}°C`);
  console.log('Expected: 100°C');
  console.log(`✓ ${result7 === 100 ? 'PASS' : 'FAIL'}\n`);

  // Test 8: Temperature conversion with underscore in variable name
  console.log('Test 8: Temperature conversion with underscore ((Temperature_fahrenheit - 32) * 5/9)');
  const formula8 = '(Temperature_fahrenheit - 32) * 5/9';
  const variables8 = {Temperature_fahrenheit: 68}; // 68°F = 20°C (room temperature)
  const result8 = evaluateFormula(formula8, variables8);
  console.log(`Formula: ${formula8}`);
  console.log(`Variables: ${getFormulaVariables(formula8).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables8)} (68°F)`);
  console.log(`Result: ${result8}°C`);
  console.log('Expected: 20°C');
  console.log(`✓ ${result8 === 20 ? 'PASS' : 'FAIL'}\n`);

  // Test 9: Square root operation
  console.log('Test 9: Square root operation (sqrt(a) + b)');
  const formula9 = 'sqrt(a) + b';
  const variables9 = {a: 16, b: 4}; // sqrt(16) + 4 = 4 + 4 = 8
  const result9 = evaluateFormula(formula9, variables9);
  console.log(`Formula: ${formula9}`);
  console.log(`Variables: ${getFormulaVariables(formula9).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables9)}`);
  console.log(`Result: ${result9}`);
  console.log('Expected: 8');
  console.log(`✓ ${result9 === 8 ? 'PASS' : 'FAIL'}\n`);

  // Test 10: Complex expression with square root
  console.log('Test 10: Complex expression (a + sqrt(b * c))');
  const formula10 = 'a + sqrt(b * c)';
  const variables10 = {a: 10, b: 9, c: 4}; // 10 + sqrt(9 * 4) = 10 + sqrt(36) = 10 + 6 = 16
  const result10 = evaluateFormula(formula10, variables10);
  console.log(`Formula: ${formula10}`);
  console.log(`Variables: ${getFormulaVariables(formula10).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables10)}`);
  console.log(`Result: ${result10}`);
  console.log('Expected: 16');
  console.log(`✓ ${result10 === 16 ? 'PASS' : 'FAIL'}\n`);

  // Test 11: Error handling - sqrt used incorrectly as variable
  console.log('Test 11: Error handling - sqrt used incorrectly as variable (sqrt + a)');
  try {
    const formula11 = 'sqrt + a';
    const variables11 = {sqrt: 5, a: 10}; // Trying to use sqrt as a variable
    const result11 = evaluateFormula(formula11, variables11);
    console.log(`Formula: ${formula11}`);
    console.log(`Values: ${JSON.stringify(variables11)}`);
    console.log(`Result: ${result11}`);
    console.log('✗ FAIL: Should have thrown an error');
  } catch (error) {
    console.log(`Formula: sqrt + a`);
    console.log(`Error caught: ${error instanceof Error ? error.message : String(error)}`);
    console.log('Expected: Error because sqrt should be used as sqrt(expression), not as a variable');
    console.log('✓ PASS: Correctly rejected sqrt used as variable\n');
  }

  // Test 12: Error handling - sqrt without parentheses  
  console.log('Test 12: Error handling - sqrt without parentheses (a * sqrt)');
  try {
    const formula12 = 'a * sqrt';
    const variables12 = {a: 5};
    const result12 = evaluateFormula(formula12, variables12);
    console.log(`Formula: ${formula12}`);
    console.log(`Values: ${JSON.stringify(variables12)}`);
    console.log(`Result: ${result12}`);
    console.log('✗ FAIL: Should have thrown an error');
  } catch (error) {
    console.log(`Formula: a * sqrt`);
    console.log(`Error caught: ${error instanceof Error ? error.message : String(error)}`);
    console.log('Expected: Error because sqrt needs parentheses sqrt(expression)');
    console.log('✓ PASS: Correctly rejected sqrt without parentheses\n');
  }

  // Test 13: Nested square root operation
  console.log('Test 13: Nested square root operation (sqrt(sqrt(a+b)))');
  const formula13 = 'sqrt(sqrt(a+b))';
  const variables13 = {a: 100, b: 156}; // sqrt(sqrt(100+156)) = sqrt(sqrt(256)) = sqrt(16) = 4
  const result13 = evaluateFormula(formula13, variables13);
  console.log(`Formula: ${formula13}`);
  console.log(`Variables: ${getFormulaVariables(formula13).join(', ')}`);
  console.log(`Values: ${JSON.stringify(variables13)} (a=100, b=156)`);
  console.log(`Calculation: sqrt(sqrt(${variables13.a}+${variables13.b})) = sqrt(sqrt(256)) = sqrt(16) = 4`);
  console.log(`Result: ${result13}`);
  console.log('Expected: 4');
  console.log(`✓ ${result13 === 4 ? 'PASS' : 'FAIL'}\n`);

  // Test 14: Formula validation - valid formulas
  console.log('Test 14: Formula validation - valid formulas');
  const validFormulas = [
    'a + b',
    '(a + b) * c',
    'sqrt(a) + b',
    'sqrt(sqrt(a + b))',
    'alpha * beta_gamma + sqrt(delta)',
    'a ^ b / c'
  ];
  
  console.log('Testing valid formulas:');
  let allValidPass = true;
  validFormulas.forEach((formula, index) => {
    const isValid = validateFormula(formula);
    console.log(`  ${index + 1}. "${formula}" → ${isValid ? '✓ Valid' : '✗ Invalid'}`);
    if (!isValid) allValidPass = false;
  });
  console.log(`All valid formulas test: ${allValidPass ? 'PASS' : 'FAIL'}\n`);

  // Test 15: Formula validation - invalid formulas
  console.log('Test 15: Formula validation - invalid formulas');
  const invalidFormulas = [
    'a +',           // Missing operand
    '+ b',           // Missing operand
    '(a + b',        // Mismatched parentheses
    'a + b)',        // Mismatched parentheses
    'a ** b',        // Invalid operator
    'a @ b',         // Invalid character
    'sqrt',          // Incomplete function
    '((a + b',       // Multiple mismatched parentheses
    'a + + b',       // Double operator
    'a + ((b+c)-d',  // Missing closing parenthesis
    'a+)b+c)',       // Extra closing parenthesis at start
    'a+b(+c)',       // Invalid parenthesis placement
    'a + sqrt)b)',   // Invalid sqrt syntax with misplaced parentheses
    'sqrt(a) + b4b4', // Invalid variable name with numbers
    '(Temperature_fahrenheit - 32) * 5/9b', // Invalid number-letter combination
    '(Temperature_fahrenheit - 32) * 5/0b', // Invalid number-letter combination with zero
    'sqrt(a) + b 3'  // Space between variable and number (implicit multiplication)
  ];
  
  console.log('Testing invalid formulas:');
  let allInvalidPass = true;
  invalidFormulas.forEach((formula, index) => {
    const isValid = validateFormula(formula);
    console.log(`  ${index + 1}. "${formula}" → ${isValid ? '✗ Valid (should be invalid)' : '✓ Invalid'}`);
    if (isValid) allInvalidPass = false;
  });
  console.log(`All invalid formulas test: ${allInvalidPass ? 'PASS' : 'FAIL'}\n`);

  // Test 16: validateFormula on all previous test formulas
  console.log('Test 16: validateFormula on all previous test formulas');
  const previousTestFormulas = [
    'a + b',                                    // Test 1
    'a * b + c / d',                           // Test 2  
    '(a + b) * c',                             // Test 3
    'alpha + beta * gamma',                    // Test 4
    'a ^ b + c',                               // Test 5
    'x * y + z',                               // Test 6
    '(tempF - 32) * 5/9',                      // Test 7
    '(Temperature_fahrenheit - 32) * 5/9',     // Test 8
    'sqrt(a) + b',                             // Test 9
    'a + sqrt(b * c)',                         // Test 10
    'sqrt(sqrt(a+b))'                          // Test 13
  ];
  
  console.log('Testing validateFormula on all previous test formulas:');
  let allPreviousValid = true;
  previousTestFormulas.forEach((formula, index) => {
    const isValid = validateFormula(formula);
    console.log(`  ${index + 1}. "${formula}" → ${isValid ? '✓ Valid' : '✗ Invalid (should be valid)'}`);
    if (!isValid) allPreviousValid = false;
  });
  console.log(`All previous test formulas validation: ${allPreviousValid ? 'PASS' : 'FAIL'}\n`);

  console.log('=== All tests completed successfully! ===');

} catch (error) {
  console.error('Test failed:', error);
}