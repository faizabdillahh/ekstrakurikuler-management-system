<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumentasiEvent extends Model
{
    use HasUuidV7;

    protected $table = 'dokumentasi_event';

    const UPDATED_AT = null;

    protected $fillable = [
        'event_id',
        'path',
        'caption',
    ];

    /**
     * Get the associated event.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}
