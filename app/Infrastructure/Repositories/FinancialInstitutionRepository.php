<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Bank\Entities\FinancialInstitution;
use App\Domain\Bank\Repositories\FinancialInstitutionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class FinancialInstitutionRepository implements FinancialInstitutionRepositoryInterface
{
    public function findById(int $id): ?FinancialInstitution
    {
        return FinancialInstitution::find($id);
    }

    public function findAllActive(): Collection
    {
        return FinancialInstitution::where('is_active', true)->get();
    }

    public function findByType(string $type): Collection
    {
        return FinancialInstitution::where('type', $type)->get();
    }

    public function findAllActiveByType(string $type): Collection
    {
        return FinancialInstitution::where('type', $type)
            ->where('is_active', true)
            ->get();
    }

    public function create(array $data): FinancialInstitution
    {
        return FinancialInstitution::create($data);
    }

    public function update(FinancialInstitution $institution, array $data): FinancialInstitution
    {
        $institution->update($data);
        return $institution->fresh();
    }

    public function delete(FinancialInstitution $institution): bool
    {
        return $institution->delete();
    }
}

