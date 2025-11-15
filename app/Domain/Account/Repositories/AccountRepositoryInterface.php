<?php

namespace App\Domain\Account\Repositories;

use App\Domain\Account\Entities\Account;
use Illuminate\Database\Eloquent\Collection;

interface AccountRepositoryInterface
{
    public function findById(int $id): ?Account;
    public function findByUserId(int $userId): Collection;
    public function create(array $data): Account;
    public function update(Account $account, array $data): Account;
    public function delete(Account $account): bool;
    public function updateBalance(Account $account, float $amount): Account;
}

