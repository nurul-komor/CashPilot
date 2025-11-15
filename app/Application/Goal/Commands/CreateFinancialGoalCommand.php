<?php

namespace App\Application\Goal\Commands;

use App\Domain\Goal\Repositories\GoalRepositoryInterface;

class CreateFinancialGoalCommand
{
    public function __construct(
        private GoalRepositoryInterface $goalRepository
    ) {}

    public function __invoke(array $data): \App\Domain\Goal\Entities\FinancialGoal
    {
        $data['current_amount'] = $data['current_amount'] ?? 0;
        $data['currency'] = $data['currency'] ?? 'BDT';
        $data['status'] = $data['status'] ?? 'active';

        return $this->goalRepository->create($data);
    }
}

