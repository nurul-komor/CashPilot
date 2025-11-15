<?php

namespace App\Domain\Transaction\Repositories;

use App\Domain\Transaction\Entities\Transaction;
use Illuminate\Database\Eloquent\Collection;

interface TransactionRepositoryInterface
{
    public function findById(int $id): ?Transaction;
    public function findByUserId(int $userId, array $filters = []): Collection;
    public function create(array $data): Transaction;
    public function update(Transaction $transaction, array $data): Transaction;
    public function delete(Transaction $transaction): bool;
    public function attachTags(Transaction $transaction, array $tagIds): void;
}

