<?php

namespace App\Presentation\Http\Controllers\Tag;

use App\Domain\Tag\Repositories\TagRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function __construct(
        private TagRepositoryInterface $tagRepository
    ) {}

    public function index(Request $request): Response
    {
        $tags = $this->tagRepository->findByUserId($request->user()->id);

        return Inertia::render('Tags/Index', [
            'tags' => $tags,
        ]);
    }
}

