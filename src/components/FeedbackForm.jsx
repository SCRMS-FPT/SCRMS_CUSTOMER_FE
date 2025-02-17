import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";

const schema = yup
  .object({
    name: yup.string().required("Bạn phải điền tên vào"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Bạn phải điền email vào"),
    message: yup.string().required("Bạn phải điền ý kiến của bạn vào"),
  })
  .required();

const FeedbackForm = ({ show, onClose, title = "Mẫu đánh giá" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);

    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="ps-1 pt-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="ps-1 pt-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ý kiến
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={4}
                  className="ps-1 pt-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Gửi
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackForm;
