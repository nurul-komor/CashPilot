<?php

namespace App\Presentation\Http\Controllers\Account;

use App\Application\Account\Commands\CreateAccountCommand;
use App\Application\Account\Commands\TransferAccountCommand;
use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Bank\Repositories\BankRepositoryInterface;
use App\Domain\Bank\Repositories\MobileBankingServiceRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __construct(
        private AccountRepositoryInterface $accountRepository,
        private BankRepositoryInterface $bankRepository,
        private MobileBankingServiceRepositoryInterface $mobileBankingServiceRepository,
        private CreateAccountCommand $createAccountCommand,
        private TransferAccountCommand $transferAccountCommand
    ) {}

    public function index(Request $request): Response
    {
        $accounts = $this->accountRepository->findByUserId($request->user()->id);
        $banks = $this->bankRepository->findAllActive();
        $mobileServices = $this->mobileBankingServiceRepository->findAllActive();

        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
            'banks' => $banks,
            'mobileServices' => $mobileServices,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:cash,bank,credit_card,debit_card,mobile_banking,savings,investment,other',
            'bank_id' => 'nullable|exists:banks,id',
            'mobile_banking_service_id' => 'nullable|exists:mobile_banking_services,id',
            'account_number' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $account = ($this->createAccountCommand)($validated);

        return redirect()->route('accounts.index')->with('success', 'Account created successfully.');
    }

    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id|different:from_account_id',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'nullable|string|max:3',
            'description' => 'nullable|string',
            'transaction_date' => 'nullable|date',
        ]);

        $validated['user_id'] = $request->user()->id;
        $result = ($this->transferAccountCommand)($validated);

        return redirect()->route('accounts.index')->with('success', 'Transfer completed successfully.');
    }
}

