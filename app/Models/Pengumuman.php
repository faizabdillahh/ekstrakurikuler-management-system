<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengumuman extends Model
{
    use HasUuidV7;

    protected $table = 'pengumuman';

    protected $fillable = [
        'ekskul_ta_id',
        'judul',
        'konten',
        'dijadwalkan_pada',
        'diterbitkan_pada',
        'dibuat_oleh',
    ];

    protected $casts = [
        'dijadwalkan_pada' => 'datetime',
        'diterbitkan_pada' => 'datetime',
    ];

    /**
     * Get the yearly extracurricular record.
     */
    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }

    /**
     * Get the user who published the announcement.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    /**
     * Get attachments linked to this announcement.
     */
    public function lampiran(): HasMany
    {
        return $this->hasMany(LampiranPengumuman::class, 'pengumuman_id');
    }
}
