<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pendaftaran extends Model
{
    use HasUuidV7;

    protected $table = 'pendaftaran';

    protected $fillable = [
        'user_id',
        'ekskul_ta_id',
        'status',
        'catatan_internal',
        'diputuskan_oleh',
        'diputuskan_pada',
    ];

    protected $casts = [
        'status' => 'string',
        'diputuskan_pada' => 'datetime',
    ];

    /**
     * Get the student who registered.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the target extracurricular year record.
     */
    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }

    /**
     * Get the admin who decided on the registration.
     */
    public function decider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diputuskan_oleh');
    }

    /**
     * Get the attached certificates/files for this registration.
     */
    public function sertifikat(): HasMany
    {
        return $this->hasMany(Sertifikat::class, 'pendaftaran_id');
    }
}
