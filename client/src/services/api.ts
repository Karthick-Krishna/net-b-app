import { User, BankAccount, Transaction, Beneficiary, BillPayment, BankCard, Deposit, Loan, NotificationItem, SupportTicket, SupportMessage, BranchAtm, AuditLog } from '../types';

const API_BASE = '/api';

function getAuthHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
  const token = localStorage.getItem('premier_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: getAuthHeaders(options.headers as Record<string, string>),
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export const api = {
  // Auth
  login: (credentials: { identifier: string; password?: string; isBiometric?: boolean }) =>
    request<{ success: boolean; user: User; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: any) =>
    request<{ success: boolean; message: string; customer_id: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () =>
    request<{ success: boolean; user: User }>('/auth/me'),

  verifyOtp: (otp: string) =>
    request<{ success: boolean; verified: boolean; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),

  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    }),

  toggleBiometric: (enabled: boolean) =>
    request<{ success: boolean; biometric_enabled: boolean }>('/auth/toggle-biometric', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    }),

  // Accounts
  getAccounts: () =>
    request<{
      success: boolean;
      totalAvailableGbp: number;
      totalLedgerGbp: number;
      primaryCurrency: string;
      lastUpdated: string;
      accounts: BankAccount[];
    }>('/accounts'),

  getAccountDetails: (id: string) =>
    request<{
      success: boolean;
      account: BankAccount;
      recentTransactions: Transaction[];
      ledgerEntries: any[];
    }>(`/accounts/${id}`),

  getAccountStatement: (id: string, params?: { startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{
      success: boolean;
      account: BankAccount;
      statementPeriod: { from: string; to: string };
      summary: {
        openingBalance: number;
        closingBalance: number;
        totalCredits: number;
        totalDebits: number;
        transactionCount: number;
      };
      transactions: Transaction[];
    }>(`/accounts/${id}/statement?${query}`);
  },

  openAccount: (data: { accountType: string; accountName: string; currency?: string }) =>
    request<{ success: boolean; message: string; account: BankAccount }>('/accounts/open', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Transfers
  getFxRates: () =>
    request<{ success: boolean; baseCurrency: string; timestamp: string; rates: Record<string, any> }>('/transfers/fx-rates'),

  calculateTransfer: (data: { transferType: string; amount: number; currency?: string }) =>
    request<{ success: boolean; calculation: any }>('/transfers/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  processTransfer: (transferData: any, idempotencyKey?: string) =>
    request<{
      success: boolean;
      status: string;
      transaction: Transaction;
      updatedSourceBalance: number;
      receipt: any;
    }>('/transfers', {
      method: 'POST',
      headers: idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : {},
      body: JSON.stringify({ ...transferData, idempotencyKey }),
    }),

  // Beneficiaries
  getBeneficiaries: () =>
    request<{ success: boolean; beneficiaries: Beneficiary[] }>('/beneficiaries'),

  addBeneficiary: (data: any) =>
    request<{ success: boolean; message: string; beneficiary: Beneficiary }>('/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteBeneficiary: (id: string) =>
    request<{ success: boolean; message: string }>(`/beneficiaries/${id}`, {
      method: 'DELETE',
    }),

  toggleBeneficiaryFavorite: (id: string) =>
    request<{ success: boolean; is_favorite: number }>(`/beneficiaries/${id}/toggle-fav`, {
      method: 'POST',
    }),

  // Bills
  getBills: () =>
    request<{ success: boolean; bills: BillPayment[] }>('/bills'),

  fetchBill: (params: { category: string; billerName: string; consumerNumber: string }) =>
    request<{ success: boolean; bill: any }>('/bills/fetch', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  payBill: (paymentData: any, idempotencyKey?: string) =>
    request<{
      success: boolean;
      message: string;
      paymentReference: string;
      transaction: Transaction;
      receipt: any;
    }>('/bills/pay', {
      method: 'POST',
      headers: idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : {},
      body: JSON.stringify({ ...paymentData, idempotencyKey }),
    }),

  // Cards
  getCards: () =>
    request<{ success: boolean; cards: BankCard[] }>('/cards'),

  getCardDetails: (id: string) =>
    request<{ success: boolean; card: BankCard; transactions: Transaction[] }>(`/cards/${id}`),

  revealCardCredentials: (id: string, pin: string) =>
    request<{ success: boolean; fullCardNumber: string; cvv: string; expiry: string }>(`/cards/${id}/reveal`, {
      method: 'POST',
      body: JSON.stringify({ pin }),
    }),

  toggleCardFreeze: (id: string) =>
    request<{ success: boolean; is_frozen: number; message: string }>(`/cards/${id}/freeze`, {
      method: 'POST',
    }),

  blockCard: (id: string, reason?: string) =>
    request<{ success: boolean; is_blocked: number; message: string }>(`/cards/${id}/block`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  updateCardControls: (id: string, controls: any) =>
    request<{ success: boolean; card: BankCard; message: string }>(`/cards/${id}/controls`, {
      method: 'POST',
      body: JSON.stringify(controls),
    }),

  changeCardPin: (id: string, newPin: string) =>
    request<{ success: boolean; message: string }>(`/cards/${id}/change-pin`, {
      method: 'POST',
      body: JSON.stringify({ newPin }),
    }),

  payCardBill: (id: string, data: { sourceAccountId: string; amount: number }) =>
    request<{ success: boolean; message: string; receipt: any; updatedCard: any }>(`/cards/${id}/pay-bill`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Transactions
  getTransactions: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{
      success: boolean;
      transactions: Transaction[];
      stats: { totalCount: number; totalCredits: number; totalDebits: number };
    }>(`/transactions?${query}`);
  },

  getTransactionDetails: (id: string) =>
    request<{ success: boolean; transaction: Transaction; ledgerEntries: any[]; receipt: any }>(`/transactions/${id}`),

  // Deposits
  getDeposits: () =>
    request<{ success: boolean; deposits: Deposit[] }>('/deposits'),

  calculateDeposit: (params: { type: string; amount: number; tenureMonths: number }) =>
    request<{ success: boolean; calculation: any }>('/deposits/calculate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  createDeposit: (data: any) =>
    request<{ success: boolean; message: string; depositNumber: string; maturityAmount: number; maturityDate: string; receipt: any }>('/deposits/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  simulateDepositWithdrawal: (id: string) =>
    request<{ success: boolean; simulation: any }>(`/deposits/${id}/withdraw`, {
      method: 'POST',
    }),

  // Loans
  getLoans: () =>
    request<{ success: boolean; loans: Loan[] }>('/loans'),

  calculateEmi: (params: { amount: number; rate: number; tenureMonths: number }) =>
    request<{ success: boolean; calculation: any }>('/loans/calculate-emi', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  applyLoan: (application: any) =>
    request<{ success: boolean; message: string; loanNumber: string; status: string; estimatedDecisionTime: string; monthlyEmi: number }>('/loans/apply', {
      method: 'POST',
      body: JSON.stringify(application),
    }),

  getLoanEligibility: () =>
    request<{ success: boolean; eligibility: any }>('/loans/eligibility'),

  // Notifications
  getNotifications: () =>
    request<{ success: boolean; unreadCount: number; notifications: NotificationItem[] }>('/notifications'),

  markNotificationRead: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST' }),

  markAllNotificationsRead: () =>
    request<{ success: boolean }>('/notifications/read-all', { method: 'POST' }),

  deleteNotification: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}`, { method: 'DELETE' }),

  // Profile & Security
  getProfile: () =>
    request<{ success: boolean; profile: User }>('/profile'),

  updateProfile: (profileData: any) =>
    request<{ success: boolean; message: string }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  getSessions: () =>
    request<{ success: boolean; sessions: any[] }>('/profile/sessions'),

  revokeSession: (id: string) =>
    request<{ success: boolean; message: string }>(`/profile/sessions/${id}/revoke`, { method: 'POST' }),

  emergencyFreeze: () =>
    request<{ success: boolean; message: string }>('/profile/emergency-freeze', { method: 'POST' }),

  // Support
  getFaqs: () =>
    request<{ success: boolean; faqs: { q: string; a: string; category: string }[] }>('/support/faqs'),

  getTickets: () =>
    request<{ success: boolean; tickets: SupportTicket[] }>('/support/tickets'),

  createTicket: (data: any) =>
    request<{ success: boolean; message: string; ticketNumber: string; ticketId: string }>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTicketDetails: (id: string) =>
    request<{ success: boolean; ticket: SupportTicket; messages: SupportMessage[] }>(`/support/tickets/${id}`),

  sendTicketMessage: (id: string, message: string) =>
    request<{ success: boolean; messages: SupportMessage[] }>(`/support/tickets/${id}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  bookAppointment: (data: any) =>
    request<{ success: boolean; message: string }>('/support/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Locator
  getLocations: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; count: number; locations: BranchAtm[] }>(`/locator?${query}`);
  },

  // Admin
  getAdminOverview: () =>
    request<{ success: boolean; overview: any }>('/admin/overview'),

  getAdminCustomers: () =>
    request<{ success: boolean; customers: any[] }>('/admin/customers'),

  toggleCustomerLock: (id: string) =>
    request<{ success: boolean; is_locked: number; message: string }>(`/admin/customers/${id}/toggle-lock`, {
      method: 'POST',
    }),

  getAdminLedger: () =>
    request<{ success: boolean; entries: any[] }>('/admin/ledger'),

  getAdminTransactions: () =>
    request<{ success: boolean; transactions: any[] }>('/admin/transactions'),

  getAdminCards: () =>
    request<{ success: boolean; cards: any[] }>('/admin/cards'),

  getAdminTickets: () =>
    request<{ success: boolean; tickets: any[] }>('/admin/tickets'),

  updateAdminTicketStatus: (id: string, status: string, resolutionNote?: string) =>
    request<{ success: boolean; status: string; message: string }>(`/admin/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolutionNote }),
    }),

  getAdminAuditLogs: () =>
    request<{ success: boolean; logs: AuditLog[] }>('/admin/audit-logs'),
};
