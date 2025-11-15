<?php

namespace App\Presentation\Http\Controllers\Category;

use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository
    ) {}

    public function index(Request $request): Response
    {
        $categories = $this->categoryRepository->findByUserId($request->user()->id);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }
}

