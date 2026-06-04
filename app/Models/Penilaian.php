<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Penilaian extends Model
{
    use HasUuidV7;

    protected $table = 'penilaian';

    protected $fillable = [
        'anggota_id',
        'nilai_akhir',
        'dinilai_oleh',
    ];

    protected $casts = [
        'nilai_akhir' => 'decimal:2',
    ];

    /**
     * Get the associated member record.
     */
    public function anggota(): BelongsTo
    {
        return $this->belongsTo(Anggota::class, 'anggota_id');
    }

    /**
     * Get the teacher/admin who graded the student.
     */
    public function grader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dinilai_oleh');
    }
}
