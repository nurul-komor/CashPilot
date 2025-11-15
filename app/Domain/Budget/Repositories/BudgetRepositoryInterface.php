<?php

namespace App\Domain\Budget\Repositories;

use App\Domain\Budget\Entities\Budget;
use Illuminate\Database\Eloquent\Collection;

interface BudgetRepositoryInterface
{
    public function findById(int $id): ?Budget;
    public function findByUserId(int $userId): Collection;
    public function create(array $data): Budget;
    public function update(Budget $budget, array $data): Budget;
    public function delete(Budget $budget): bool;
}

