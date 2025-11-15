<?php

namespace App\Application\Budget\Commands;

use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use App\Domain\Budget\Entities\BudgetCategory;

class CreateBudgetCommand
{
    public function __construct(
        private BudgetRepositoryInterface $budgetRepository
    ) {}

    public function __invoke(array $data): \App\Domain\Budget\Entities\Budget
    {
        $categoryAllocations = $data['category_allocations'] ?? [];
        unset($data['category_allocations']);

        $budget = $this->budgetRepository->create($data);

        // Create category allocations if provided
        if (!empty($categoryAllocations)) {
            foreach ($categoryAllocations as $allocation) {
                BudgetCategory::create([
                    'budget_id' => $budget->id,
                    'category_id' => $allocation['category_id'],
                    'allocated_amount' => $allocation['amount'],
                    'spent_amount' => 0,
                ]);
            }
        }

        return $budget;
    }
}

