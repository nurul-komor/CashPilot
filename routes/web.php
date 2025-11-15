<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', [\App\Presentation\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Password routes
    Route::get('/profile/password', [\App\Http\Controllers\Auth\PasswordController::class, 'edit'])->name('password.edit');
    Route::patch('/profile/password', [\App\Http\Controllers\Auth\PasswordController::class, 'update'])->name('password.update');

    // Account deletion route
    Route::get('/profile/delete', [ProfileController::class, 'delete'])->name('profile.delete');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Accounts
    Route::resource('accounts', \App\Presentation\Http\Controllers\Account\AccountController::class);
    Route::get('accounts/transfer', [\App\Presentation\Http\Controllers\Account\AccountController::class, 'transferForm'])->name('accounts.transfer');
    Route::post('accounts/transfer', [\App\Presentation\Http\Controllers\Account\AccountController::class, 'transfer'])->name('accounts.transfer.store');

    // Transactions
    Route::resource('transactions', \App\Presentation\Http\Controllers\Transaction\TransactionController::class);

    // Budgets
    Route::resource('budgets', \App\Presentation\Http\Controllers\Budget\BudgetController::class);

    // Goals
    Route::resource('goals', \App\Presentation\Http\Controllers\Goal\GoalController::class);

    // Categories
    Route::resource('categories', \App\Presentation\Http\Controllers\Category\CategoryController::class)->only(['index']);

    // Tags
    Route::resource('tags', \App\Presentation\Http\Controllers\Tag\TagController::class)->only(['index']);

    // Reports
    Route::get('reports', [\App\Presentation\Http\Controllers\Report\ReportController::class, 'index'])->name('reports.index');

    // Settings
    Route::get('settings', [\App\Presentation\Http\Controllers\Settings\SettingsController::class, 'index'])->name('settings.index');
    Route::patch('settings/profile', [\App\Presentation\Http\Controllers\Settings\SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::patch('settings/preferences', [\App\Presentation\Http\Controllers\Settings\SettingsController::class, 'updatePreferences'])->name('settings.preferences.update');
    Route::patch('settings/financial', [\App\Presentation\Http\Controllers\Settings\SettingsController::class, 'updateFinancial'])->name('settings.financial.update');
});

require __DIR__.'/auth.php';
