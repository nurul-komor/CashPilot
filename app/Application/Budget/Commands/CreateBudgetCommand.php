<?php

namespace App\Application\Budget\Commands;

use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use App\Domain\Budget\Entities\BudgetCategory;
use Illuminate\Support\Facades\DB;

class CreateBudgetCommand
{
    public function __construct(
        private BudgetRepositoryInterface $budgetRepository
    ) {}

    public function __invoke(array $data): \App\Domain\Budget\Entities\Budget
    {
        return DB::transaction(function () use ($data) {
            $categoryAllocations = $data['category_allocations'] ?? [];
            unset($data['category_allocations']);

            $data['currency'] = $data['currency'] ?? 'BDT';
            $data['is_active'] = $data['is_active'] ?? true;

            $budget = $this->budgetRepository->create($data);

            // Create budget categories
            foreach ($categoryAllocations as $allocation) {
                BudgetCategory::create([
                    'budget_id' => $budget->id,
                    'category_id' => $allocation['category_id'],
                    'allocated_amount' => $allocation['amount'],
                    'spent_amount' => 0,
                ]);
            }

            return $budget->fresh();
        });
    }
}

