<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the Pusher Push Notification routing information for the given notification.
     *
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return string|array
     */
    public function routeNotificationForPusherPushNotifications($notification)
    {
        // Return array of interests to target this specific user
        // Devices must subscribe to this interest to receive notifications
        return ["user-{$this->id}"];
    }

    /**
     * Get the user's profile.
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get the user's education records.
     */
    public function education()
    {
        return $this->hasMany(Education::class);
    }

    /**
     * Get the user's skills.
     */
    public function skills()
    {
        return $this->hasMany(Skill::class);
    }

    /**
     * Get the user's work experiences.
     */
    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class);
    }

    /**
     * Get the user's projects.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
