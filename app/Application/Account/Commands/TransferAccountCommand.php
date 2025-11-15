<?php

namespace App\Application\Account\Commands;

use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TransferAccountCommand
{
    public function __construct(
        private AccountRepositoryInterface $accountRepository,
        private TransactionRepositoryInterface $transactionRepository
    ) {}

    public function __invoke(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $fromAccount = $this->accountRepository->findById($data['from_account_id']);
            $toAccount = $this->accountRepository->findById($data['to_account_id']);

            if (!$fromAccount || !$toAccount) {
                throw new \Exception('Account not found');
            }

            if ($fromAccount->balance < $data['amount']) {
                throw new \Exception('Insufficient balance');
            }

            // Update balances
            $this->accountRepository->updateBalance($fromAccount, -$data['amount']);
            $this->accountRepository->updateBalance($toAccount, $data['amount']);

            // Create transfer transaction
            $transaction = $this->transactionRepository->create([
                'user_id' => $data['user_id'],
                'account_id' => $fromAccount->id,
                'to_account_id' => $toAccount->id,
                'type' => 'transfer',
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'BDT',
                'description' => $data['description'] ?? "Transfer to {$toAccount->name}",
                'transaction_date' => $data['transaction_date'] ?? now(),
                'status' => 'completed',
            ]);

            return [
                'transaction' => $transaction,
                'from_account' => $fromAccount->fresh(),
                'to_account' => $toAccount->fresh(),
            ];
        });
    }
}

