<?php

namespace App\Presentation\Http\Controllers\Budget;

use App\Application\Budget\Commands\CreateBudgetCommand;
use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function __construct(
        private BudgetRepositoryInterface $budgetRepository,
        private CategoryRepositoryInterface $categoryRepository,
        private CreateBudgetCommand $createBudgetCommand
    ) {}

    public function index(Request $request): Response
    {
        $budgets = $this->budgetRepository->findByUserId($request->user()->id);
        $categories = $this->categoryRepository->findByUserId($request->user()->id, 'expense');

        return Inertia::render('Budgets/Index', [
            'budgets' => $budgets,
            'categories' => $categories,
        ]);
    }

    public function create(Request $request): Response
    {
        $categories = $this->categoryRepository->findByUserId($request->user()->id, 'expense');

        return Inertia::render('Budgets/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'period_type' => 'required|string|in:monthly,yearly',
            'year' => 'required|integer|min:2020|max:2100',
            'month' => 'nullable|integer|min:1|max:12',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'category_allocations' => 'nullable|array',
            'category_allocations.*.category_id' => 'required|exists:categories,id',
            'category_allocations.*.amount' => 'required|numeric|min:0',
        ]);

        $validated['user_id'] = $request->user()->id;
        $budget = ($this->createBudgetCommand)($validated);

        return redirect()->route('budgets.index')->with('success', 'Budget created successfully.');
    }

    public function show(Request $request, string $id): Response
    {
        $budget = $this->budgetRepository->findById((int) $id);

        if (!$budget || $budget->user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Budgets/Show', [
            'budget' => $budget->load('categories'),
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        $budget = $this->budgetRepository->findById((int) $id);

        if (!$budget || $budget->user_id !== $request->user()->id) {
            abort(404);
        }

        $categories = $this->categoryRepository->findByUserId($request->user()->id, 'expense');

        return Inertia::render('Budgets/Edit', [
            'budget' => $budget->load('categories'),
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $budget = $this->budgetRepository->findById((int) $id);

        if (!$budget || $budget->user_id !== $request->user()->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'period_type' => 'required|string|in:monthly,yearly',
            'year' => 'required|integer|min:2020|max:2100',
            'month' => 'nullable|integer|min:1|max:12',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'is_active' => 'nullable|boolean',
        ]);

        $this->budgetRepository->update($budget, $validated);

        return redirect()->route('budgets.index')->with('success', 'Budget updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $budget = $this->budgetRepository->findById((int) $id);

        if (!$budget || $budget->user_id !== $request->user()->id) {
            abort(404);
        }

        $this->budgetRepository->delete($budget);

        return redirect()->route('budgets.index')->with('success', 'Budget deleted successfully.');
    }
}

