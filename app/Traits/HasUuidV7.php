<?php

namespace App\Traits;

use Ramsey\Uuid\Uuid;

trait HasUuidV7
{
    /**
     * Boot the trait to generate UUID v7 on model creation.
     */
    protected static function bootHasUuidV7(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Uuid::uuid7();
            }
        });
    }

    /**
     * Get the value indicating whether the IDs are incrementing.
     */
    public function getIncrementing(): bool
    {
        return false;
    }

    /**
     * Get the auto-incrementing key type.
     */
    public function getKeyType(): string
    {
        return 'string';
    }
}
