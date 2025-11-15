<?php

namespace App\Domain\Bank\Repositories;

use App\Domain\Bank\Entities\Bank;
use Illuminate\Database\Eloquent\Collection;

interface BankRepositoryInterface
{
    public function findById(int $id): ?Bank;
    public function findAllActive(): Collection;
    public function create(array $data): Bank;
    public function update(Bank $bank, array $data): Bank;
    public function delete(Bank $bank): bool;
}

