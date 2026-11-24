export interface User {
  id: string;
  username: string;
  customer_id?: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'USER' | 'SUPER_ADMIN' | 'OPERATIONS' | 'SUPPORT' | 'COMPLIANCE' | 'AUDITOR';
  biometric_enabled: boolean;
  avatar_url?: string;
  dob?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  kyc_status?: string;
  preferred_language?: string;
}

export interface BankAccount {
  id: string;
  user_id: string;
  account_number: string;
  account_name: string;
  account_type: 'SAVINGS' | 'CURRENT' | 'SALARY' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'FOREIGN_CURRENCY';
  currency: string;
  available_balance: number;
  ledger_balance: number;
  status: 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED';
  branch_name: string;
  ifsc_swift: string;
  sort_code?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  reference: string;
  user_id: string;
  source_account_id?: string;
  destination_account_id?: string;
  counterparty_name: string;
  counterparty_account?: string;
  bank_name?: string;
  ifsc_swift?: string;
  amount: number;
  currency: string;
  fee: number;
  tax: number;
  exchange_rate?: number;
  description: string;
  category: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'SCHEDULED';
  transaction_type: string;
  created_at: string;
  account_name?: string;
  account_number?: string;
}

export interface Beneficiary {
  id: string;
  user_id: string;
  name: string;
  nickname?: string;
  account_number: string;
  bank_name: string;
  ifsc_swift: string;
  transfer_limit: number;
  is_favorite: number;
  is_active: number;
  activation_status: string;
  created_at: string;
}

export interface BillPayment {
  id: string;
  user_id: string;
  account_id: string;
  biller_category: string;
  biller_name: string;
  consumer_number: string;
  bill_amount: number;
  due_date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  payment_reference?: string;
  created_at: string;
}

export interface BankCard {
  id: string;
  user_id: string;
  account_id: string;
  card_number_masked: string;
  card_number_last4: string;
  card_type: 'DEBIT' | 'CREDIT';
  card_network: 'MASTERCARD' | 'VISA';
  card_tier: string;
  cardholder_name: string;
  expiry_month: string;
  expiry_year: string;
  cvv_encrypted?: string;
  is_frozen: number;
  is_blocked: number;
  online_enabled: number;
  international_enabled: number;
  contactless_enabled: number;
  daily_spending_limit: number;
  current_month_spent: number;
  credit_limit?: number;
  available_credit?: number;
  min_due?: number;
  payment_due_date?: string;
  reward_points?: number;
  account_name?: string;
  currency?: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  account_id: string;
  deposit_type: 'FIXED' | 'RECURRING';
  deposit_number: string;
  principal_amount: number;
  monthly_installment?: number;
  interest_rate: number;
  tenure_months: number;
  expected_maturity_amount: number;
  maturity_date: string;
  status: 'ACTIVE' | 'MATURED' | 'PREMATURE_CLOSED';
  account_name?: string;
  account_number?: string;
}

export interface Loan {
  id: string;
  user_id: string;
  loan_type: 'PERSONAL' | 'HOME' | 'VEHICLE' | 'EDUCATION';
  loan_number: string;
  principal_amount: number;
  interest_rate: number;
  tenure_months: number;
  emi_amount: number;
  outstanding_balance: number;
  next_emi_date: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'CLOSED';
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'TRANSACTION' | 'SECURITY' | 'BILL' | 'DEPOSIT' | 'SYSTEM';
  is_read: number;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  category: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_id?: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'USER' | 'SUPPORT_AGENT' | 'BOT';
  message: string;
  created_at: string;
}

export interface BranchAtm {
  id: string;
  name: string;
  type: 'BRANCH' | 'ATM' | 'PREMIER_CENTRE';
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  timing: string;
  distance_km: number;
  is_24x7: number;
  services: string;
  lat: number;
  lng: number;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  actor_role: string;
  action: string;
  resource: string;
  resource_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
  actor_username?: string;
  actor_name?: string;
}
