<?php

namespace App\Domain\Bank\Repositories;

use App\Domain\Bank\Entities\FinancialInstitution;
use Illuminate\Database\Eloquent\Collection;

interface FinancialInstitutionRepositoryInterface
{
    public function findById(int $id): ?FinancialInstitution;
    public function findAllActive(): Collection;
    public function findByType(string $type): Collection;
    public function findAllActiveByType(string $type): Collection;
    public function create(array $data): FinancialInstitution;
    public function update(FinancialInstitution $institution, array $data): FinancialInstitution;
    public function delete(FinancialInstitution $institution): bool;
}

