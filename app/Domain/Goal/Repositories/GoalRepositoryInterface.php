<?php

namespace App\Domain\Goal\Repositories;

use App\Domain\Goal\Entities\FinancialGoal;
use Illuminate\Database\Eloquent\Collection;

interface GoalRepositoryInterface
{
    public function findById(int $id): ?FinancialGoal;
    public function findByUserId(int $userId): Collection;
    public function create(array $data): FinancialGoal;
    public function update(FinancialGoal $goal, array $data): FinancialGoal;
    public function delete(FinancialGoal $goal): bool;
}

