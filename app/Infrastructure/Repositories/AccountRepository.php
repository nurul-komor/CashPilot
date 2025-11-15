<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Account\Entities\Account;
use App\Domain\Account\Repositories\AccountRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AccountRepository implements AccountRepositoryInterface
{
    public function findById(int $id): ?Account
    {
        return Account::find($id);
    }

    public function findByUserId(int $userId): Collection
    {
        return Account::where('user_id', $userId)->get();
    }

    public function create(array $data): Account
    {
        return Account::create($data);
    }

    public function update(Account $account, array $data): Account
    {
        $account->update($data);
        return $account->fresh();
    }

    public function delete(Account $account): bool
    {
        return $account->delete();
    }

    public function updateBalance(Account $account, float $amount): Account
    {
        $account->increment('balance', $amount);
        return $account->fresh();
    }
}

