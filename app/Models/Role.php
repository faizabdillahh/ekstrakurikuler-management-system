<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Spatie\Permission\Models\Role as SpatieRole;
use Ramsey\Uuid\Uuid;

class Role extends SpatieRole
{
    use HasUuidV7;

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Uuid::uuid7();
            }
        });
    }
}
