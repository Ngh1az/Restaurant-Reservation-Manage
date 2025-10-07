<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Reservation::query();

        // Filter by search (customer_name or phone)
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $reservations = $query->orderBy('reserved_at', 'desc')->paginate(10);

        return Inertia::render('Reservations/Index', [
            'reservations' => $reservations,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Reservations/Form', [
            'reservation' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'phone' => ['required', 'regex:/^\\+?\\d{8,15}$/'],
            'party_size' => 'required|integer|min:1|max:50',
            'reserved_at' => 'required|date|after_or_equal:now',
            'status' => 'required|in:pending,confirmed,seated,canceled',
        ]);

        Reservation::create($validated);

        return redirect()->route('reservations.index')->with('success', 'Reservation created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        return Inertia::render('Reservations/Form', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'phone' => ['required', 'regex:/^\\+?\\d{8,15}$/'],
            'party_size' => 'required|integer|min:1|max:50',
            'reserved_at' => 'required|date|after_or_equal:now',
            'status' => 'required|in:pending,confirmed,seated,canceled',
        ]);

        $reservation->update($validated);

        return redirect()->route('reservations.index')->with('success', 'Reservation updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return redirect()->route('reservations.index')->with('success', 'Reservation deleted successfully!');
    }
}
