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

        // Create transfer transaction
        $transaction = $this->transactionRepository->create([
            'user_id' => $data['user_id'],
            'account_id' => $fromAccount->id,
            'to_account_id' => $toAccount->id,
            'type' => 'transfer',
            'amount' => $amount,
            'currency' => $data['currency'] ?? 'BDT',
            'description' => $data['description'] ?? 'Account transfer',
            'transaction_date' => $data['transaction_date'] ?? now()->toDateString(),
            'status' => 'completed',
        ]);

        // Update balances
        $this->accountRepository->updateBalance($fromAccount, -$amount);
        $this->accountRepository->updateBalance($toAccount, $amount);

        return ['transaction' => $transaction];
    }
}

