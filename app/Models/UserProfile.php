<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        // Personal Information
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'national_id',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'bio',
        'profile_picture',
        // Professional Information
        'job_title',
        'company',
        'industry',
        'github_url',
        'linkedin_url',
        'portfolio_url',
        // Financial Settings
        'currency',
        'date_format',
        'number_format',
        'timezone',
        'tax_id',
        // Application Preferences
        'theme',
        'language',
        'email_notifications',
        'push_notifications',
        'daily_reminder_time',
        'notification_preferences',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'daily_reminder_time' => 'datetime',
            'notification_preferences' => 'array',
        ];
    }

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}


