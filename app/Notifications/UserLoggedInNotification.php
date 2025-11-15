<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;
use Illuminate\Support\Facades\Log;

class UserLoggedInNotification extends Notification
{

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [PusherChannel::class];
    }

    /**
     * Get the push notification representation of the notification.
     */
    public function toPushNotification(object $notifiable): PusherMessage
    {
        try {
            $message = PusherMessage::create()
                ->iOS()
                ->android()
                ->badge(1)
                ->sound('success')
                ->title('Welcome Back!')
                ->body("You've successfully logged in to your account.");

            Log::info('Push notification created for user', [
                'user_id' => $notifiable->id,
                'interests' => $notifiable->routeNotificationForPusherPushNotifications($this),
            ]);

            return $message;
        } catch (\Exception $e) {
            Log::error('Failed to create push notification', [
                'user_id' => $notifiable->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Welcome Back!',
            'message' => "You've successfully logged in to your account.",
            'type' => 'login',
        ];
    }
}

