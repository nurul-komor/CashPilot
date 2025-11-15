<?php

namespace App\Domain\Bank\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FinancialInstitution extends Model
{
    protected $table = 'financial_institutions';

    protected $fillable = [
        'name',
        'type',
        'code',
        'country',
        'logo',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(\App\Domain\Account\Entities\Account::class, 'financial_institution_id');
    }
}

