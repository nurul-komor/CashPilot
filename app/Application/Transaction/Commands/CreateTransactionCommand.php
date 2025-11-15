<?php

namespace App\Application\Transaction\Commands;

use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CreateTransactionCommand
{
    public function __construct(
        private TransactionRepositoryInterface $transactionRepository,
        private AccountRepositoryInterface $accountRepository
    ) {}

    public function __invoke(array $data): \App\Domain\Transaction\Entities\Transaction
    {
        return DB::transaction(function () use ($data) {
            $account = $this->accountRepository->findById($data['account_id']);

            if (!$account) {
                throw new \Exception('Account not found');
            }

            $data['user_id'] = $data['user_id'] ?? $account->user_id;
            $data['currency'] = $data['currency'] ?? $account->currency;
            $data['status'] = $data['status'] ?? 'completed';
            $data['transaction_date'] = $data['transaction_date'] ?? now();

            $transaction = $this->transactionRepository->create($data);

            // Update account balance
            if ($data['type'] === 'income') {
                $this->accountRepository->updateBalance($account, $data['amount']);
            } elseif ($data['type'] === 'expense') {
                $this->accountRepository->updateBalance($account, -$data['amount']);
            }

            // Attach tags if provided
            if (isset($data['tag_ids']) && is_array($data['tag_ids'])) {
                $this->transactionRepository->attachTags($transaction, $data['tag_ids']);
            }

            return $transaction->fresh();
        });
    }
}

