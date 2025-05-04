import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BookingStatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      label: "Đang chờ xác nhận",
    },
    confirmed: {
      bg: "bg-green-50",
      text: "text-green-600",
      label: "Đã xác nhận",
    },
    cancelled: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      label: "Đã hủy",
    },
    completed: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "Đã hoàn thành",
    },
  };

  const config = statusMap[status] || statusMap.pending;

  return (
    <span
      className={`${config.bg} ${config.text} text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
};

const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  bookingDetail,
  loading,
  onConfirm,
  onReject,
  onCancel,
  statusUpdated,
  bookingStatuses,
}) => {
  const [status, setStatus] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [showCancelReasonInput, setShowCancelReasonInput] = useState(false);

  useEffect(() => {
    if (booking && bookingStatuses) {
      const bookingStatus = bookingStatuses.find(
        (status) => status.id === booking.id
      );
      setStatus(bookingStatus);
    }
  }, [booking, bookingStatuses]);

  const canConfirm = booking?.status === "pending";
  const canReject = booking?.status === "pending";
  const canCancel =
    (booking?.status === "pending" || booking?.status === "completed") &&
    booking?.bookingDate &&
    new Date(booking.bookingDate) > new Date();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "EEEE, dd/MM/yyyy", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleCancelClick = () => {
    setShowCancelReasonInput(true);
  };

  const handleCancelSubmit = () => {
    if (!cancellationReason.trim()) {
      alert("Vui lòng nhập lý do hủy buổi học");
      return;
    }

    onCancel(booking.id, cancellationReason);
    setShowCancelReasonInput(false);
    setCancellationReason("");
  };

  if (!isOpen || !booking) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Chi tiết lịch đặt
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-700">
                            Thông tin buổi học
                          </h4>
                          <BookingStatusBadge status={booking.status} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-500">Mã đặt lịch</p>
                            <p className="font-medium">{booking.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ngày học</p>
                            <p className="font-medium">
                              {formatDate(booking.bookingDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Thời gian</p>
                            <p className="font-medium">
                              {`${booking.startTime || "N/A"} - ${
                                booking.endTime || "N/A"
                              }`}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tổng phí</p>
                            <p className="font-medium">
                              {booking.totalPrice
                                ? booking.totalPrice.toLocaleString("vi-VN") +
                                  " VND"
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Gói tập</p>
                            <p className="font-medium">
                              {booking.packageName || "Buổi tập lẻ"}
                            </p>
                          </div>
                          {booking.status === "cancelled" && (
                            <div className="col-span-2">
                              <p className="text-sm text-gray-500">Lý do hủy</p>
                              <p className="font-medium text-rose-600">
                                {booking.cancellationReason ||
                                  "Không có thông tin"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-4">
                          Thông tin học viên
                        </h4>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                              {booking.user?.avatarUrl ? (
                                <img
                                  src={booking.user.avatarUrl}
                                  alt="User Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-emerald-700 text-lg font-medium">
                                  {booking.user?.firstName?.[0] || "U"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {booking.user?.firstName &&
                                booking.user?.lastName
                                  ? `${booking.user.firstName} ${booking.user.lastName}`
                                  : booking.user?.fullName || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.user?.email || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Số điện thoại
                              </p>
                              <p className="font-medium">
                                {booking.user?.phoneNumber ||
                                  booking.user?.phone ||
                                  "N/A"}
                              </p>
                            </div>
                            {booking.user?.birthDate && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  Ngày sinh
                                </p>
                                <p className="font-medium">
                                  {format(
                                    new Date(booking.user.birthDate),
                                    "dd/MM/yyyy"
                                  )}
                                </p>
                              </div>
                            )}
                            {booking.user?.gender && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  Giới tính
                                </p>
                                <p className="font-medium">
                                  {booking.user.gender === "Male"
                                    ? "Nam"
                                    : booking.user.gender === "Female"
                                    ? "Nữ"
                                    : "Khác"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {status && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-700 mb-2">
                            Trạng thái gần nhất
                          </h4>
                          <div className="text-sm text-gray-600">
                            {status.message}
                            <span className="text-xs text-gray-400 ml-2">
                              {new Date(status.updated_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {showCancelReasonInput && (
                        <div className="mt-4 mb-4">
                          <label
                            htmlFor="cancellationReason"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Lý do hủy buổi học
                          </label>
                          <textarea
                            id="cancellationReason"
                            value={cancellationReason}
                            onChange={(e) =>
                              setCancellationReason(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            rows="3"
                            placeholder="Vui lòng nhập lý do hủy buổi học"
                          ></textarea>
                          <div className="mt-3 flex justify-end space-x-3">
                            <button
                              type="button"
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              onClick={() => setShowCancelReasonInput(false)}
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                              onClick={handleCancelSubmit}
                            >
                              Xác nhận hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {canConfirm && !statusUpdated && !showCancelReasonInput && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      onClick={() => onConfirm(booking.id)}
                    >
                      Xác nhận buổi học
                    </button>
                  )}
                  {canReject && !statusUpdated && !showCancelReasonInput && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                      onClick={() => onReject(booking.id)}
                    >
                      Từ chối buổi học
                    </button>
                  )}
                  {canCancel && !statusUpdated && !showCancelReasonInput && (
                    <button
                      type="button"
                      className="px-4 py-2 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      onClick={handleCancelClick}
                    >
                      Hủy buổi học
                    </button>
                  )}
                  {!showCancelReasonInput && (
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                      onClick={onClose}
                    >
                      Đóng
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingDetailModal;
