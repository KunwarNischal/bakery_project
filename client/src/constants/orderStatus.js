export const ORDER_STATUSES = [
    'Pending',
    'Preparing',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
];

export const getStatusColor = (status) => {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-700';
        case 'Preparing':
            return 'bg-blue-100 text-blue-700';
        case 'Processing':
            return 'bg-indigo-100 text-indigo-700';
        case 'Shipped':
            return 'bg-purple-100 text-purple-700';
        case 'Delivered':
            return 'bg-green-100 text-green-700';
        case 'Cancelled':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};
