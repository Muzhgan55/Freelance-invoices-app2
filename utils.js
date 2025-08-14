// utils.js

// Generate a unique ID
export function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}

// Format amount as currency
export function formatCurrency(amount) {
  return '$' + parseFloat(amount).toFixed(2);
}

// Show a confirmation dialog
export function confirmAction(message) {
  return window.confirm(message);
}