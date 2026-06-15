<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminEkskulAssignment;
use App\Models\EkskulTahunAjaran;
use App\Models\TahunAjaran;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengurusController extends Controller
{
    /**
     * Display a listing of admin assignments and OSIS members.
     */
    public function index(): Response
    {
        $ta = TahunAjaran::where('is_aktif', true)->first();

        if (!$ta) {
            return Inertia::render('Admin/Pengurus/Index', [
                'ekskulTaList' => [],
                'eligibleUsers' => [],
                'osisUsers' => [],
            ]);
        }

        // Get all yearly extracurriculars with their admin assignments
        $ekskulTaList = EkskulTahunAjaran::with(['ekskul', 'adminAssignments.user'])
            ->where('tahun_ajaran_id', $ta->id)
            ->get()
            ->map(function ($eta) {
                return [
                    'id' => $eta->id,
                    'ekskul_nama' => $eta->ekskul->nama,
                    'assignments' => $eta->adminAssignments->map(function ($assignment) {
                        return [
                            'id' => $assignment->id,
                            'user' => [
                                'id' => $assignment->user->id,
                                'nama' => $assignment->user->nama,
                                'email' => $assignment->user->email,
                                'role' => $assignment->user->getRoleNames()->first(),
                            ],
                        ];
                    }),
                ];
            });

        // Get users eligible to be assigned as admin-ekskul (siswa or pembina/guru)
        $eligibleUsers = User::where('status', 'aktif')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'nama' => $u->nama,
                    'email' => $u->email,
                    'kelas' => $u->kelas,
                    'role' => $u->getRoleNames()->first() ?? 'siswa',
                ];
            });

        // Get current users with OSIS role
        $osisUsers = User::role('pengurus-osis')
            ->where('status', 'aktif')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'nama' => $u->nama,
                    'email' => $u->email,
                ];
            });

        return Inertia::render('Admin/Pengurus/Index', [
            'ekskulTaList' => $ekskulTaList,
            'eligibleUsers' => $eligibleUsers,
            'osisUsers' => $osisUsers,
        ]);
    }

    /**
     * Assign a user as admin for a yearly extracurricular.
     */
    public function assign(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
            'ekskul_ta_id' => 'required|uuid|exists:ekskul_tahun_ajaran,id',
        ]);

        $user = User::findOrFail($request->user_id);

        // Check if already assigned
        $exists = AdminEkskulAssignment::where('user_id', $request->user_id)
            ->where('ekskul_ta_id', $request->ekskul_ta_id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'User tersebut sudah ditugaskan pada ekskul ini.');
        }

        AdminEkskulAssignment::create([
            'user_id' => $request->user_id,
            'ekskul_ta_id' => $request->ekskul_ta_id,
            'ditugaskan_oleh' => auth()->id(),
        ]);

        // Assign 'admin-ekskul' role if the user doesn't already have a managing role (like kesiswaan/pembina)
        if (!$user->hasRole('kesiswaan') && !$user->hasRole('pembina') && !$user->hasRole('admin-ekskul')) {
            $user->assignRole('admin-ekskul');
        }

        return redirect()->back()->with('success', 'Admin ekskul berhasil ditugaskan.');
    }

    /**
     * Revoke access for an admin of an extracurricular.
     */
    public function revoke(string $id): RedirectResponse
    {
        $assignment = AdminEkskulAssignment::findOrFail($id);
        $userId = $assignment->user_id;

        $assignment->delete();

        // Check if the user has any other active assignments
        $otherAssignments = AdminEkskulAssignment::where('user_id', $userId)->exists();

        if (!$otherAssignments) {
            $user = User::findOrFail($userId);
            // If no other assignments, and has the admin-ekskul role, remove it
            if ($user->hasRole('admin-ekskul')) {
                $user->removeRole('admin-ekskul');
            }
        }

        return redirect()->back()->with('success', 'Penugasan admin ekskul berhasil dicabut.');
    }

    /**
     * Perform suksesi OSIS (transfer OSIS role).
     */
    public function suksesiOsis(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
        ]);

        $newOsis = User::findOrFail($request->user_id);
        $currentOsis = auth()->user();

        // Assign role to the new user
        if (!$newOsis->hasRole('pengurus-osis')) {
            $newOsis->assignRole('pengurus-osis');
        }

        // Remove role from the current user
        if ($currentOsis && $currentOsis->hasRole('pengurus-osis')) {
            $currentOsis->removeRole('pengurus-osis');
        }

        return redirect()->to('/dashboard')->with('success', 'Suksesi kepengurusan OSIS berhasil dilakukan. Peran Anda telah dipindahkan.');
    }
}
