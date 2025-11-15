<?php

namespace App\Domain\Account\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'bank_id',
        'mobile_banking_service_id',
        'account_number',
        'balance',
        'currency',
        'status',
        'notes',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(\App\Domain\Bank\Entities\Bank::class);
    }

    public function mobileBankingService(): BelongsTo
    {
        return $this->belongsTo(\App\Domain\Bank\Entities\MobileBankingService::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(\App\Domain\Transaction\Entities\Transaction::class);
    }
}

