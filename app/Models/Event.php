<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasUuidV7;

    protected $table = 'event';

    protected $fillable = [
        'ekskul_ta_id',
        'judul',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi',
        'link_wa_eo',
        'dibuat_oleh',
    ];

    protected $casts = [
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
    ];

    /**
     * Get the yearly extracurricular record.
     */
    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }

    /**
     * Get the user who created this event.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    /**
     * Get documentation photos for this event.
     */
    public function dokumentasi(): HasMany
    {
        return $this->hasMany(DokumentasiEvent::class, 'event_id');
    }
}
