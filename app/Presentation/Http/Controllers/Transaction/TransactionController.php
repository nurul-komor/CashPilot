<?php

namespace App\Presentation\Http\Controllers\Transaction;

use App\Application\Transaction\Commands\CreateTransactionCommand;
use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Tag\Repositories\TagRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function __construct(
        private TransactionRepositoryInterface $transactionRepository,
        private AccountRepositoryInterface $accountRepository,
        private CategoryRepositoryInterface $categoryRepository,
        private TagRepositoryInterface $tagRepository,
        private CreateTransactionCommand $createTransactionCommand
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['account_id', 'type', 'start_date', 'end_date', 'category_id']);
        $transactions = $this->transactionRepository->findByUserId($request->user()->id, $filters);
        $accounts = $this->accountRepository->findByUserId($request->user()->id);
        $categories = $this->categoryRepository->findByUserId($request->user()->id);
        $tags = $this->tagRepository->findByUserId($request->user()->id);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $filters,
        ]);
    }

    public function create(Request $request): Response
    {
        $accounts = $this->accountRepository->findByUserId($request->user()->id);
        $categories = $this->categoryRepository->findByUserId($request->user()->id);
        $tags = $this->tagRepository->findByUserId($request->user()->id);

        return Inertia::render('Transactions/Create', [
            'accounts' => $accounts,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'type' => 'required|string|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'nullable|string|max:3',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'transaction_date' => 'required|date',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
            'receipt' => 'nullable|file|image|max:2048',
        ]);

        $validated['user_id'] = $request->user()->id;

        // Handle receipt upload
        if ($request->hasFile('receipt')) {
            $validated['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        $transaction = ($this->createTransactionCommand)($validated);

        return redirect()->route('transactions.index')->with('success', 'Transaction created successfully.');
    }

    public function show(Request $request, string $id): Response
    {
        $transaction = $this->transactionRepository->findById((int) $id);

        if (!$transaction || $transaction->user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        $transaction = $this->transactionRepository->findById((int) $id);

        if (!$transaction || $transaction->user_id !== $request->user()->id) {
            abort(404);
        }

        $accounts = $this->accountRepository->findByUserId($request->user()->id);
        $categories = $this->categoryRepository->findByUserId($request->user()->id);
        $tags = $this->tagRepository->findByUserId($request->user()->id);

        // Load transaction with tags
        $transaction->load('tags');

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'accounts' => $accounts,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $transaction = $this->transactionRepository->findById((int) $id);

        if (!$transaction || $transaction->user_id !== $request->user()->id) {
            abort(404);
        }

        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'type' => 'required|string|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'nullable|string|max:3',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'transaction_date' => 'required|date',
            'status' => 'nullable|string|in:pending,completed,cancelled',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $tagIds = $validated['tag_ids'] ?? [];
        unset($validated['tag_ids']);

        $this->transactionRepository->update($transaction, $validated);
        $this->transactionRepository->attachTags($transaction, $tagIds);

        return redirect()->route('transactions.index')->with('success', 'Transaction updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $transaction = $this->transactionRepository->findById((int) $id);

        if (!$transaction || $transaction->user_id !== $request->user()->id) {
            abort(404);
        }

        $this->transactionRepository->delete($transaction);

        return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully.');
    }
}

