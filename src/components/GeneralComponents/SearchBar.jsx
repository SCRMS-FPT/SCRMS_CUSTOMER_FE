import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch } from "react-icons/fa";

const schema = yup
  .object({
    date: yup.date().required("Bạn phải nhập ngày"),
    skillLevel: yup
      .string()
      .required("Bạn phải chọn mức kỹ năng bạn mong muốn ghép"),
  })
  .required();

const SearchBar = ({ onSearch }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    onSearch(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span>Ngày chơi </span>
          <Controller
            name="date"
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                placeholderText="Select date"
                className="w-full p-2 border rounded"
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>
        <div>
          <Controller
            name="skillLevel"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select {...field} className="w-full p-2 border rounded">
                <option value="">Lựa chọn trình độ</option>
                <option value="beginner">Mới chơi</option>
                <option value="intermediate">Bình thường</option>
                <option value="advanced">Chuyên nghiệp</option>
              </select>
            )}
          />
          {errors.skillLevel && (
            <p className="text-red-500 text-sm mt-1">
              {errors.skillLevel.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="ms-auto mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full md:w-auto"
      >
        <FaSearch className="mr-2" />
        Tìm kiếm
      </button>
    </form>
  );
};

export default SearchBar;
