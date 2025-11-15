<?php

namespace App\Domain\Bank\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MobileBankingService extends Model
{
    protected $table = 'mobile_banking_services';

    protected $fillable = [
        'name',
        'logo',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(\App\Domain\Account\Entities\Account::class);
    }
}

