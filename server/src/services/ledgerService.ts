import { v4 as uuidv4 } from 'uuid';
import { db, runTransaction } from '../db/database';
import { logAudit } from '../middleware/auth';

export interface TransferParams {
  userId: string;
  sourceAccountId: string;
  destAccountId?: string;
  counterpartyName: string;
  counterpartyAccount: string;
  bankName: string;
  ifscSwift: string;
  amount: number;
  currency: string;
  fee?: number;
  tax?: number;
  exchangeRate?: number;
  description: string;
  category?: string;
  transactionType: 'OWN_TRANSFER' | 'DOMESTIC_TRANSFER' | 'INTL_TRANSFER' | 'BILL_PAYMENT' | 'CARD_PURCHASE';
  idempotencyKey?: string;
  ipAddress?: string;
}

export class LedgerService {
  /**
   * Executes a banking transfer under strict ACID conditions using a double-entry ledger.
   */
  static processTransfer(params: TransferParams) {
    const {
      userId,
      sourceAccountId,
      destAccountId,
      counterpartyName,
      counterpartyAccount,
      bankName,
      ifscSwift,
      amount,
      currency,
      fee = 0,
      tax = 0,
      exchangeRate = 1.0,
      description,
      category = 'TRANSFER',
      transactionType,
      idempotencyKey,
      ipAddress = '127.0.0.1'
    } = params;

    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }

    // Check Idempotency Key to prevent double charges
    if (idempotencyKey) {
      const existingTxn = db.prepare(`
        SELECT * FROM transactions WHERE idempotency_key = ?
      `).get(idempotencyKey);

      if (existingTxn) {
        const ext = existingTxn as any;
        return {
          status: 'IDEMPOTENT_REPLAY',
          transaction: ext,
          message: 'Transaction already processed previously.',
          updatedSourceBalance: 0,
          receipt: {
            reference: ext.reference,
            date: ext.created_at,
            sourceAccountName: 'Primary Account',
            sourceAccountNumber: ext.source_account_id || '',
            counterpartyName: ext.counterparty_name,
            counterpartyAccount: ext.counterparty_account,
            bankName: ext.bank_name,
            amount: ext.amount,
            currency: ext.currency,
            fee: ext.fee,
            tax: ext.tax,
            status: ext.status
          }
        };
      }
    }

    return runTransaction(() => {
      // 1. Fetch and Lock Source Account
      const sourceAccount = db.prepare(`
        SELECT * FROM accounts WHERE id = ? AND user_id = ?
      `).get(sourceAccountId, userId) as any;

      if (!sourceAccount) {
        throw new Error('Source account not found or access denied');
      }

      if (sourceAccount.status !== 'ACTIVE') {
        throw new Error(`Source account is ${sourceAccount.status.toLowerCase()} and cannot perform transfers`);
      }

      const totalDeduction = amount + fee + tax;
      if (sourceAccount.available_balance < totalDeduction) {
        throw new Error(`Insufficient funds. Available: ${sourceAccount.currency} ${sourceAccount.available_balance.toFixed(2)}, Required: ${sourceAccount.currency} ${totalDeduction.toFixed(2)}`);
      }

      // Generate Unique Transaction Reference
      const reference = `TXN-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(100000 + Math.random() * 900000)}`;
      const transactionId = uuidv4();

      // 2. Debit Source Account
      const newSourceAvail = Number((sourceAccount.available_balance - totalDeduction).toFixed(2));
      const newSourceLedger = Number((sourceAccount.ledger_balance - totalDeduction).toFixed(2));

      db.prepare(`
        UPDATE accounts 
        SET available_balance = ?, ledger_balance = ? 
        WHERE id = ?
      `).run(newSourceAvail, newSourceLedger, sourceAccountId);

      // Record Debit Ledger Entry
      db.prepare(`
        INSERT INTO ledger_entries (id, transaction_id, account_id, entry_type, amount, currency, balance_after, description)
        VALUES (?, ?, ?, 'DEBIT', ?, ?, ?, ?)
      `).run(
        uuidv4(),
        transactionId,
        sourceAccountId,
        totalDeduction,
        sourceAccount.currency,
        newSourceAvail,
        `Debit: Transfer to ${counterpartyName} (${reference})`
      );

      // 3. Credit Destination Account if Internal
      let destinationAccount: any = null;
      if (destAccountId) {
        destinationAccount = db.prepare(`SELECT * FROM accounts WHERE id = ?`).get(destAccountId) as any;
        if (destinationAccount) {
          const creditedAmount = Number((amount * exchangeRate).toFixed(2));
          const newDestAvail = Number((destinationAccount.available_balance + creditedAmount).toFixed(2));
          const newDestLedger = Number((destinationAccount.ledger_balance + creditedAmount).toFixed(2));

          db.prepare(`
            UPDATE accounts 
            SET available_balance = ?, ledger_balance = ? 
            WHERE id = ?
          `).run(newDestAvail, newDestLedger, destAccountId);

          // Record Credit Ledger Entry
          db.prepare(`
            INSERT INTO ledger_entries (id, transaction_id, account_id, entry_type, amount, currency, balance_after, description)
            VALUES (?, ?, ?, 'CREDIT', ?, ?, ?, ?)
          `).run(
            uuidv4(),
            transactionId,
            destAccountId,
            creditedAmount,
            destinationAccount.currency,
            newDestAvail,
            `Credit: Transfer from ${sourceAccount.account_name} (${reference})`
          );
        }
      }

      // 4. Record Transaction Master Record
      db.prepare(`
        INSERT INTO transactions (
          id, reference, user_id, source_account_id, destination_account_id,
          counterparty_name, counterparty_account, bank_name, ifsc_swift,
          amount, currency, fee, tax, exchange_rate, description, category,
          status, transaction_type, idempotency_key
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, ?)
      `).run(
        transactionId,
        reference,
        userId,
        sourceAccountId,
        destAccountId || null,
        counterpartyName,
        counterpartyAccount,
        bankName,
        ifscSwift,
        amount,
        currency,
        fee,
        tax,
        exchangeRate,
        description,
        category,
        transactionType,
        idempotencyKey || null
      );

      // 5. Create Notification
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type)
        VALUES (?, ?, ?, ?, 'TRANSACTION')
      `).run(
        uuidv4(),
        userId,
        'Money Transferred Successfully',
        `Transferred ${currency} ${amount.toFixed(2)} to ${counterpartyName}. Ref: ${reference}.`
      );

      // 6. Record Audit Log
      logAudit(
        userId,
        'USER',
        'FINANCIAL_TRANSFER',
        'TRANSACTION',
        transactionId,
        {
          reference,
          sourceAccountId,
          destAccountId,
          amount,
          currency,
          counterpartyName,
          fee,
          tax
        },
        ipAddress
      );

      // Fetch the full recorded transaction
      const txnRecord = db.prepare(`SELECT * FROM transactions WHERE id = ?`).get(transactionId) as any;

      return {
        status: 'SUCCESS',
        transaction: txnRecord,
        updatedSourceBalance: newSourceAvail,
        receipt: {
          reference,
          date: txnRecord.created_at,
          sourceAccountName: sourceAccount.account_name,
          sourceAccountNumber: sourceAccount.account_number,
          counterpartyName,
          counterpartyAccount,
          bankName,
          amount,
          currency,
          fee,
          tax,
          status: 'COMPLETED'
        }
      };
    });
  }
}
