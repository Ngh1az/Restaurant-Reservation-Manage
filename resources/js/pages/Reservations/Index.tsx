import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Reservation {
    id: number;
    customer_name: string;
    phone: string;
    party_size: number;
    reserved_at: string;
    status: 'pending' | 'confirmed' | 'seated' | 'canceled';
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedReservations {
    data: Reservation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    reservations: PaginatedReservations;
    filters: {
        search?: string;
        status?: string;
    };
}

const statusLabels = {
    pending: 'Đang chờ',
    confirmed: 'Đã xác nhận',
    seated: 'Đã ngồi',
    canceled: 'Đã hủy',
};

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    seated: 'bg-blue-100 text-blue-800',
    canceled: 'bg-red-100 text-red-800',
};

export default function Index({ reservations, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/reservations', { search, status }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa đặt bàn này?')) {
            router.delete(`/reservations/${id}`);
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <>
            <Head title="Quản lý đặt bàn" />

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white shadow">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý đặt bàn nhà hàng</h1>
                            <Link href="/reservations/create" className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                                + Tạo mới
                            </Link>
                        </div>

                        {/* Filters */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="pending">Đang chờ</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="seated">Đã ngồi</option>
                                    <option value="canceled">Đã hủy</option>
                                </select>
                                <button type="submit" className="rounded-md bg-gray-600 px-6 py-2 font-medium text-white hover:bg-gray-700">
                                    Tìm kiếm
                                </button>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Tên khách hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Số điện thoại
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Số người</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Thời gian đặt bàn
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {reservations.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    ) : (
                                        reservations.data.map((reservation) => (
                                            <tr key={reservation.id}>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{reservation.id}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{reservation.customer_name}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{reservation.phone}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{reservation.party_size}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {formatDateTime(reservation.reserved_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${statusColors[reservation.status]}`}
                                                    >
                                                        {statusLabels[reservation.status]}
                                                    </span>
                                                </td>
                                                <td className="space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                    <Link href={`/reservations/${reservation.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                                        Sửa
                                                    </Link>
                                                    <button onClick={() => handleDelete(reservation.id)} className="text-red-600 hover:text-red-900">
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {reservations.last_page > 1 && (
                            <div className="border-t border-gray-200 px-6 py-4">
                                <div className="flex justify-center space-x-2">
                                    {reservations.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveState
                                            className={`rounded px-3 py-1 ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                      ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                      : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
