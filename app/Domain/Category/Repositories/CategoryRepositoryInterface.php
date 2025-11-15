<?php

namespace App\Domain\Category\Repositories;

use App\Domain\Category\Entities\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    public function findById(int $id): ?Category;
    public function findByUserId(?int $userId, ?string $type = null): Collection;
    public function create(array $data): Category;
    public function update(Category $category, array $data): Category;
    public function delete(Category $category): bool;
}

