import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ApiException, Client } from "@/API/IdentityApi";

const VerificationView = () => {
  const [verificationState, setVerificationState] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  const client = new Client();
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setVerificationState("error");
          setMessage("Thiếu mã xác thực");
          return;
        }
        await client.verify(token);

        setVerificationState("success");
        setMessage("Tài khoản của bạn đã được xác thực thành công!");
      } catch (error) {
        setVerificationState("error");
        let errorMsg =
          "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau.";
        if (error instanceof ApiException) {
          try {
            const errorResponse = JSON.parse(error.response);
            errorMsg = errorResponse.detail || errorMsg;

            if (errorMsg.includes("not valid")) {
              errorMsg = "Token không hợp lệ.";
            } else if (errorMsg.includes("already exists")) {
              errorMsg = "Người dùng đã tồn tại, không cần xác minh.";
            }
          } catch (e) {
            errorMsg = e.message || errorMsg;
          }
        }
        setMessage(errorMsg);
        console.error("Verification error:", error);
      }
    };
    verifyToken();
  }, []);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-blue-600 h-2 w-full" />

        <div className="p-8">
          <motion.div
            className="flex flex-col items-center justify-center text-center space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 flex items-center justify-center">
              {verificationState === "loading" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Loader2 size={64} className="text-blue-500" />
                </motion.div>
              )}

              {verificationState === "success" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle size={64} className="text-green-500" />
                </motion.div>
              )}

              {verificationState === "error" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <AlertCircle size={64} className="text-red-500" />
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <motion.h1
                className="text-2xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {verificationState === "loading" && "Đang Xác Thực Tài Khoản"}
                {verificationState === "success" && "Xác Thực Thành Công"}
                {verificationState === "error" && "Xác Thực Thất Bại"}
              </motion.h1>

              <motion.p
                className={`text-sm ${
                  verificationState === "error"
                    ? "text-red-600"
                    : verificationState === "success"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {verificationState === "loading"
                  ? "Vui lòng đợi trong khi chúng tôi xác thực tài khoản của bạn..."
                  : message}
              </motion.p>
            </div>

            {verificationState !== "loading" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Trở Về Trang Chủ
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          className="bg-blue-50 p-4 text-center text-xs text-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Nếu bạn gặp vấn đề, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerificationView;
