import { z } from 'zod';

export const BalanceAdjustmentSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  accountId: z.string().min(1, 'Account selection is required'),
  newManagedBalance: z.number().min(0, 'Balance cannot be negative'),
  adjustmentReason: z.string().min(5, 'A clear business adjustment reason is mandatory (minimum 5 characters)'),
});

export const TransactionCreationSchema = z.object({
  ownerUid: z.string().min(1, 'Target customer is required'),
  accountId: z.string().min(1, 'Target account is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  transactionType: z.enum(['CREDIT', 'DEBIT']),
  category: z.enum([
    'TRANSFER',
    'SALARY',
    'UTILITIES',
    'DINING',
    'SHOPPING',
    'INVESTMENT',
    'CHARGES',
    'CASH_WITHDRAWAL',
    'OTHER',
  ]),
  description: z.string().min(3, 'Description is required'),
  counterpartyName: z.string().min(2, 'Counterparty name is required'),
  counterpartyAccount: z.string().optional(),
  counterpartyBank: z.string().optional(),
  reference: z.string().min(3, 'Reference number is required'),
  transactionDate: z.string().min(1, 'Date is required'),
  internalNote: z.string().optional(),
  updateAccountBalance: z.boolean().default(true),
});

export const CustomerCreationSchema = z.object({
  displayName: z.string().min(2, 'Full legal name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  initialSavingsBalance: z.number().min(0, 'Initial balance must be zero or positive').default(50000),
  currency: z.enum(['INR', 'GBP', 'USD', 'EUR']).default('INR'),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
});

export const AppLockPinSchema = z.object({
  pin: z.string().regex(/^\d{6}$/, 'App-lock PIN must be exactly 6 numeric digits'),
  confirmPin: z.string().regex(/^\d{6}$/, 'App-lock PIN must be exactly 6 numeric digits'),
}).refine(data => data.pin === data.confirmPin, {
  message: 'PIN entries do not match',
  path: ['confirmPin'],
});

export const SupportTicketSchema = z.object({
  subject: z.string().min(4, 'Subject is required'),
  category: z.enum(['TRANSACTION_DISPUTE', 'CARD_LOST', 'FRAUD', 'ACCOUNT_INQUIRY', 'GENERAL']),
  description: z.string().min(10, 'Please provide detailed description (minimum 10 characters)'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

export const PaymentTransferSchema = z.object({
  sourceAccountId: z.string().min(1, 'Source account is required'),
  recipientName: z.string().min(2, 'Beneficiary name is required'),
  recipientAccount: z.string().min(6, 'Account number or IBAN is required'),
  recipientBank: z.string().min(2, 'Bank name is required'),
  ifscCode: z.string().min(4, 'IFSC or SWIFT code is required'),
  amount: z.number().positive('Transfer amount must be positive'),
  currency: z.string().default('INR'),
  reference: z.string().min(2, 'Payment reference is required'),
  note: z.string().optional(),
});
