<?php

namespace App\Application\Account\Commands;

use App\Domain\Account\Repositories\AccountRepositoryInterface;

class CreateAccountCommand
{
    public function __construct(
        private AccountRepositoryInterface $accountRepository
    ) {}

    public function __invoke(array $data): \App\Domain\Account\Entities\Account
    {
        $data['balance'] = $data['balance'] ?? 0;
        $data['currency'] = $data['currency'] ?? 'BDT';
        $data['status'] = $data['status'] ?? 'active';

        return $this->accountRepository->create($data);
    }
}

