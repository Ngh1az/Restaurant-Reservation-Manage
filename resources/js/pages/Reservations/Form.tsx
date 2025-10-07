import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Reservation {
    id: number;
    customer_name: string;
    phone: string;
    party_size: number;
    reserved_at: string;
    status: 'pending' | 'confirmed' | 'seated' | 'canceled';
}

interface Props {
    reservation: Reservation | null;
}

export default function Form({ reservation }: Props) {
    const isEdit = !!reservation;

    const { data, setData, post, put, processing, errors } = useForm({
        customer_name: reservation?.customer_name || '',
        phone: reservation?.phone || '',
        party_size: reservation?.party_size || '',
        reserved_at: reservation?.reserved_at ? reservation.reserved_at.slice(0, 16) : '',
        status: reservation?.status || 'pending',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/reservations/${reservation.id}`);
        } else {
            post('/reservations');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Chỉnh sửa đặt bàn' : 'Tạo đặt bàn mới'} />

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white shadow">
                        {/* Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Chỉnh sửa đặt bàn' : 'Tạo đặt bàn mới'}</h1>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-4">
                            <div className="space-y-6">
                                {/* Customer Name */}
                                <div>
                                    <label htmlFor="customer_name" className="mb-2 block text-sm font-medium text-gray-700">
                                        Tên khách hàng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="customer_name"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${
                                            errors.customer_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập tên khách hàng"
                                    />
                                    {errors.customer_name && <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập số điện thoại"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                {/* Party Size */}
                                <div>
                                    <label htmlFor="party_size" className="mb-2 block text-sm font-medium text-gray-700">
                                        Số người <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="party_size"
                                        value={data.party_size}
                                        onChange={(e) => setData('party_size', e.target.value)}
                                        className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${
                                            errors.party_size ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập số người"
                                        min="1"
                                        max="50"
                                    />
                                    {errors.party_size && <p className="mt-1 text-sm text-red-600">{errors.party_size}</p>}
                                </div>

                                {/* Reserved At */}
                                <div>
                                    <label htmlFor="reserved_at" className="mb-2 block text-sm font-medium text-gray-700">
                                        Thời gian đặt bàn <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="reserved_at"
                                        value={data.reserved_at}
                                        onChange={(e) => setData('reserved_at', e.target.value)}
                                        className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${
                                            errors.reserved_at ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.reserved_at && <p className="mt-1 text-sm text-red-600">{errors.reserved_at}</p>}
                                </div>

                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                                        Trạng thái <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className={`w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:ring-blue-500 ${
                                            errors.status ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="pending">Đang chờ</option>
                                        <option value="confirmed">Đã xác nhận</option>
                                        <option value="seated">Đã ngồi</option>
                                        <option value="canceled">Đã hủy</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end space-x-4 border-t border-gray-200 pt-4">
                                <Link
                                    href="/reservations"
                                    className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
