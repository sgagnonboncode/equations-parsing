// Browser-compatible wrapper for the formula evaluator
// This file exposes the functions to the global window object

// Since we're in a browser environment, we need to simulate the module system
var exports = {};
var module = { exports: exports };

// Include the compiled code