<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifikasi extends Model
{
    use HasUuidV7;

    protected $table = 'notifikasi';

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'tipe',
        'judul',
        'pesan',
        'link',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'tipe' => 'string',
    ];

    /**
     * Get the user recipient.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
