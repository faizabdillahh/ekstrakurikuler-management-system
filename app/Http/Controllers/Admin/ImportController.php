<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ImportSiswaJob;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ImportController extends Controller
{
    /**
     * Display the import form.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Siswa/Import');
    }

    /**
     * Handle the uploaded spreadsheet and dispatch the queue job.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // Limit to 10MB
        ]);

        // Save file to private temporary storage
        $path = $request->file('file')->store('temp_imports');

        // Dispatch the queue worker job
        ImportSiswaJob::dispatch($path);

        return redirect()->back()->with('success', 'File berhasil diunggah. Data siswa sedang diproses di antrean background.');
    }
}
