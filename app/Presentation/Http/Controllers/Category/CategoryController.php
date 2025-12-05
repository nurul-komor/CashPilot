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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:income,expense',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_active'] = true;

        $category = $this->categoryRepository->create($validated);

        return response()->json($category, 201);
    }
}

