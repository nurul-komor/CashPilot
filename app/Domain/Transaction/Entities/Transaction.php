<?php

namespace App\Domain\Transaction\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'account_id',
        'to_account_id',
        'type',
        'amount',
        'currency',
        'category_id',
        'description',
        'notes',
        'transaction_date',
        'status',
        'receipt_path',
        'is_recurring',
        'recurring_frequency',
        'recurring_end_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'date',
        'is_recurring' => 'boolean',
        'recurring_end_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(\App\Domain\Account\Entities\Account::class);
    }

    public function toAccount(): BelongsTo
    {
        return $this->belongsTo(\App\Domain\Account\Entities\Account::class, 'to_account_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(\App\Domain\Category\Entities\Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(\App\Domain\Tag\Entities\Tag::class, 'transaction_tags');
    }
}

