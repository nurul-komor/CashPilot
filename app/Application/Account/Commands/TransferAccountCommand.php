<?php

namespace App\Application\Account\Commands;

use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;

class TransferAccountCommand
{
    public function __construct(
        private AccountRepositoryInterface $accountRepository,
        private TransactionRepositoryInterface $transactionRepository
    ) {}

    public function __invoke(array $data): array
    {
        $fromAccount = $this->accountRepository->findById($data['from_account_id']);
        $toAccount = $this->accountRepository->findById($data['to_account_id']);

        if (!$fromAccount || !$toAccount) {
            throw new \Exception('One or both accounts not found');
        }

        if ($fromAccount->user_id !== $data['user_id'] || $toAccount->user_id !== $data['user_id']) {
            throw new \Exception('Unauthorized account access');
        }

        $amount = (float) $data['amount'];
        $conversionRate = isset($data['conversion_rate']) && $data['conversion_rate'] > 0
            ? (float) $data['conversion_rate']
            : 1.0;

        // Calculate amount to receive in destination account currency
        $toAmount = $amount * $conversionRate;

        $transactionDate = $data['transaction_date'] ?? now()->toDateString();
        $description = $data['description'] ?? 'Account transfer';
        $baseDescription = $description;

        // Create debit transaction (expense) on source account
        $debitTransactionData = [
            'user_id' => $data['user_id'],
            'account_id' => $fromAccount->id,
            'to_account_id' => $toAccount->id,
            'type' => 'expense',
            'amount' => $amount,
            'currency' => $fromAccount->currency,
            'category_id' => $data['category_id'] ?? null,
            'description' => $baseDescription . ' → ' . $toAccount->name,
            'notes' => $data['notes'] ?? null,
            'transaction_date' => $transactionDate,
            'status' => 'completed',
        ];

        if (isset($data['receipt_path'])) {
            $debitTransactionData['receipt_path'] = $data['receipt_path'];
        }

        $debitTransaction = $this->transactionRepository->create($debitTransactionData);

        // Create credit transaction (general or savings) on destination account
        $creditTransactionType = $data['transaction_type'] ?? 'general';
        $creditTransactionData = [
            'user_id' => $data['user_id'],
            'account_id' => $toAccount->id,
            'to_account_id' => $fromAccount->id,
            'type' => $creditTransactionType,
            'amount' => $toAmount,
            'currency' => $toAccount->currency,
            'category_id' => $data['category_id'] ?? null,
            'description' => $baseDescription . ' ← ' . $fromAccount->name,
            'notes' => $data['notes'] ?? null,
            'transaction_date' => $transactionDate,
            'status' => 'completed',
        ];

        if (isset($data['receipt_path'])) {
            $creditTransactionData['receipt_path'] = $data['receipt_path'];
        }

        $creditTransaction = $this->transactionRepository->create($creditTransactionData);

        // Attach tags to both transactions if provided
        if (isset($data['tag_ids']) && is_array($data['tag_ids'])) {
            $this->transactionRepository->attachTags($debitTransaction, $data['tag_ids']);
            $this->transactionRepository->attachTags($creditTransaction, $data['tag_ids']);
        }

        // Update balances - deduct from source, add to destination (with conversion)
        $this->accountRepository->updateBalance($fromAccount, -$amount);
        $this->accountRepository->updateBalance($toAccount, $toAmount);

        return [
            'debit_transaction' => $debitTransaction,
            'credit_transaction' => $creditTransaction,
            'from_amount' => $amount,
            'to_amount' => $toAmount,
            'conversion_rate' => $conversionRate,
        ];
    }
}

