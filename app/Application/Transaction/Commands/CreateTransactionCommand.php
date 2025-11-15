<?php

namespace App\Application\Transaction\Commands;

use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;

class CreateTransactionCommand
{
    public function __construct(
        private TransactionRepositoryInterface $transactionRepository,
        private AccountRepositoryInterface $accountRepository
    ) {}

    public function __invoke(array $data): \App\Domain\Transaction\Entities\Transaction
    {
        $account = $this->accountRepository->findById($data['account_id']);

        if (!$account || $account->user_id !== $data['user_id']) {
            throw new \Exception('Account not found or unauthorized');
        }

        $transaction = $this->transactionRepository->create($data);

        // Update account balance
        $amount = (float) $data['amount'];
        if ($data['type'] === 'income') {
            $this->accountRepository->updateBalance($account, $amount);
        } elseif ($data['type'] === 'expense') {
            $this->accountRepository->updateBalance($account, -$amount);
        }

        // Attach tags if provided
        if (isset($data['tag_ids']) && is_array($data['tag_ids'])) {
            $this->transactionRepository->attachTags($transaction, $data['tag_ids']);
        }

        return $transaction;
    }
}

