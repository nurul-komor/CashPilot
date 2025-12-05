<?php

namespace App\Presentation\Http\Controllers\Account;

use App\Application\Account\Commands\CreateAccountCommand;
use App\Application\Account\Commands\TransferAccountCommand;
use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Bank\Repositories\FinancialInstitutionRepositoryInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Tag\Repositories\TagRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __construct(
        private AccountRepositoryInterface $accountRepository,
        private FinancialInstitutionRepositoryInterface $financialInstitutionRepository,
        private CategoryRepositoryInterface $categoryRepository,
        private TagRepositoryInterface $tagRepository,
        private CreateAccountCommand $createAccountCommand,
        private TransferAccountCommand $transferAccountCommand
    ) {}

    public function index(Request $request): Response
    {
        $accounts = $this->accountRepository->findByUserId($request->user()->id);
        $financialInstitutions = $this->financialInstitutionRepository->findAllActive();

        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
            'financialInstitutions' => $financialInstitutions,
        ]);
    }

    public function create(Request $request): Response
    {
        $financialInstitutions = $this->financialInstitutionRepository->findAllActive();

        return Inertia::render('Accounts/Create', [
            'financialInstitutions' => $financialInstitutions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:cash,bank,credit_card,debit_card,mobile_banking,savings,investment,other',
            'financial_institution_id' => 'nullable|exists:financial_institutions,id',
            'account_number' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $account = ($this->createAccountCommand)($validated);

        return redirect()->route('accounts.index')->with('success', 'Account created successfully.');
    }

    public function transferForm(Request $request): Response
    {
        $accounts = $this->accountRepository->findByUserId($request->user()->id);
        $categories = $this->categoryRepository->findByUserId($request->user()->id);
        $tags = $this->tagRepository->findByUserId($request->user()->id);

        return Inertia::render('Accounts/Transfer', [
            'accounts' => $accounts,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id|different:from_account_id',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'nullable|string|max:3',
            'conversion_rate' => 'nullable|numeric|min:0.0001',
            'transaction_type' => 'nullable|string|in:general,savings',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'transaction_date' => 'nullable|date',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
            'receipt' => 'nullable|file|image|max:2048',
        ]);

        $validated['user_id'] = $request->user()->id;

        // Handle receipt upload
        if ($request->hasFile('receipt')) {
            $validated['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        $result = ($this->transferAccountCommand)($validated);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'message' => 'Transfer completed successfully.',
                'data' => $result,
            ]);
        }

        return redirect()->route('accounts.index')->with('success', 'Transfer completed successfully.');
    }

    public function show(Request $request, string $id): Response
    {
        $account = $this->accountRepository->findById((int) $id);

        if (!$account || $account->user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Accounts/Show', [
            'account' => $account,
        ]);
    }

    public function edit(Request $request, string $id): Response
    {
        $account = $this->accountRepository->findById((int) $id);

        if (!$account || $account->user_id !== $request->user()->id) {
            abort(404);
        }

        $financialInstitutions = $this->financialInstitutionRepository->findAllActive();

        return Inertia::render('Accounts/Edit', [
            'account' => $account,
            'financialInstitutions' => $financialInstitutions,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $account = $this->accountRepository->findById((int) $id);

        if (!$account || $account->user_id !== $request->user()->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:cash,bank,credit_card,debit_card,mobile_banking,savings,investment,other',
            'financial_institution_id' => 'nullable|exists:financial_institutions,id',
            'account_number' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'status' => 'nullable|string|in:active,inactive,archived',
            'notes' => 'nullable|string',
        ]);

        $this->accountRepository->update($account, $validated);

        return redirect()->route('accounts.index')->with('success', 'Account updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $account = $this->accountRepository->findById((int) $id);

        if (!$account || $account->user_id !== $request->user()->id) {
            abort(404);
        }

        $this->accountRepository->delete($account);

        return redirect()->route('accounts.index')->with('success', 'Account deleted successfully.');
    }
}

