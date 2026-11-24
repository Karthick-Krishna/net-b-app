/**
 * Financial Formatting Utilities for HSBC India
 * Standard Indian numbering system (Lakhs and Crores, e.g. ₹12,45,680.50)
 */

export function formatINR(amount: number, hide = false): string {
  if (hide) return '••••••';
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatFinancialCurrency(amount: number, currency: string = 'INR', hide = false): string {
  if (hide) return '••••••';
  if (currency === 'INR') {
    return formatINR(amount, hide);
  }

  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency + ' ';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
}

export function maskAccountNumber(accNum: string): string {
  if (!accNum) return '•••• •••• •••• 0000';
  const clean = accNum.replace(/\s+/g, '');
  const last4 = clean.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function maskCardNumber(cardNum: string): string {
  if (!cardNum) return '•••• •••• •••• 0000';
  const clean = cardNum.replace(/\s+/g, '');
  const last4 = clean.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function formatIndianDate(dateInput: string | Date | number): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return String(dateInput);
  }
}
