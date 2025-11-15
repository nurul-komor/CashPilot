<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\UserLoggedInNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestPushNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:push-notification {user_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test push notification by sending to a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id');

        if (!$userId) {
            $user = User::first();
            if (!$user) {
                $this->error('No users found in database. Please create a user first.');
                return 1;
            }
        } else {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found.");
                return 1;
            }
        }

        $this->info("Sending push notification to user: {$user->name} (ID: {$user->id})");
        $this->info("Interest: user-{$user->id}");

        try {
            $user->notify(new UserLoggedInNotification());
            $this->info('✅ Push notification sent successfully!');
            $this->info('Check your device if it\'s subscribed to interest: user-' . $user->id);
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Failed to send push notification: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            Log::error('Test push notification failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }
}
