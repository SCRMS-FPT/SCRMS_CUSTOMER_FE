"use client"

import { useState, useRef } from "react"
// Giả định rằng các biểu tượng được import từ một file khác
import sportsData from "../data/sportsData";

const CourtForm = ({ court, onSave, onCancel, sportsCenters }) => {
  const initialFormData = court
    ? {
      ...court,
    }
    : {
      name: "",
      sports_center_id: "",
      sport_id: "",
      description: "",
      court_type: "Ngoài trời",
      facilities: {
        lighting: false,
        locker_room: false,
        parking: "limited",
      },
      images: {
        avatar: "",
        images: ["", ""],
      },
      status: "open",
    }

  const [formData, setFormData] = useState(initialFormData)
  const avatarInputRef = useRef(null)
  const image1InputRef = useRef(null)
  const image2InputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFacilityChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      facilities: {
        ...formData.facilities,
        [name]: type === "checkbox" ? checked : value,
      },
    })
  }

  const handleImageUpload = (e, type, index = null) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (type === "avatar") {
        setFormData({
          ...formData,
          images: {
            ...formData.images,
            avatar: event.target.result,
          },
        })
      } else if (type === "gallery") {
        const updatedImages = [...formData.images.images]
        updatedImages[index] = event.target.result
        setFormData({
          ...formData,
          images: {
            ...formData.images,
            images: updatedImages,
          },
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="court-form">
      <h2>{court ? "Chỉnh Sửa Sân" : "Thêm Sân Mới"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">
              Tên Sân <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sports_center_id">
              Trung Tâm Thể Thao <span className="required">*</span>
            </label>
            <select
              id="sports_center_id"
              name="sports_center_id"
              value={formData.sports_center_id}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">-- Chọn Trung Tâm --</option>
              {sportsCenters.map((center) => (
                <option key={center.centerId} value={center.centerId}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sport_id">
              Môn Thể Thao <span className="required">*</span>
            </label>
            <select
              id="sport_id"
              name="sport_id"
              value={formData.sport_id}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">-- Chọn Môn Thể Thao --</option>
              {sportsData.map((sport, index) => (
                <option key={index} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="court_type">Loại Sân</label>
            <select
              id="court_type"
              name="court_type"
              value={formData.court_type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Ngoài trời">Ngoài trời</option>
              <option value="Trong nhà">Trong nhà</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Trạng Thái</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-control">
              <option value="open">Đang mở</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô Tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="form-control"
          />
        </div>

        <div className="form-section">
          <h3>Tiện Ích</h3>
          <div className="facilities-grid">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="lighting"
                name="lighting"
                checked={formData.facilities.lighting}
                onChange={handleFacilityChange}
              />
              <label htmlFor="lighting">Chiếu sáng</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="locker_room"
                name="locker_room"
                checked={formData.facilities.locker_room}
                onChange={handleFacilityChange}
              />
              <label htmlFor="locker_room">Phòng thay đồ</label>
            </div>

            <div className="select-group">
              <label htmlFor="parking">Bãi đỗ xe</label>
              <select
                id="parking"
                name="parking"
                value={formData.facilities.parking}
                onChange={handleFacilityChange}
                className="form-control"
              >
                <option value="limited">Hạn chế</option>
                <option value="sufficient">Đầy đủ</option>
                <option value="ample">Rộng rãi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Hình Ảnh</h3>

          <div className="image-upload-section">
            <div className="image-upload-group">
              <label>Ảnh đại diện</label>
              <div className="image-preview-container">
                {formData.images.avatar && (
                  <div className="image-preview">
                    <img src={formData.images.avatar || "/placeholder.svg"} alt="Ảnh đại diện" />
                  </div>
                )}
                <div className="image-upload-controls">
                  <input
                    type="file"
                    id="avatar"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "avatar")}
                    style={{ display: "none" }}
                  />
                  <button type="button" className="upload-btn" onClick={() => avatarInputRef.current.click()}>
                    Chọn ảnh
                  </button>
                  {formData.images.avatar && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          images: {
                            ...formData.images,
                            avatar: "",
                          },
                        })
                      }
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="image-upload-group">
              <label>Hình ảnh 1</label>
              <div className="image-preview-container">
                {formData.images.images[0] && (
                  <div className="image-preview">
                    <img src={formData.images.images[0] || "/placeholder.svg"} alt="Hình ảnh 1" />
                  </div>
                )}
                <div className="image-upload-controls">
                  <input
                    type="file"
                    id="image1"
                    ref={image1InputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "gallery", 0)}
                    style={{ display: "none" }}
                  />
                  <button type="button" className="upload-btn" onClick={() => image1InputRef.current.click()}>
                    Chọn ảnh
                  </button>
                  {formData.images.images[0] && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => {
                        const updatedImages = [...formData.images.images]
                        updatedImages[0] = ""
                        setFormData({
                          ...formData,
                          images: {
                            ...formData.images,
                            images: updatedImages,
                          },
                        })
                      }}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="image-upload-group">
              <label>Hình ảnh 2</label>
              <div className="image-preview-container">
                {formData.images.images[1] && (
                  <div className="image-preview">
                    <img src={formData.images.images[1] || "/placeholder.svg"} alt="Hình ảnh 2" />
                  </div>
                )}
                <div className="image-upload-controls">
                  <input
                    type="file"
                    id="image2"
                    ref={image2InputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "gallery", 1)}
                    style={{ display: "none" }}
                  />
                  <button type="button" className="upload-btn" onClick={() => image2InputRef.current.click()}>
                    Chọn ảnh
                  </button>
                  {formData.images.images[1] && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => {
                        const updatedImages = [...formData.images.images]
                        updatedImages[1] = ""
                        setFormData({
                          ...formData,
                          images: {
                            ...formData.images,
                            images: updatedImages,
                          },
                        })
                      }}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Lưu
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourtForm

