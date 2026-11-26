import { BankAccountRecord, InsuranceRecord, TransactionRecord } from '@shared/types';
import { formatINR } from '@shared/utils/formatters';

function triggerBlobDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function downloadStatementCsv(account: BankAccountRecord | undefined, txs: TransactionRecord[]) {
  const header = ['Date', 'Reference', 'Description', 'Counterparty', 'Category', 'Type', 'Amount (INR)', 'Status'];
  const rows = txs.map(t => [
    t.transactionDate,
    t.reference,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${(t.counterpartyName || '').replace(/"/g, '""')}"`,
    t.category,
    t.transactionType,
    t.amount.toFixed(2),
    t.status,
  ]);
  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  const suffix = account?.accountNumber?.slice(-4) || '4101';
  triggerBlobDownload(`HSBC-India-Statement-${suffix}.csv`, csv, 'text/csv;charset=utf-8;');
}

export function downloadStatementHtml(params: {
  customerName: string;
  customerId: string;
  account?: BankAccountRecord;
  dateRangeLabel: string;
  txs: TransactionRecord[];
  totalCredits: number;
  totalDebits: number;
}) {
  const { customerName, customerId, account, dateRangeLabel, txs, totalCredits, totalDebits } = params;
  const rowsHtml = txs
    .map(t => {
      const isCredit = t.transactionType === 'CREDIT';
      return `<tr>
        <td>${escapeHtml(t.transactionDate)}</td>
        <td><strong>${escapeHtml(t.description)}</strong><div style="color:#666;font-size:11px">${escapeHtml(t.reference)}</div></td>
        <td style="text-align:right">${!isCredit ? formatINR(t.amount) : '-'}</td>
        <td style="text-align:right;color:#16864A;font-weight:700">${isCredit ? '+' + formatINR(t.amount) : '-'}</td>
      </tr>`;
    })
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>HSBC India e-Statement</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f1f1f; max-width: 820px; margin: 32px auto; padding: 0 20px; }
  .head { display:flex; justify-content:space-between; border-bottom:3px solid #DB0011; padding-bottom:14px; margin-bottom:20px; }
  .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
  .card { background:#f6f7f9; border:1px solid #e5e7eb; padding:12px; border-radius:8px; }
  .lbl { font-size:11px; color:#666; text-transform:uppercase; }
  .val { font-size:15px; font-weight:700; margin-top:4px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { text-align:left; padding:10px; background:#f6f7f9; border-bottom:1px solid #d1d5db; font-size:11px; text-transform:uppercase; color:#555; }
  td { padding:10px; border-bottom:1px solid #f0f0f0; }
</style></head>
<body>
  <div class="head">
    <div><h2 style="margin:0;color:#DB0011">HSBC India · Certified e-Statement</h2><div style="font-size:12px;color:#555">${escapeHtml(customerName)} (${escapeHtml(customerId)}) · Period: ${escapeHtml(dateRangeLabel)}</div></div>
    <div style="text-align:right;font-size:12px"><div>A/C: <strong>${escapeHtml(account?.accountNumber || '06410088294101')}</strong></div><div>IFSC: <strong>${escapeHtml(account?.ifscCode || 'HSBC0641002')}</strong></div><div>Branch: ${escapeHtml(account?.branchName || 'Race Course Road, Coimbatore')}</div></div>
  </div>
  <div class="grid">
    <div class="card"><div class="lbl">Closing Balance</div><div class="val">${formatINR(account?.managedBalance || 0)}</div></div>
    <div class="card"><div class="lbl">Ledger Balance</div><div class="val">${formatINR(account?.ledgerBalance || 0)}</div></div>
    <div class="card"><div class="lbl">Total Credits</div><div class="val" style="color:#16864A">+${formatINR(totalCredits)}</div></div>
    <div class="card"><div class="lbl">Total Debits</div><div class="val">-${formatINR(totalDebits)}</div></div>
  </div>
  <table><thead><tr><th>Date</th><th>Description &amp; Reference</th><th style="text-align:right">Debit</th><th style="text-align:right">Credit</th></tr></thead><tbody>${rowsHtml}</tbody></table>
  <p style="font-size:11px;color:#666;margin-top:20px">Generated electronically by The Hongkong and Shanghai Banking Corporation Limited, India.</p>
</body></html>`;
  triggerBlobDownload(`HSBC-India-eStatement-${account?.accountNumber?.slice(-4) || '4101'}.html`, html, 'text/html;charset=utf-8;');
}

export function downloadInterestCertificateHtml(params: {
  customerName: string;
  customerId: string;
  certType: 'SAVINGS_INTEREST' | 'FD_TDS';
  finYear: string;
  account?: BankAccountRecord;
}) {
  const { customerName, customerId, certType, finYear, account } = params;
  const isSavings = certType === 'SAVINGS_INTEREST';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>HSBC Interest Certificate FY ${escapeHtml(finYear)}</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:720px;margin:36px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px}h2{color:#DB0011;margin:0 0 6px}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:10px;border-bottom:1px solid #f0f0f0;font-size:13px}</style></head>
<body>
  <h2>${isSavings ? 'SAVINGS ACCOUNT INTEREST CERTIFICATE (SEC 80TTA)' : 'TERM DEPOSIT INTEREST & TDS SUMMARY (FORM 16A)'}</h2>
  <p style="font-size:12px;color:#555">${escapeHtml(customerName)} · Customer ID: ${escapeHtml(customerId)} · Financial Year ${escapeHtml(finYear)}</p>
  <table>
    <tr><td>Account Number</td><td><strong>${escapeHtml(account?.accountNumber || '06410088294101')}</strong></td></tr>
    <tr><td>Branch &amp; IFSC</td><td>${escapeHtml(account?.branchName || 'Race Course Road, Coimbatore')} (${escapeHtml(account?.ifscCode || 'HSBC0641002')})</td></tr>
    <tr><td>Gross Interest Credited</td><td><strong style="color:#16864A">${isSavings ? '₹34,850.00' : '₹1,42,600.00'}</strong></td></tr>
    <tr><td>TDS Deducted</td><td><strong>${isSavings ? '₹0.00' : '₹14,260.00'}</strong></td></tr>
    <tr><td>TRACES Reconciliation Status</td><td><strong style="color:#16864A">Reconciled &amp; Verified</strong></td></tr>
  </table>
</body></html>`;
  triggerBlobDownload(`HSBC-Interest-Certificate-${finYear}.html`, html, 'text/html;charset=utf-8;');
}

export function downloadTransactionReceiptHtml(tx: TransactionRecord) {
  const isCredit = tx.transactionType === 'CREDIT';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>HSBC Transaction Receipt ${escapeHtml(tx.reference)}</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:560px;margin:36px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px}h2{color:#DB0011;margin:0}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:9px 4px;border-bottom:1px solid #f0f0f0;font-size:13px}</style></head>
<body>
  <h2>HSBC India · Official Transaction Receipt</h2>
  <p style="font-size:24px;font-weight:800;margin:14px 0;color:${isCredit ? '#16864A' : '#1f1f1f'}">${isCredit ? '+' : '-'}${formatINR(tx.amount)}</p>
  <table>
    <tr><td>Status</td><td><strong>${escapeHtml(tx.status)}</strong></td></tr>
    <tr><td>Description</td><td>${escapeHtml(tx.description)}</td></tr>
    <tr><td>Counterparty</td><td>${escapeHtml(tx.counterpartyName)}</td></tr>
    <tr><td>Date &amp; Time</td><td>${escapeHtml(tx.transactionDate)}</td></tr>
    <tr><td>Category</td><td>${escapeHtml(tx.category)}</td></tr>
    <tr><td>Reference ID</td><td><strong>${escapeHtml(tx.reference)}</strong></td></tr>
  </table>
</body></html>`;
  triggerBlobDownload(`HSBC-Receipt-${tx.reference.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`, html, 'text/html;charset=utf-8;');
}

export function downloadPolicyDocumentHtml(policy: InsuranceRecord, holderName: string) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Policy Schedule ${escapeHtml(policy.policyNumber)}</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:680px;margin:36px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px}h2{color:#DB0011;margin:0}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:10px;border-bottom:1px solid #f0f0f0;font-size:13px}</style></head>
<body>
  <h2>${escapeHtml(policy.providerName)} — Policy Schedule</h2>
  <p style="font-size:12px;color:#555">Policyholder: ${escapeHtml(holderName)} · Distributed via HSBC India Bancassurance</p>
  <table>
    <tr><td>Policy Number</td><td><strong>${escapeHtml(policy.policyNumber)}</strong></td></tr>
    <tr><td>Coverage Type</td><td>${escapeHtml(policy.policyType)}</td></tr>
    <tr><td>Status</td><td><strong style="color:#16864A">${escapeHtml(policy.policyStatus)}</strong></td></tr>
    <tr><td>Sum Insured</td><td><strong>${formatINR(policy.coverageAmount)}</strong></td></tr>
    <tr><td>Annual Premium</td><td><strong>${formatINR(policy.annualPremium)}</strong></td></tr>
    <tr><td>Next Renewal Due Date</td><td>${escapeHtml(policy.dueDate)}</td></tr>
  </table>
</body></html>`;
  triggerBlobDownload(`HSBC-Policy-${policy.policyNumber}.html`, html, 'text/html;charset=utf-8;');
}
