<?php

namespace App\Providers;

use App\Domain\Account\Repositories\AccountRepositoryInterface;
use App\Domain\Bank\Repositories\BankRepositoryInterface;
use App\Domain\Bank\Repositories\MobileBankingServiceRepositoryInterface;
use App\Domain\Bank\Repositories\FinancialInstitutionRepositoryInterface;
use App\Domain\Budget\Repositories\BudgetRepositoryInterface;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Goal\Repositories\GoalRepositoryInterface;
use App\Domain\Tag\Repositories\TagRepositoryInterface;
use App\Domain\Transaction\Repositories\TransactionRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Infrastructure\Repositories\AccountRepository;
use App\Infrastructure\Repositories\BankRepository;
use App\Infrastructure\Repositories\BudgetRepository;
use App\Infrastructure\Repositories\CategoryRepository;
use App\Infrastructure\Repositories\FinancialInstitutionRepository;
use App\Infrastructure\Repositories\GoalRepository;
use App\Infrastructure\Repositories\MobileBankingServiceRepository;
use App\Infrastructure\Repositories\TagRepository;
use App\Infrastructure\Repositories\TransactionRepository;
use App\Infrastructure\Repositories\UserRepository;
use App\Domain\AI\Services\ReceiptOCRServiceInterface;
use App\Domain\AI\Services\CategorySuggestionServiceInterface;
use App\Domain\AI\Services\NaturalLanguageTransactionServiceInterface;
use App\Domain\AI\Services\FinancialInsightServiceInterface;
use App\Domain\AI\Services\ChatAssistantServiceInterface;
use App\Domain\AI\Services\DescriptionEnhancementServiceInterface;
use App\Domain\AI\Services\AnomalyDetectionServiceInterface;
use App\Domain\AI\Services\AccountDocumentOCRServiceInterface;
use App\Infrastructure\AI\Services\ReceiptOCRService as InfrastructureReceiptOCRService;
use App\Infrastructure\AI\Services\AccountDocumentOCRService as InfrastructureAccountDocumentOCRService;
use App\Infrastructure\AI\Services\CategorySuggestionService as InfrastructureCategorySuggestionService;
use App\Infrastructure\AI\Services\NaturalLanguageTransactionService as InfrastructureNaturalLanguageTransactionService;
use App\Infrastructure\AI\Services\FinancialInsightService as InfrastructureFinancialInsightService;
use App\Infrastructure\AI\Services\ChatAssistantService as InfrastructureChatAssistantService;
use App\Infrastructure\AI\Services\DescriptionEnhancementService as InfrastructureDescriptionEnhancementService;
use App\Infrastructure\AI\Services\AnomalyDetectionService as InfrastructureAnomalyDetectionService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(AccountRepositoryInterface::class, AccountRepository::class);
        $this->app->bind(TransactionRepositoryInterface::class, TransactionRepository::class);
        $this->app->bind(BudgetRepositoryInterface::class, BudgetRepository::class);
        $this->app->bind(GoalRepositoryInterface::class, GoalRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(TagRepositoryInterface::class, TagRepository::class);
        $this->app->bind(BankRepositoryInterface::class, BankRepository::class);
        $this->app->bind(MobileBankingServiceRepositoryInterface::class, MobileBankingServiceRepository::class);
        $this->app->bind(FinancialInstitutionRepositoryInterface::class, FinancialInstitutionRepository::class);

        // AI Service bindings
        $this->app->bind(ReceiptOCRServiceInterface::class, InfrastructureReceiptOCRService::class);
        $this->app->bind(AccountDocumentOCRServiceInterface::class, InfrastructureAccountDocumentOCRService::class);
        $this->app->bind(CategorySuggestionServiceInterface::class, InfrastructureCategorySuggestionService::class);
        $this->app->bind(NaturalLanguageTransactionServiceInterface::class, InfrastructureNaturalLanguageTransactionService::class);
        $this->app->bind(FinancialInsightServiceInterface::class, InfrastructureFinancialInsightService::class);
        $this->app->bind(ChatAssistantServiceInterface::class, InfrastructureChatAssistantService::class);
        $this->app->bind(DescriptionEnhancementServiceInterface::class, InfrastructureDescriptionEnhancementService::class);
        $this->app->bind(AnomalyDetectionServiceInterface::class, InfrastructureAnomalyDetectionService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
