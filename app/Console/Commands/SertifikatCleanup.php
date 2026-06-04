<?php

namespace App\Console\Commands;

use App\Models\Sertifikat;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class SertifikatCleanup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sertifikat:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically cleanup temporary certificate files for finalized extracurricular selections';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting certificate cleanup...');

        $sertifikats = Sertifikat::whereHas('pendaftaran.ekskulTahunAjaran', function ($query) {
            $query->where('is_seleksi_final', true);
        })->get();

        $count = 0;
        foreach ($sertifikats as $s) {
            if (Storage::disk('public')->exists($s->path)) {
                Storage::disk('public')->delete($s->path);
            }
            $s->delete();
            $count++;
        }

        $this->info("Successfully cleaned up {$count} certificate records.");
        return Command::SUCCESS;
    }
}
