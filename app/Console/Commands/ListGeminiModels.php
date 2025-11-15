<?php

namespace App\Console\Commands;

use App\Infrastructure\AI\GeminiClient;
use Illuminate\Console\Command;

class ListGeminiModels extends Command
{
    protected $signature = 'gemini:list-models';
    protected $description = 'List available Gemini models from the API';

    public function handle(GeminiClient $geminiClient): int
    {
        try {
            $this->info('Fetching available Gemini models...');
            $models = $geminiClient->listAvailableModels();

            if (empty($models)) {
                $this->warn('No models found.');
                return self::FAILURE;
            }

            $this->info('Available Models:');
            $this->newLine();

            $tableData = [];
            foreach ($models as $model) {
                $name = $model['name'] ?? 'Unknown';
                $displayName = $model['displayName'] ?? 'N/A';
                $description = $model['description'] ?? 'N/A';
                $supportedMethods = implode(', ', $model['supportedGenerationMethods'] ?? []);

                $tableData[] = [
                    'name' => $name,
                    'display_name' => $displayName,
                    'description' => substr($description, 0, 50) . '...',
                    'methods' => $supportedMethods,
                ];
            }

            $this->table(
                ['Model Name', 'Display Name', 'Description', 'Supported Methods'],
                $tableData
            );

            $this->newLine();
            $this->info('To use a model, set GEMINI_MODEL or GEMINI_VISION_MODEL in your .env file');
            $this->info('Example: GEMINI_VISION_MODEL=gemini-1.5-flash');

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to list models: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}

