<?php

namespace App\Presentation\Http\Controllers\Goal;

use App\Application\Goal\Commands\CreateFinancialGoalCommand;
use App\Domain\Goal\Repositories\GoalRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GoalController extends Controller
{
    public function __construct(
        private GoalRepositoryInterface $goalRepository,
        private CreateFinancialGoalCommand $createFinancialGoalCommand
    ) {}

    public function index(Request $request): Response
    {
        $goals = $this->goalRepository->findByUserId($request->user()->id);

        return Inertia::render('Goals/Index', [
            'goals' => $goals,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Goals/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'target_date' => 'nullable|date',
        ]);

        $validated['user_id'] = $request->user()->id;
        $goal = ($this->createFinancialGoalCommand)($validated);

        return redirect()->route('goals.index')->with('success', 'Financial goal created successfully.');
    }

    public function show(Request $request, string $id): Response
    {
        $goal = $this->goalRepository->findById((int) $id);

        if (!$goal || $goal->user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Goals/Show', [
            'goal' => $goal,
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        $goal = $this->goalRepository->findById((int) $id);

        if (!$goal || $goal->user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Goals/Edit', [
            'goal' => $goal,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $goal = $this->goalRepository->findById((int) $id);

        if (!$goal || $goal->user_id !== $request->user()->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_amount' => 'required|numeric|min:0',
            'current_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'target_date' => 'nullable|date',
            'status' => 'nullable|string|in:active,completed,cancelled',
        ]);

        $this->goalRepository->update($goal, $validated);

        return redirect()->route('goals.index')->with('success', 'Financial goal updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $goal = $this->goalRepository->findById((int) $id);

        if (!$goal || $goal->user_id !== $request->user()->id) {
            abort(404);
        }

        $this->goalRepository->delete($goal);

        return redirect()->route('goals.index')->with('success', 'Financial goal deleted successfully.');
    }
}

