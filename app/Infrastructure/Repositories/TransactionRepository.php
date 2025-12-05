<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Transaction\Entities\Transaction;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TransactionRepository implements TransactionRepositoryInterface
{
    public function findById(int $id): ?Transaction
    {
        return Transaction::find($id);
    }

    public function findByUserId(int $userId, array $filters = []): Collection
    {
        $query = Transaction::where('user_id', $userId);

        if (isset($filters['account_id'])) {
            $query->where('account_id', $filters['account_id']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['start_date'])) {
            $query->where('transaction_date', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->where('transaction_date', '<=', $filters['end_date']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        return $query->with(['category', 'account', 'tags'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    public function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);
        return $transaction->fresh();
    }

    public function delete(Transaction $transaction): bool
    {
        return $transaction->delete();
    }

    public function attachTags(Transaction $transaction, array $tagIds): void
    {
        $transaction->tags()->sync($tagIds);
    }
}

