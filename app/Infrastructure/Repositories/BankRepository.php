<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Bank\Entities\Bank;
use App\Domain\Bank\Repositories\BankRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BankRepository implements BankRepositoryInterface
{
    public function findById(int $id): ?Bank
    {
        return Bank::find($id);
    }

    public function findAllActive(): Collection
    {
        return Bank::where('is_active', true)->get();
    }

    public function create(array $data): Bank
    {
        return Bank::create($data);
    }

    public function update(Bank $bank, array $data): Bank
    {
        $bank->update($data);
        return $bank->fresh();
    }

    public function delete(Bank $bank): bool
    {
        return $bank->delete();
    }
}

