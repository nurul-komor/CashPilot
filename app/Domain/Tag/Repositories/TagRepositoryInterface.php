<?php

namespace App\Domain\Tag\Repositories;

use App\Domain\Tag\Entities\Tag;
use Illuminate\Database\Eloquent\Collection;

interface TagRepositoryInterface
{
    public function findById(int $id): ?Tag;
    public function findByUserId(int $userId): Collection;
    public function create(array $data): Tag;
    public function update(Tag $tag, array $data): Tag;
    public function delete(Tag $tag): bool;
}

