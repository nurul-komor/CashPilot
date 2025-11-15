<?php

namespace App\Domain\Bank\Repositories;

use App\Domain\Bank\Entities\MobileBankingService;
use Illuminate\Database\Eloquent\Collection;

interface MobileBankingServiceRepositoryInterface
{
    public function findById(int $id): ?MobileBankingService;
    public function findAllActive(): Collection;
    public function create(array $data): MobileBankingService;
    public function update(MobileBankingService $service, array $data): MobileBankingService;
    public function delete(MobileBankingService $service): bool;
}

