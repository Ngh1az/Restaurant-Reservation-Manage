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
        ], [
            'customer_name.required' => 'Tên khách hàng là bắt buộc.',
            'customer_name.string' => 'Tên khách hàng phải là chuỗi ký tự.',
            'customer_name.max' => 'Tên khách hàng không được vượt quá :max ký tự.',
            
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.regex' => 'Số điện thoại không hợp lệ. Phải có 8-15 chữ số (có thể bắt đầu bằng +).',
            
            'party_size.required' => 'Số người là bắt buộc.',
            'party_size.integer' => 'Số người phải là một số nguyên.',
            'party_size.min' => 'Số người phải ít nhất là :min.',
            'party_size.max' => 'Số người không được vượt quá :max.',
            
            'reserved_at.required' => 'Thời gian đặt bàn là bắt buộc.',
            'reserved_at.date' => 'Thời gian đặt bàn không hợp lệ.',
            'reserved_at.after_or_equal' => 'Thời gian đặt bàn không được ở trong quá khứ.',
            
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái không hợp lệ. Phải là một trong: pending, confirmed, seated, canceled.',
        ]);

        Reservation::create($validated);

        return redirect()->route('reservations.index')->with('success', 'Đặt bàn đã được tạo thành công!');
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
        ], [
            'customer_name.required' => 'Tên khách hàng là bắt buộc.',
            'customer_name.string' => 'Tên khách hàng phải là chuỗi ký tự.',
            'customer_name.max' => 'Tên khách hàng không được vượt quá :max ký tự.',
            
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.regex' => 'Số điện thoại không hợp lệ. Phải có 8-15 chữ số (có thể bắt đầu bằng +).',
            
            'party_size.required' => 'Số người là bắt buộc.',
            'party_size.integer' => 'Số người phải là một số nguyên.',
            'party_size.min' => 'Số người phải ít nhất là :min.',
            'party_size.max' => 'Số người không được vượt quá :max.',
            
            'reserved_at.required' => 'Thời gian đặt bàn là bắt buộc.',
            'reserved_at.date' => 'Thời gian đặt bàn không hợp lệ.',
            'reserved_at.after_or_equal' => 'Thời gian đặt bàn không được ở trong quá khứ.',
            
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái không hợp lệ. Phải là một trong: pending, confirmed, seated, canceled.',
        ]);

        $reservation->update($validated);

        return redirect()->route('reservations.index')->with('success', 'Đặt bàn đã được cập nhật thành công!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return redirect()->route('reservations.index')->with('success', 'Đặt bàn đã được xóa thành công!');
    }
}
