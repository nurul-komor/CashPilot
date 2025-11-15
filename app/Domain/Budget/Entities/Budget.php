<?php

namespace App\Domain\Budget\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Budget extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'period_type',
        'year',
        'month',
        'total_amount',
        'currency',
        'is_active',
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'total_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(\App\Domain\Budget\Entities\BudgetCategory::class);
    }
}

