<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Goal\Entities\FinancialGoal;
use App\Domain\Goal\Repositories\GoalRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class GoalRepository implements GoalRepositoryInterface
{
    public function findById(int $id): ?FinancialGoal
    {
        return FinancialGoal::find($id);
    }

    public function findByUserId(int $userId): Collection
    {
        return FinancialGoal::where('user_id', $userId)->get();
    }

    public function create(array $data): FinancialGoal
    {
        return FinancialGoal::create($data);
    }

    public function update(FinancialGoal $goal, array $data): FinancialGoal
    {
        $goal->update($data);
        return $goal->fresh();
    }

    public function delete(FinancialGoal $goal): bool
    {
        return $goal->delete();
    }
}

