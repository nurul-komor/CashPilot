<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Tag\Entities\Tag;
use App\Domain\Tag\Repositories\TagRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TagRepository implements TagRepositoryInterface
{
    public function findById(int $id): ?Tag
    {
        return Tag::find($id);
    }

    public function findByUserId(int $userId): Collection
    {
        return Tag::where('user_id', $userId)->get();
    }

    public function create(array $data): Tag
    {
        return Tag::create($data);
    }

    public function update(Tag $tag, array $data): Tag
    {
        $tag->update($data);
        return $tag->fresh();
    }

    public function delete(Tag $tag): bool
    {
        return $tag->delete();
    }
}

