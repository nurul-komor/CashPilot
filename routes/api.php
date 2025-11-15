<?php

use App\Presentation\Http\Controllers\AI\AnomalyDetectionController;
use App\Presentation\Http\Controllers\AI\CategorySuggestionController;
use App\Presentation\Http\Controllers\AI\ChatAssistantController;
use App\Presentation\Http\Controllers\AI\DescriptionEnhancementController;
use App\Presentation\Http\Controllers\AI\FinancialInsightController;
use App\Presentation\Http\Controllers\AI\NaturalLanguageController;
use App\Presentation\Http\Controllers\AI\ReceiptOCRController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->prefix('ai')->group(function () {
    // Receipt OCR
    Route::post('/receipt-ocr', ReceiptOCRController::class)->name('ai.receipt-ocr');

    // Account Document OCR
    Route::post('/account-document-ocr', \App\Presentation\Http\Controllers\AI\AccountDocumentOCRController::class)->name('ai.account-document-ocr');

    // Category Suggestion
    Route::post('/suggest-category', CategorySuggestionController::class)->name('ai.suggest-category');

    // Natural Language Transaction Entry
    Route::post('/natural-language', NaturalLanguageController::class)->name('ai.natural-language');

    // Financial Insights
    Route::get('/insights', [FinancialInsightController::class, 'insights'])->name('ai.insights');
    Route::get('/insights/budget-recommendations', [FinancialInsightController::class, 'budgetRecommendations'])->name('ai.budget-recommendations');
    Route::get('/insights/summary', [FinancialInsightController::class, 'summary'])->name('ai.summary');

    // Chat Assistant
    Route::post('/chat', ChatAssistantController::class)->name('ai.chat');

    // Description Enhancement
    Route::post('/enhance-description', DescriptionEnhancementController::class)->name('ai.enhance-description');

    // Anomaly Detection
    Route::get('/anomalies', [AnomalyDetectionController::class, 'detect'])->name('ai.anomalies');
    Route::post('/anomalies/check', [AnomalyDetectionController::class, 'check'])->name('ai.anomalies.check');
});

