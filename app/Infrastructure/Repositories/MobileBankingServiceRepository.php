<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Bank\Entities\MobileBankingService;
use App\Domain\Bank\Repositories\MobileBankingServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class MobileBankingServiceRepository implements MobileBankingServiceRepositoryInterface
{
    public function findById(int $id): ?MobileBankingService
    {
        return MobileBankingService::find($id);
    }

    public function findAllActive(): Collection
    {
        return MobileBankingService::where('is_active', true)->get();
    }

    public function create(array $data): MobileBankingService
    {
        return MobileBankingService::create($data);
    }

    public function update(MobileBankingService $service, array $data): MobileBankingService
    {
        $service->update($data);
        return $service->fresh();
    }

    public function delete(MobileBankingService $service): bool
    {
        return $service->delete();
    }
}

