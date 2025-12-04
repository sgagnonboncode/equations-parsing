import { FormulaEvaluator, evaluateFormula, getFormulaVariables } from './index';

// Test cases
console.log('=== Formula Evaluator Tests ===\n');

try {
  // Test 1: Simple addition
  console.log('Test 1: Simple addition (a + b)');
  const formula1 = 'a + b';
  const values1 = [5, 3];
  const result1 = evaluateFormula(formula1, values1);
  console.log(`Formula: ${formula1}`);
  console.log(`Variables: ${getFormulaVariables(formula1).join(', ')}`);
  console.log(`Values: [${values1.join(', ')}]`);
  console.log(`Result: ${result1}`);
  console.log('Expected: 8');
  console.log(`✓ ${result1 === 8 ? 'PASS' : 'FAIL'}\n`);

  // Test 2: More complex expression
  console.log('Test 2: Complex expression (a * b + c / d)');
  const formula2 = 'a * b + c / d';
  const values2 = [2, 3, 8, 4];
  const result2 = evaluateFormula(formula2, values2);
  console.log(`Formula: ${formula2}`);
  console.log(`Variables: ${getFormulaVariables(formula2).join(', ')}`);
  console.log(`Values: [${values2.join(', ')}]`);
  console.log(`Result: ${result2}`);
  console.log('Expected: 8');
  console.log(`✓ ${result2 === 8 ? 'PASS' : 'FAIL'}\n`);

  // Test 3: With parentheses
  console.log('Test 3: Expression with parentheses ((a + b) * c)');
  const formula3 = '(a + b) * c';
  const values3 = [2, 3, 4];
  const result3 = evaluateFormula(formula3, values3);
  console.log(`Formula: ${formula3}`);
  console.log(`Variables: ${getFormulaVariables(formula3).join(', ')}`);
  console.log(`Values: [${values3.join(', ')}]`);
  console.log(`Result: ${result3}`);
  console.log('Expected: 20');
  console.log(`✓ ${result3 === 20 ? 'PASS' : 'FAIL'}\n`);

  // Test 4: Multi-character variables
  console.log('Test 4: Multi-character variables (alpha + beta * gamma)');
  const formula4 = 'alpha + beta * gamma';
  const values4 = [10, 5, 2];
  const result4 = evaluateFormula(formula4, values4);
  console.log(`Formula: ${formula4}`);
  console.log(`Variables: ${getFormulaVariables(formula4).join(', ')}`);
  console.log(`Values: [${values4.join(', ')}]`);
  console.log(`Result: ${result4}`);
  console.log('Expected: 20');
  console.log(`✓ ${result4 === 20 ? 'PASS' : 'FAIL'}\n`);

  // Test 5: Power operation
  console.log('Test 5: Power operation (a ^ b + c)');
  const formula5 = 'a ^ b + c';
  const values5 = [2, 3, 1];
  const result5 = evaluateFormula(formula5, values5);
  console.log(`Formula: ${formula5}`);
  console.log(`Variables: ${getFormulaVariables(formula5).join(', ')}`);
  console.log(`Values: [${values5.join(', ')}]`);
  console.log(`Result: ${result5}`);
  console.log('Expected: 9');
  console.log(`✓ ${result5 === 9 ? 'PASS' : 'FAIL'}\n`);

  // Test 6: Detailed result object
  console.log('Test 6: Using FormulaEvaluator.evaluate for detailed result');
  const formula6 = 'x * y + z';
  const values6 = [3, 4, 5];
  const detailedResult = FormulaEvaluator.evaluate(formula6, values6);
  console.log(`Formula: ${formula6}`);
  console.log(`Variables found: [${detailedResult.variables.join(', ')}]`);
  console.log(`Values: [${values6.join(', ')}]`);
  console.log(`Result: ${detailedResult.result}`);
  console.log('Expected: 17');
  console.log(`✓ ${detailedResult.result === 17 ? 'PASS' : 'FAIL'}\n`);

  // Test 7: Temperature conversion formula
  console.log('Test 7: Temperature conversion ((tempF - 32) * 5/9)');
  const formula7 = '(tempF - 32) * 5/9';
  const values7 = [212]; // 212°F = 100°C
  const result7 = evaluateFormula(formula7, values7);
  console.log(`Formula: ${formula7}`);
  console.log(`Variables: ${getFormulaVariables(formula7).join(', ')}`);
  console.log(`Values: [${values7.join(', ')}] (212°F)`);
  console.log(`Result: ${result7}°C`);
  console.log('Expected: 100°C');
  console.log(`✓ ${result7 === 100 ? 'PASS' : 'FAIL'}\n`);

  // Test 8: Temperature conversion with underscore in variable name
  console.log('Test 8: Temperature conversion with underscore ((Temperature_fahrenheit - 32) * 5/9)');
  const formula8 = '(Temperature_fahrenheit - 32) * 5/9';
  const values8 = [68]; // 68°F = 20°C (room temperature)
  const result8 = evaluateFormula(formula8, values8);
  console.log(`Formula: ${formula8}`);
  console.log(`Variables: ${getFormulaVariables(formula8).join(', ')}`);
  console.log(`Values: [${values8.join(', ')}] (68°F)`);
  console.log(`Result: ${result8}°C`);
  console.log('Expected: 20°C');
  console.log(`✓ ${result8 === 20 ? 'PASS' : 'FAIL'}\n`);

  console.log('=== All tests completed successfully! ===');

} catch (error) {
  console.error('Test failed:', error);
}