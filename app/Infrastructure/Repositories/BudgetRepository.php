<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Budget\Entities\Budget;
use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BudgetRepository implements BudgetRepositoryInterface
{
    public function findById(int $id): ?Budget
    {
        return Budget::find($id);
    }

    public function findByUserId(int $userId): Collection
    {
        return Budget::where('user_id', $userId)->get();
    }

    public function create(array $data): Budget
    {
        return Budget::create($data);
    }

    public function update(Budget $budget, array $data): Budget
    {
        $budget->update($data);
        return $budget->fresh();
    }

    public function delete(Budget $budget): bool
    {
        return $budget->delete();
    }
}

